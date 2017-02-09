const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const webpackConfig = require('./webpack.config.base');

const outputPath = path.join(process.env.PWD, '<%= destPath %>');

module.exports = () => (
    webpackMerge(webpackConfig, {

        output: {
            path: outputPath,
        },

        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production'),
                },
                __DEV__: JSON.stringify(false),
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false,
            }),
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true,
                },
                compress: {
                    screw_ie8: true,
                    warnings: false,
                },
                comments: false,
            }),
        ],

        cache: false,

    })
);
