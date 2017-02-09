const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.base');

module.exports = () => (
    webpackMerge(webpackConfig, {

        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development'),
                },
                __DEV__: JSON.stringify(true),
            }),
        ],

    })
);
