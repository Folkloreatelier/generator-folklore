var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var _ = require('lodash');
var path = require('path');

module.exports = _.extend({}, webpackConfig, {

    plugins: [].concat(webpackConfig.plugins).concat([
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
            },
            '__DEV__': JSON.stringify(true),
        })
    ])

});
