module.exports = {
    pages: {
        index: {
            entry: 'src/vue/main.js'
        }
    },

    css: {
        loaderOptions: {
            sass: {
                data: `
                    @import "@/scss/_main.scss";
                `
            }
        }
    },

    pluginOptions: {
        electronBuilder: {

            <!-- Electron config -->
            builderOptions: {
                productName: 'Candy downloader',
                appId: 'com.candy.candy',
                asar: true,
                mac: {
                    icon: 'assets/icons/512x512.png',
                    extraResources: [
                        './node_modules/ffmpeg-static/bin/darwin',
                        './node_modules/ffprobe-static/bin/darwin'
                    ],
                },
                win: {
                    icon: 'assets/icons/512x512.png',
                    extraResources: [
                        './node_modules/ffmpeg-static/bin/win32',
                        './node_modules/ffprobe-static/bin/win32'
                    ],
                },
                linux: {
                    icon: 'assets/icons/256x256.png',
                    extraResources: [
                        './node_modules/ffmpeg-static/bin/linux',
                        './node_modules/ffprobe-static/bin/linux'
                    ],
                }
            }
        }
    }
};
