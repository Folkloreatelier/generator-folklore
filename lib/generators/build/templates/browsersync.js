import BrowserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import proxyMiddleware from 'proxy-middleware';
import servestaticMiddleware from 'serve-static';
import stripAnsi from 'strip-ansi';
import url from 'url';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';

import config from './config';
import createWebpackConfig from './webpack.config';

const webpackConfig = createWebpackConfig('dev');
const browserSyncConfig = _.get(config, 'browsersync', {});
const webpackMiddlewareConfig = _.get(config, 'webpackMiddleware', {});

const browserSync = BrowserSync.create();
const bundler = webpack(webpackConfig);

/**
 * Reload all devices when bundle is complete
 * or send a fullscreen error message to the browser instead
 */
bundler.plugin('done', (stats) => {
    if (stats.hasErrors() || stats.hasWarnings()) {
        return browserSync.sockets.emit('fullscreen:message', {
            title: 'Webpack Error:',
            body: stripAnsi(stats.toString()),
            timeout: 100000,
        });
    }
    return browserSync.reload();
});

/**
 * Browser sync options
 */
const browserSyncOptions = _.merge({
    logFileChanges: false,

    middleware: [],

    plugins: [
        'bs-fullscreen-message',
    ],
}, browserSyncConfig);

/**
 * Webpack middleware options
 */
const webpackMiddlewareOptions = _.merge({
    publicPath: webpackConfig.output.publicPath,
}, webpackMiddlewareConfig);

/**
 * Webpack middleware
 */
const webpackMiddleware = webpackDevMiddleware(bundler, webpackMiddlewareOptions);
browserSyncOptions.middleware.push(webpackMiddleware);

/**
 * Proxy
 */
if (browserSyncOptions.proxy) {
    const proxyHost = url.parse(browserSyncOptions.proxy);
    browserSyncOptions.proxy = null;
    browserSyncOptions.open = 'external';
    delete browserSyncOptions.proxy;

    /**
     * Static middleware
     */
    const baseDirs = _.get(browserSyncOptions, 'server.baseDir', []);
    const serveStaticMiddlewares = {};
    for (let i = 0, bl = baseDirs.length; i < bl; i += 1) {
        serveStaticMiddlewares[baseDirs[i]] = servestaticMiddleware(baseDirs[i]);
    }
    const staticMiddleware = (req, res, next) => {
        const requestUrl = url.parse(req.url);
        const urlPath = requestUrl.pathname;

        Object.keys(serveStaticMiddlewares).forEach((key) => {
            try {
                const stats = fs.lstatSync(path.join(key, urlPath));
                if (stats.isFile()) {
                    return serveStaticMiddlewares[key](req, res, next);
                }
            } catch (e) {
                console.error(e;)
            }
        });

        return next();
    };
    browserSyncOptions.middleware.push(staticMiddleware);

    /**
     * Proxy middleware
     */
    const proxyMiddlewareOptions = url.parse(`http://${proxyHost.host}`);
    proxyMiddlewareOptions.preserveHost = true;
    proxyMiddlewareOptions.via = 'browserSync';
    browserSyncOptions.middleware.push(proxyMiddleware(proxyMiddlewareOptions));
}

/**
 * Start webpack
 */
browserSync.init(browserSyncOptions);
