const config = require('../../config/config');
const ytdl = require('ytdl-core');
const fs = require('fs');

module.exports = {

    async getVideoInfo(url) {
        return ytdl.getBasicInfo(url);
    },

    async startDownload({basicInfo, format}) {
        const [container] = format.type.split(';');
        const [, type] = container.split('/');

        // Validate type
        if (!type) {
            throw `Cannot examine filetype. Got ${format.type} as type`;
        }

        const destination = `${config.downloadDirectory}\\${basicInfo.title}.${type}`;
        const stream = ytdl(basicInfo.video_url, {format}).pipe(fs.createWriteStream(destination));

        return 'ok';
    }
};
