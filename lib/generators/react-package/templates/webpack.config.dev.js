import webpackMerge from 'webpack-merge';
import webpack from 'webpack';
import path from 'path';
import webpackConfig from './webpack.config.base';

const contextPath = path.join(process.env.PWD, '<%= srcPath %>');
const outputPath = path.join(process.env.PWD, '<%= tmpPath %>');

module.exports = env => (
    webpackMerge(webpackConfig(env), {

        context: contextPath,

        output: {
            path: outputPath,
            filename: '[name].js',
            publicPath: '/js',
        },

        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development'),
                },
                __DEV__: JSON.stringify(true),
            }),
        ],

        externals: {},

    })
);
