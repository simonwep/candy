const config = require('../../../config/config');
const id3tags = require('../../../config/id3tags');
const _ = require('../../js/utils');
const encoder = require('./encoder');
const ytdl = require('ytdl-core');
const path = require('path');
const os = require('os');
const fs = require('fs');

module.exports = {

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
                    }).catch(() => {
                        update({status: 'errored'});
                    }).finally(() => {

                        // Unlink temporary files
                        destiantions.forEach(fs.unlinkSync);
                    });
                }
            });

            sourceStream.on('error', () => {
                sourceStreams.forEach(s => s.close());
                sender.send('update-download', {
                    id: downloadId,
                    props: {status: 'errored'}
                });
            });
        }

        return 'ok';
    }
};
