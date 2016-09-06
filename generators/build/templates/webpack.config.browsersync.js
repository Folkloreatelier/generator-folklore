var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var _ = require('lodash');
var path = require('path');

module.exports = _.merge({}, webpackConfig, {
    
    plugins: [
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('development')
            }
        })
    ]
    
});
