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
    }
};
