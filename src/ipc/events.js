const config = require('../../config/config');
const _ = require('../js/utils');
const ytdl = require('ytdl-core');
const fs = require('fs');

module.exports = {

    async getVideoInfo(url) {
        return ytdl.getBasicInfo(url);
    },

    async startDownload({basicInfo, format}, {sender}) {
        const [container] = format.type.split(';');
        const [, type] = container.split('/');

        // Validate type
        if (!type) {
            throw `Cannot examine filetype. Got ${format.type} as type`;
        }

        // Build destination path
        const filteredTitle = basicInfo.title.replace(/[/\\?%*:|"<>]/g, ' ').replace(/ +/g, ' ');
        const destination = `${config.downloadDirectory}\\${filteredTitle}.${type}`;

        // Create streams and pipe stuff
        const source = ytdl(basicInfo.video_url, {format});
        const stream = source.pipe(fs.createWriteStream(destination));

        // Create download id
        const downloadId = _.createUID();

        sender.send('add-download', {
            id: downloadId,
            destination,
            format,
            size: format.clen,
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
        let progress = 0;
        const update = _.throttleEvent(() => sender.send('update-download', {
            id: downloadId,
            props: {progress}
        }));

        source.on('data', chunk => {
            progress += chunk.length;
            update();
        });

        stream.on('finish', () => sender.send('update-download', {
            id: downloadId,
            props: {
                status: 'finish',
                progress: format.clen
            }
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
