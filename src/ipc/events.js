const config = require('../../config/config');
const id3tags = require('../../config/id3tags');
const _ = require('../js/utils');
const ytdl = require('ytdl-core');
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

    async startDownload({basicInfo, format}, {sender}) {
        const {container, itag} = format;

        // Build destination path
        const filteredTitle = basicInfo.title.replace(/[/\\?%*:|"<>]/g, ' ').replace(/ +/g, ' ');
        const destination = `${config.downloadDirectory}\\${filteredTitle}.${container}`;

        // Create streams and pipe stuff
        const source = ytdl(basicInfo.video_url, {quality: itag});
        const stream = source.pipe(fs.createWriteStream(destination));

        // Create download id
        const downloadId = _.createUID();

        sender.send('add-download', {
            id: downloadId,
            destination,
            format,
            size: 0,
            progress: 0,
            status: 'progress',
            video: {
                url: basicInfo.video_url,
                thumbnailUrl: basicInfo.thumbnail_url,
                duration: Number(basicInfo.length_seconds),
                title: basicInfo.title,
                author: basicInfo.auhor
            }
        });

        // Watch for events
        const update = _.throttleEvent(props => sender.send('update-download', {
            id: downloadId,
            props
        }));

        source.on('progress', (_, progress, size) => update({
            progress,
            size,
            status: progress >= size ? 'finish' : 'progress'
        }));

        stream.on('error', () => sender.send('update-download', {
            id: downloadId,
            props: {
                status: 'errored'
            }
        }));

        return 'ok';
    }
};
