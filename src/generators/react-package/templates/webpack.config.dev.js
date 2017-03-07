import webpackMerge from 'webpack-merge';
import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpackConfig from './webpack.config.base';

const contextPath = path.join(process.env.PWD, '<%= srcPath %>');
const outputPath = path.join(process.env.PWD, '<%= tmpPath %>');

module.exports = env => (
    webpackMerge(webpackConfig(env), {

        devtool: '#eval-source-map',

        context: contextPath,

        entry: {
            main: './js/index',
        },

        output: {
            path: outputPath,
            filename: '[name].js',
            publicPath: '/',
        },

        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development'),
                },
                __DEV__: JSON.stringify(true),
            }),
            /**
             * Dynamically generate index.html page
             */
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.join(__dirname, '../examples/index.html.ejs'),
                env: 'dev',
                inject: false,
            }),
        ],

        externals: {},

    })
);
