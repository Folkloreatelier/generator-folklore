var webpack = require('webpack');
var path = require('path');

var contextPath = path.join(process.env.PWD, '<%= srcPath %>');
var outputPath = path.join(process.env.PWD, '<%= tmpPath %>');
var publicPath = '<%= publicPath %>';

module.exports = {

    context: contextPath,

    entry: <%- JSON.stringify(entries, null, 4).replace(/\"/gi, "'") %>,

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
        rules: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
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
                    'svg-react-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader!css?modules&importLoaders=1&sourceMap&localIdentName=[local]___[hash:base64:5]',
                    'sass-loader'
                ]
            }
            <% if(entries.config) { %>
            ,{
                test: require.resolve(path.join(contextPath, 'config')),
                enforce: 'post',
                loader: 'expose-loader?app_config'
            }
            <% } %>
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx', '.es6'],
        alias: {
            underscore: 'lodash'
        },
        modules: [
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

    devtool: 'source-map',
    cache: false,
    watch: false

};
