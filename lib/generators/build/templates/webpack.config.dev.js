/* eslint-disable import/no-extraneous-dependencies */
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
<% if (options['webpack-html']) { %>const HtmlWebpackPlugin = require('html-webpack-plugin');<% } %>
const webpackConfig = require('./webpack.config.base');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = env => (
    webpackMerge(webpackConfig(env), {

        devtool: 'source-map',

        plugins: [
            <% if (options['webpack-hot-reload']) { %>new webpack.HotModuleReplacementPlugin(),<% } %>
            new webpack.NamedModulesPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development'),
                },
                __DEV__: JSON.stringify(true),
            }),<% if (options['webpack-html']) { %>
            /**
             * Dynamically generate index.html page
             */
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'index.html.ejs',
                env: 'dev',
                inject: false,
            }),<% } %>
        ],

    })
);
