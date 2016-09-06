var webpack = require('webpack');
var path = require('path');

var contextPath = path.join(process.env.PWD, '<%= srcPath %>');
var outputPath = path.join(process.env.PWD, '<%= tmpPath %>');
var publicPath = '<%= publicPath %>';

module.exports = {
    
    context: contextPath,
    
    entry: {
        main: './index',
        config: './config',
        vendor: <%- JSON.stringify(vendors).replace(/\"/gi, '\'') %>
    },
    
    output: {
        path: outputPath,
        filename: '[name].js',
        publicPath: publicPath,
        chunkFilename: '[name]-[id].bundle.js'
    },
    
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            'root.jQuery': 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js',
            chunks: ['main','vendor']
        })
    ],
    
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'stage-0']
                }
            },
            {
                test: /.json$/,
                loader: 'json',
                exclude: /node_modules/,
            },
            {
                test: /.html$/,
                loader: 'html',
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                exclude: /(node_modules|bower_components|\.tmp)/,
                loader: 'babel?presets[]=es2015&presets[]=react!svg-react'
            },
            {
                test: /\.scss$/,
                loader: 'style!css?modules&importLoaders=1&sourceMap&localIdentName=[local]___[hash:base64:5]!sass'
            }
        ],
        postLoaders: [
            {
                test: require.resolve('react'),
                loader: 'expose?React'
            },
            {
                test: require.resolve('jquery'),
                loader: 'expose?jQuery'
            },
            {
                test: require.resolve(path.join(contextPath, 'config')),
                loader: 'expose?app_config'
            }
        ]
     },
    
    resolve: {
        extensions: ['', '.js', '.jsx', '.es6'],
        alias: {
            underscore: 'lodash'
        },
        modulesDirectories: [
            path.join(process.env.PWD, './node_modules'),
            path.join(process.env.PWD, './web_modules'),
            path.join(process.env.PWD, './bower_components')
        ]
    },

    stats: {
        colors: true,
        modules: true,
        reasons: true
    },

    storeStatsTo: 'webpack',

    progress: true,

    devtool: 'source-map',
    cache: false,
    watch: false
    
};
