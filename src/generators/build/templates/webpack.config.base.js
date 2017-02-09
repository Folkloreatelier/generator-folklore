const webpack = require('webpack');
const path = require('path');

const contextPath = path.join(process.env.PWD, '<%= srcPath %>');
const outputPath = path.join(process.env.PWD, '<%= tmpPath %>');
const publicPath = '<%= publicPath %>';

module.exports = {

    context: contextPath,

    entry: <%- JSON.stringify(entries, null, 4).replace(/\"/gi, "'") %>,

    output: {
        path: outputPath,
        filename: '[name].js',
        publicPath,
        chunkFilename: '[name]-[id].bundle.js',
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            chunks: ['main'],
        }),
    ],

    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /.json$/,
                loader: 'json-loader',
                exclude: /node_modules/,
            },
            {
                test: /.html$/,
                loader: 'html-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                exclude: /(node_modules|bower_components|\.tmp)/,
                use: [
                    'babel-loader?presets[]=es2015&presets[]=react',
                    'svg-react-loader',
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader!css?modules&importLoaders=1&sourceMap&localIdentName=[local]___[hash:base64:5]',
                    'sass-loader',
                ],
            },<% if(entries.config) { %>
            {
                test: require.resolve(path.join(contextPath, 'config')),
                enforce: 'post',
                loader: 'expose-loader?app_config',
            },<% } %>
        ],
    },

    resolve: {
        extensions: ['.js', '.jsx', '.es6'],
        alias: {
            underscore: 'lodash',
        },
        modules: [
            path.join(process.env.PWD, './node_modules'),
            path.join(process.env.PWD, './web_modules'),
            path.join(process.env.PWD, './bower_components'),
        ],
    },

    stats: {
        colors: true,
        modules: true,
        reasons: true,
    },

    performance: {
        maxAssetSize: 100000,
        maxEntrypointSize: 300000,
    },

    devtool: 'source-map',
    cache: true,
    watch: false,

};
