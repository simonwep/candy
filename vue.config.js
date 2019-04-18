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
                mac: {
                    icon: 'assets/icons/512x512.png'
                },
                win: {
                    icon: 'assets/icons/512x512.png'
                },
                linux: {
                    icon: 'assets/icons/256x256.png'
                }
            }
        }
    }
};
