import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const contextPath = path.join(process.env.PWD, './src');
const outputPath = path.join(process.env.PWD, './.tmp');

module.exports = (env) => {
    const extractPlugin = new ExtractTextPlugin({
        filename: 'css/[name]-[contenthash].css',
        allChunks: true,
    });

    const cssLoaders = [
        {
            loader: 'css-loader',
            options: {
                sourceMap: true,
            },
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: true,
                includePaths: [
                    './node_modules',
                ],
            },
        },
    ];

    const cssLocalLoaders = [].concat(cssLoaders);
    cssLocalLoaders[0] = {
        loader: 'css-loader',
        options: {
            modules: true,
            sourceMap: true,
            importLoaders: 1,
            localIdentName: env === 'dev' ? '[local]' : '[hash:base64:5]',
        },
    };

    return {

        context: contextPath,

        entry: {
            main: './index',
        },

        output: {
            path: outputPath,
            filename: '[name].js',
            jsonpFunction: 'flklrJsonp',
            libraryTarget: 'umd',
            library: '<%= componentName %>',
        },

        plugins: env === 'dev' ? [] : [
            extractPlugin,
        ],

        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.html$/,
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
                    test: /\.global\.s[ac]ss$/,
                    use: env === 'dev' ? ['style-loader'].concat(cssLoaders) : extractPlugin.extract({
                        fallback: 'style-loader',
                        use: cssLoaders,
                    }),
                },

                {
                    test: /\.s[ac]ss$/,
                    exclude: /.global\.s[ac]ss$/,
                    use: env === 'dev' ? ['style-loader'].concat(cssLocalLoaders) : extractPlugin.extract({
                        fallback: 'style-loader',
                        use: cssLocalLoaders,
                    }),
                },

                {
                    test: /\.(ttf|eot|svg|woff2?|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: env === 'dev' ? 'url-loader' : 'file-loader',
                    options: env === 'dev' ? {} : {
                        name: '[name]-[hash:6].[ext]',
                        publicPath: '../fonts/',
                        outputPath: 'fonts/',
                    },
                },
            ],
        },

        externals: env === 'dev' ? {} : {
            react: {
                commonjs: 'react',
                commonjs2: 'react',
                amd: 'react',
                root: 'React',
            },
            'react-dom': {
                commonjs: 'react-dom',
                commonjs2: 'react-dom',
                amd: 'react-dom',
                root: 'ReactDOM',
            },
            lodash: {
                commonjs: 'lodash',
                commonjs2: 'lodash',
                amd: 'lodash',
                root: '_',
            },
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
};
