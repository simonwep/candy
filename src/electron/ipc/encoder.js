const ffmpeg = require('fluent-ffmpeg/lib/fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');
const path = require('path');

// Apply static paths
if (process.env.NODE_ENV !== 'production') {
    ffmpegStatic.path = path.resolve(ffmpegStatic.path.replace('dist_electron', 'node_modules/ffmpeg-static'));
    ffprobeStatic.path = path.resolve(ffprobeStatic.path.replace('dist_electron', 'node_modules/ffmpeg-static'));
}

ffmpeg.setFfmpegPath(ffmpegStatic.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);

module.exports = {

    async merge([audio, video], destination) {
        return new Promise((resolve, reject) => {
            ffmpeg().input(audio).audioCodec('aac')
                .input(video).videoCodec('libx264')
                .on('end', resolve)
                .on('error', reject)
                .outputOptions('-preset veryfast')
                .output(destination).run();
        });
    },

    async convert(source, destination) {
        return new Promise((resolve, reject) => {
            ffmpeg().input(source)
                .on('end', resolve)
                .on('error', reject)
                .output(destination).run();
        });
    }
};
