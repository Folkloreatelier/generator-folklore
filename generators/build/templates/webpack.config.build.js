var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var _ = require('lodash');
var path = require('path');

module.exports = _.merge({}, webpackConfig, {
    
    output: {
        path: path.join(process.env.PWD, 'dist/js/'),
        filename: '[name].js',
        chunkFilename: '[name]-[id].bundle.js'
    },
    
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
    
});
