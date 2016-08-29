var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var _ = require('lodash');
var path = require('path');

module.exports = _.merge({}, webpackConfig, {
    
    output: {
        path: path.join(process.env.PWD, '<%= destPath %>')
    },
    
    plugins: [
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
    
});
