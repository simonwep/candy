const ffmpeg = require('fluent-ffmpeg/lib/fluent-ffmpeg');
const ffprobeStaticpPath = require('ffprobe-static').path;
const ffmpegStaticPath = require('ffmpeg-static');
const ac = require('os').cpus().length - 2; // Thread limit

ffmpeg.setFfmpegPath(ffmpegStaticPath);
ffmpeg.setFfprobePath(ffprobeStaticpPath);

// Promise queue
const request = (() => {
    let active = 0;
    const chain = [];

    return async () => {
        active >= ac && await new Promise(resolve => chain.push(resolve));
        active++;
        return () => {
            active--;
            const next = chain.shift();
            next && next();
        };
    };
})();

module.exports = {

    async merge([audio, video], destination) {
        const done = await request();
        return new Promise((resolve, reject) => {
            ffmpeg().input(audio).audioCodec('aac')
                .input(video).videoCodec('libx264')
                .on('end', resolve)
                .on('error', reject)
                .outputOptions('-threads 1')
                .output(destination).run();
        }).finally(done);
    },

    async convert(source, destination) {
        const done = await request();
        return new Promise((resolve, reject) => {
            ffmpeg().input(source)
                .on('end', resolve)
                .on('error', reject)
                .output(destination).run();
        }).finally(done);
    }
};
