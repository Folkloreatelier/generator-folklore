var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var _ = require('lodash');
var path = require('path');

var contextPath = path.join(process.env.PWD, '<%= srcPath %>');
var outputPath = path.join(process.env.PWD, '<%= tmpPath %>');

module.exports = _.extend({}, webpackConfig, {
    
    context: contextPath,
    
    output: {
        path: outputPath,
        filename: '[name].js',
        publicPath: '/js'
    },
    
    plugins: [
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('development')
            }
        })
    ],
    
    externals: {}
    
});
