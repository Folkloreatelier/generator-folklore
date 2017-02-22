import webpackMerge from 'webpack-merge';
import webpack from 'webpack';
import webpackConfig from './webpack.config.base';

export default env => (
    webpackMerge(webpackConfig(env), {

        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development'),
                },
                __DEV__: JSON.stringify(true),
            }),
        ],

    })
);
