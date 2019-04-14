const ytdl = require('ytdl-core');

module.exports = {

    async getVideoInfo(url) {
        return ytdl.getBasicInfo(url);
    }
};
