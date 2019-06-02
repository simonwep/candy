const id3tags = require('../../../../config/id3tags');
const {createUID, throttleEvent, mkdirIfNotPresent, maskFilename} = require('../../../js/utils');
const {getSettings} = require('./settings');
const {log} = require('./log');
const encoder = require('../encoder');
const ytdl = require('ytdl-core');
const path = require('path');
const fs = require('fs');

// Holds downloadid - actions references
const activeDownloads = {};
const downloads = {

    /**
     * Fetches all available informations (including available streams) of a video
     * @param videoid The video id
     * @returns {Promise<videoInfo>}
     */
    async getVideoInfo(videoid) {
        const info = await ytdl.getBasicInfo(`https://www.youtube.com/watch?v=${videoid}`);
        const resolvedFormats = [];

        // Replace thumbnail url with higher quality
        info.thumbnail_url = `https://img.youtube.com/vi/${info.video_id}/0.jpg`;

        // Resolve itags
        for (const {itag, clen, url} of info.formats) {
            const format = itag && id3tags[itag];

            if (format) {
                resolvedFormats.push({
                    ...format, clen, url, itag
                });
            }
        }

        // Log
        await log('INFO', `Get video info from ${videoid}`);

        info.formats = resolvedFormats;
        return info;
    },

    /**
     * Starts the download of channel/s
     * @param playlist Optional playlist where this item correspondents to
     * @param format Media container
     * @param video The videos basic info gathered by getVideoInfo
     * @param sources Channels
     * @param downloadId
     * @param sender
     * @returns {Promise<string>}
     */
    async startDownload({playlist, format, video, sources, downloadId = createUID()}, {sender}) {
        const settings = await getSettings();
        let {temporaryDirectory, downloadDirectory} = settings;

        // Check if an additional directory with the author's name should be made for this video
        if (settings.createChannelDirectory) {
            downloadDirectory = mkdirIfNotPresent(path.resolve(downloadDirectory, maskFilename(video.author.name)));
        }

        // Check if an additional directory with the playlist name is requested
        if (playlist) {
            downloadDirectory = mkdirIfNotPresent(path.resolve(downloadDirectory, maskFilename(playlist.title)));
        }

        // Build destination path
        const destinationFile = path.join(downloadDirectory, `${maskFilename(video.title)}.${format}`);

        // Log
        await log('INFO', `Download ${downloadId}: Initiated`);

        sender.send('add-download', {
            id: downloadId,
            destination: null,
            paused: false,
            sources,
            size: 1, // Prevents trough zero divisions
            progress: 0,
            status: 'progress',
            startTimestamp: Date.now(),
            video
        });

        // Create throttled update event handler
        const update = throttleEvent(props => sender.send('update-download', {id: downloadId, props}));

        let totalProgress = 0; // Downloaded bytes
        let totalSize = 0; // Total download size
        let done = 0; // Streams count which are done

        const tmpFiles = [];
        const sourceStreams = [];
        for (const {itag, container} of sources) {
            const tmpFile = path.join(temporaryDirectory, `${createUID()}.${container}`);
            const sourceStream = ytdl(video.video_url, {
                quality: itag,
                highWaterMark: 16384
            });

            // Log
            await log('INFO', `Download ${downloadId}: Start download of media with itag ${itag} / ${container}`);

            // Pipe to temporary destination
            sourceStream.pipe(fs.createWriteStream(tmpFile));

            // Save destinations and strema
            tmpFiles.push(tmpFile);
            sourceStreams.push(sourceStream);

            let lastProgress = 0;
            let lastSize = 0;
            sourceStream.on('progress', (_, progress, size) => {
                totalProgress += progress - lastProgress;
                totalSize -= lastSize;

                update({
                    progress: totalProgress,
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

                    // Start appropriate conversion
                    const sourceFiles = sources.length === 1 ? tmpFile : tmpFiles;
                    encoder[sources.length === 1 ? 'convert' : 'merge'](sourceFiles, destinationFile).then(() => {
                        update({
                            status: 'finish',
                            endTimestamp: Date.now(),
                            destinationFile
                        });
                    }).catch(e => {

                        /* eslint-disable no-console */
                        console.error(e);

                        // Log
                        log('ERROR', `Encoding ${downloadId}: Errored ${e.message} / ${e.toString()}`);

                        update({status: 'errored'});
                    }).finally(() => {

                        // Unlink temporary files
                        tmpFiles.forEach(fs.unlinkSync);
                    });
                }
            });

            sourceStream.on('error', e => {

                /* eslint-disable no-console */
                console.error(e);

                // Log
                log('ERROR', `Download ${downloadId}: Errored ${e.message} / ${e.toString()}`);

                if (e !== 'cancelled') {
                    sourceStreams.forEach(s => s.destroy());
                    tmpFiles.forEach(fs.unlinkSync);
                    update({status: 'errored'});
                }
            });
        }

        // Expose download functions
        activeDownloads[downloadId] = {
            cancel() {
                log('INFO', `Download ${downloadId}: Cancelled`);
                sourceStreams.forEach(s => s.destroy('cancelled'));
                fs.existsSync(destinationFile) && fs.unlinkSync(destinationFile);
                update({status: 'cancelled'});
            },

            pause() {
                log('INFO', `Download ${downloadId}: Paused`);
                sourceStreams.forEach(s => !s.isPaused() && s.pause());
                update({status: 'paused'});
            },

            resume() {
                log('INFO', `Download ${downloadId}: Resumed`);
                sourceStreams.forEach(s => s.isPaused() && s.resume());
                update({status: 'progress'});
            },

            retry() {
                log('INFO', `Download ${downloadId}: Retry`);
                downloads.startDownload({playlist, format, video, sources, downloadId}, {sender});
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
    },

    /**
     * Pauses a download
     * @param downloadId
     * @returns {Promise<string>}
     */
    async pauseDownload({downloadId}) {
        const item = activeDownloads[downloadId];
        item && item.pause();
        return 'ok';
    },

    /**
     * Resumes a download
     * @param downloadId
     * @returns {Promise<string>}
     */
    async resumeDownload({downloadId}) {
        const item = activeDownloads[downloadId];
        item && item.resume();
        return 'ok';
    },

    /**
     * Restarts a download
     * @param downloadId
     * @returns {Promise<string>}
     */
    async retryDownload({downloadId}) {
        const item = activeDownloads[downloadId];
        item && item.retry();
        return 'ok';
    }
};

module.exports = downloads;
