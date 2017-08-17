/* eslint-disable import/no-extraneous-dependencies */
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
<% if (options['webpack-html']) { %>const HtmlWebpackPlugin = require('html-webpack-plugin');<% } %>
const webpackConfig = require('./webpack.config.base');
/* eslint-enable import/no-extraneous-dependencies */

const outputPath = path.join(process.env.PWD, '<%= destPath %>');

module.exports = env => (
    webpackMerge(webpackConfig(env), {

        <% if (distEntries !== null) { %>entry: <%- JSON.stringify(distEntries, null, 4).replace(/\"/gi, "'") %>,
        <% } %>

        output: {
            path: outputPath,
        },

        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production'),
                __DEV__: JSON.stringify(false),
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new UglifyJSPlugin({
                beautify: true,
                sourceMap: true,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true,
                },
                compress: {
                    screw_ie8: true,
                    warnings: false,
                },
                comments: false,
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

        cache: false,

    })
);
