module.exports = {
    pages: {
        index: {
            entry: 'src/vue/main.js'
        }
    },

    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/scss/_main.scss";`
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
                publish: null,
                mac: {
                    icon: 'assets/icons/512x512.png',
                    extraResources: [
                        './node_modules/ffmpeg-static/bin/darwin/x64',
                        './node_modules/ffprobe-static/bin/darwin/x64'
                    ],
                },
                win: {
                    icon: 'assets/icons/512x512.png',
                    extraResources: [
                        './node_modules/ffmpeg-static/bin/win32/x64',
                        './node_modules/ffprobe-static/bin/win32/x64'
                    ],
                },
                linux: {
                    icon: 'assets/icons/256x256.png',
                    extraResources: [
                        './node_modules/ffmpeg-static/bin/linux/x64',
                        './node_modules/ffprobe-static/bin/linux/x64'
                    ],
                }
            }
        }
    }
};
