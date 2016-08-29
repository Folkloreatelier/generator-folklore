var path = require('path');

module.exports = {
    
    context: path.join(process.env.PWD, './src/js'),
    
    entry: {
        'main': [
            './index'
        ]
    },
    
    output: {
        path: path.join(process.env.PWD, '.tmp/js'),
        filename: '[name].js',
        publicPath: '/js',
        chunkFilename: '[name]-[id].bundle.js'
    },
    
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
            }
        ]
     },
    
    resolve: {
        extensions: ['', '.js', '.jsx', '.es6'],
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
