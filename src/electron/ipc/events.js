const config = require('../../../config/config');
const id3tags = require('../../../config/id3tags');
const _ = require('../../js/utils');
const encoder = require('./encoder');
const ytdl = require('ytdl-core');
const path = require('path');
const os = require('os');
const fs = require('fs');

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
     * @param basicInfo The videos basic info gathered by getVideoInfo
     * @param sources Channels
     * @param sender
     * @returns {Promise<string>}
     */
    async startDownload({basicInfo, sources}, {sender}) {

        // Create temporary folder
        const tmpDir = path.join(os.tmpdir(), config.tmpFolderName);
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        // Create download id
        const downloadId = _.createUID();

        sender.send('add-download', {
            id: downloadId,
            destination: null,
            sources,
            size: 0,
            progress: 0,
            status: 'progress',
            video: {
                url: basicInfo.video_url,
                thumbnailUrl: basicInfo.thumbnail_url,
                duration: Number(basicInfo.length_seconds),
                title: basicInfo.title,
                author: basicInfo.author
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
            const sourceStream = ytdl(basicInfo.video_url, {
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
                lastProgress = progress;

                update({
                    progress: totalProgress,
                    size: totalsize
                });
            });

            sourceStream.on('end', () => {
                done++;

                // Check if this was the last stream
                if (done === sources.length) {

                    // Update render process
                    update({
                        progress: totalsize,
                        status: 'convert'
                    });

                    // Build destination path
                    const filteredTitle = basicInfo.title.replace(/[/\\?%*:|"<>]/g, ' ').replace(/ +/g, ' ');
                    let prom;

                    // Start appropriate conversion
                    if (sources.length === 1) {
                        const extension = sources[0].content.includes('video') ? 'mp4' : 'mp3';

                        prom = encoder.convert(
                            destiantion,
                            path.join(config.downloadDirectory, `${filteredTitle}.${extension}`)
                        );
                    } else {
                        prom = encoder.merge(
                            destiantions,
                            path.join(config.downloadDirectory, `${filteredTitle}.mp4`)
                        );
                    }

                    // Wait until done
                    prom.then(() => {
                        update({status: 'finish'});
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
                    update({status: e === 'cancelled' ? e : 'errored'});
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
