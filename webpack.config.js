const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src')
        }
    },

    module: {
        rules: [
            {
                test: /\.(s[ac]|c)ss$/,
                use: [
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            additionalData: '@import "@src/renderer/scss/_global.scss";'
                        }
                    }
                ]
            }
        ]
    }
};
