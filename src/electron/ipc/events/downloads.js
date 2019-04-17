const id3tags = require('../../../../config/id3tags');
const {createUID, throttleEvent, mkdirIfNotPresent} = require('../../../js/utils');
const {getSettings} = require('./settings');
const encoder = require('../encoder');
const ytdl = require('ytdl-core');
const path = require('path');
const fs = require('fs');

// Holds downloadid - actions references
const activeDownloads = {};

module.exports = {

    /**
     * Fetches all available informations (including available streams) of a video
     * @param videoid The video id
     * @returns {Promise<videoInfo>}
     */
    async getVideoInfo(videoid) {
        const info = await ytdl.getBasicInfo(`https://www.youtube.com/watch?v=${videoid}`);
        const resolvedFormats = [];

        // Resolve itags
        for (const {itag, clen, url} of info.formats) {
            const format = itag && id3tags[itag];

            if (format) {
                resolvedFormats.push({
                    ...format, clen, url, itag
                });
            }
        }

        info.formats = resolvedFormats;
        return info;
    },

    /**
     * Starts the download of channel/s
     * @param format Media container
     * @param video The videos basic info gathered by getVideoInfo
     * @param sources Channels
     * @param sender
     * @returns {Promise<string>}
     */
    async startDownload({format, video, sources}, {sender}) {
        const settings = await getSettings();
        let {temporaryDirectory, downloadDirectory} = settings;

        // Create download id and start timestamp
        const downloadId = createUID();

        sender.send('add-download', {
            id: downloadId,
            destination: null,
            sources,
            size: 0,
            speed: 0,
            progress: 1, // Prevents trough zero divisions
            status: 'progress',
            startTimestamp: Date.now(),
            video: {
                url: video.video_url,
                thumbnailUrl: video.thumbnail_url,
                duration: Number(video.length_seconds),
                title: video.title,
                author: video.author
            }
        });

        // Create throttled update event handler
        const update = throttleEvent(props => sender.send('update-download', {id: downloadId, props}));

        let totalProgress = 0; // Downloaded bytes
        let totalSize = 0; // Total download size
        let done = 0; // Streams count which are done

        const destiantions = [];
        const sourceStreams = [];
        for (const {itag, container} of sources) {
            const destiantion = path.join(temporaryDirectory, `${createUID()}.${container}`);
            const sourceStream = ytdl(video.video_url, {
                quality: itag,
                highWaterMark: 16384
            });

            // Pipe to temporary destination
            sourceStream.pipe(fs.createWriteStream(destiantion));

            // Save destinations and strema
            destiantions.push(destiantion);
            sourceStreams.push(sourceStream);

            let lastProgress = 0;
            let lastSize = 0;
            sourceStream.on('progress', (_, progress, size) => {
                totalProgress += progress - lastProgress;
                totalSize -= lastSize;

                update({
                    progress: totalProgress,
                    speed: (lastProgress + progress) / 4,
                    size: totalSize += size
                });

                lastSize = size;
                lastProgress = progress;
            });

            sourceStream.on('end', () => {
                done++;

                // Check if this was the last stream
                if (done === sources.length) {
                    update({
                        progress: totalSize,
                        size: totalSize,
                        status: 'convert'
                    });

                    // Build destination path
                    const filteredTitle = video.title.replace(/[/\\?%*:|"<>]/g, ' ').replace(/ +/g, ' ');
                    let prom;

                    // Check if an additional directory with the author's name should be made for this video
                    if (settings.createChannelDirectory) {
                        downloadDirectory = mkdirIfNotPresent(path.resolve(downloadDirectory, video.author.name));
                    }

                    // Start appropriate conversion
                    if (sources.length === 1) {
                        prom = encoder.convert(
                            destiantion,
                            path.join(downloadDirectory, `${filteredTitle}.${format}`)
                        );
                    } else {
                        prom = encoder.merge(
                            destiantions,
                            path.join(downloadDirectory, `${filteredTitle}.${format}`)
                        );
                    }

                    // Wait until done
                    prom.then(() => {
                        update({status: 'finish', endTimestamp: Date.now()});
                    }).catch(e => {

                        /* eslint-disable no-console */
                        console.error(e);
                        update({status: 'errored'});
                    }).finally(() => {

                        // Unlink temporary files
                        destiantions.forEach(fs.unlinkSync);
                    });
                }
            });

            sourceStream.on('error', e => {

                /* eslint-disable no-console */
                console.error(e);

                if (e !== 'cancelled') {
                    sourceStreams.forEach(s => s.destroy());
                    destiantions.forEach(fs.unlinkSync);
                    update({status: 'errored'});
                }
            });
        }

        // Expose download functions
        activeDownloads[downloadId] = {
            cancel() {
                sourceStreams.forEach(s => s.destroy('cancelled'));
                update({status: 'cancelled'});
            }
        };

        return 'ok';
    },

    /**
     * Cancels a download. Deletes all remaining temporary files.
     * Only effective if in progress mode
     * @param downloadId
     * @returns {Promise<string>}
     */
    async cancelDownload({downloadId}) {
        const item = activeDownloads[downloadId];
        item && item.cancel();
        return 'ok';
    }
};
