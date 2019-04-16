const id3tags = require('../../../../config/id3tags');
const config = require('../../../../config/config');
const _ = require('../../../js/utils');
const encoder = require('../encoder');
const ytdl = require('ytdl-core');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Holds downloadid - actions references
const activeDownloads = {};

module.exports = {

    /**
     * Fetches all available informations (including available streams) of a video
     * @param url
     * @returns {Promise<videoInfo>}
     */
    async getVideoInfo(url) {
        const info = await ytdl.getBasicInfo(url);
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

        // Create temporary folder
        const tmpDir = path.join(os.tmpdir(), config.tmpFolderName);
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        // Create download id and start timestamp
        const downloadId = _.createUID();

        sender.send('add-download', {
            id: downloadId,
            destination: null,
            sources,
            size: 0,
            speed: 0,
            progress: 0,
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
        const update = _.throttleEvent(props => sender.send('update-download', {id: downloadId, props}));

        let totalProgress = 0; // Downloaded bytes
        let totalsize = 0; // Total download size
        let done = 0; // Streams count which are done

        const destiantions = [];
        const sourceStreams = [];
        for (const {itag, container} of sources) {
            const destiantion = path.join(tmpDir, `${_.createUID()}.${container}`);
            const sourceStream = ytdl(video.video_url, {
                quality: itag,
                highWaterMark: 16384
            });

            // Pipe to temporary destination
            sourceStream.pipe(fs.createWriteStream(destiantion));

            // Save destinations and strema
            destiantions.push(destiantion);
            sourceStreams.push(sourceStream);

            // Listen for events
            sourceStream.on('response', res => totalsize += Number(res.headers['content-length']));

            let lastProgress = 0;
            sourceStream.on('progress', (_, progress) => {
                totalProgress += progress - lastProgress;

                update({
                    progress: totalProgress,
                    speed: (lastProgress + progress) / 2,
                    size: totalsize
                });

                lastProgress = progress;
            });

            sourceStream.on('end', () => {
                done++;

                // Check if this was the last stream
                if (done === sources.length) {

                    // Update render process
                    update({
                        progress: totalsize,
                        size: totalsize,
                        status: 'convert'
                    });

                    // Build destination path
                    const filteredTitle = video.title.replace(/[/\\?%*:|"<>]/g, ' ').replace(/ +/g, ' ');
                    let prom;

                    // Start appropriate conversion
                    if (sources.length === 1) {
                        prom = encoder.convert(
                            destiantion,
                            path.join(config.downloadDirectory, `${filteredTitle}.${format}`)
                        );
                    } else {
                        prom = encoder.merge(
                            destiantions,
                            path.join(config.downloadDirectory, `${filteredTitle}.${format}`)
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
