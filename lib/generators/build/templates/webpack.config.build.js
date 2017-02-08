var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var _ = require('lodash');
var path = require('path');

var outputPath = path.join(process.env.PWD, '<%= destPath %>');

module.exports = _.extend({}, webpackConfig, {

    output: _.extend({}, webpackConfig.output, {
        path: outputPath
    }),

    plugins: [].concat(webpackConfig.plugins).concat([
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            },
            '__DEV__': JSON.stringify(false),
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ])

});
