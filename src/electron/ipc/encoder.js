const ffmpeg = require('fluent-ffmpeg/lib/fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');
const path = require('path');
const os = require('os');
const ac = os.cpus().length - 2; // Thread limit

// Apply static paths
if (process.env.NODE_ENV !== 'production') {
    ffmpegStatic.path = path.resolve(ffmpegStatic.path.replace('dist_electron', 'node_modules/ffmpeg-static'));
    ffprobeStatic.path = path.resolve(ffprobeStatic.path.replace('dist_electron', 'node_modules/ffmpeg-static'));
} else {
    ffmpegStatic.path = path.resolve(ffmpegStatic.path.replace(/app.*?([/\\])/, 'node_modules/ffmpeg-static/'));
    ffprobeStatic.path = path.resolve(ffprobeStatic.path.replace(/app.*?([/\\])/, 'node_modules/ffprobe-static/'));
}

ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);

// Promise queue
const request = (() => {
    let active = 0;
    let chain = [];

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
