'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _generator = require('../../lib/generator');

var _generator2 = _interopRequireDefault(_generator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (_Generator) {
    _inherits(AppGenerator, _Generator);

    // The name `constructor` is important here
    function AppGenerator() {
        var _ref;

        _classCallCheck(this, AppGenerator);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = AppGenerator.__proto__ || Object.getPrototypeOf(AppGenerator)).call.apply(_ref, [this].concat(args)));

        _this.argument('project-name', {
            type: String,
            required: false
        });

        _this.option('project-path', {
            type: String,
            defaults: './'
        });

        _this.option('path', {
            type: String,
            defaults: './build/'
        });

        _this.option('tmp-path', {
            type: String,
            defaults: './.tmp/'
        });

        _this.option('src-path', {
            type: String,
            defaults: './src/'
        });

        _this.option('dest-path', {
            type: String,
            defaults: './dist/'
        });

        _this.option('clean-dest', {
            type: Boolean,
            defaults: false
        });

        _this.option('watch', {
            type: Boolean,
            defaults: true
        });

        _this.option('release', {
            type: Boolean,
            defaults: true
        });

        _this.option('modernizr', {
            type: Boolean,
            defaults: true
        });

        _this.option('copy', {
            type: Boolean,
            defaults: false
        });

        _this.option('copy-path', {
            type: String,
            defaults: 'src/*.{js,css,html,ico,txt}'
        });

        _this.option('js', {
            type: Boolean,
            defaults: true
        });

        _this.option('js-path', {
            type: String,
            defaults: 'js'
        });

        _this.option('js-src-path', {
            type: String
        });

        _this.option('js-tmp-path', {
            type: String
        });

        _this.option('js-dest-path', {
            type: String
        });

        _this.option('webpack-public-path', {
            type: String
        });

        _this.option('webpack-entry', {
            type: String
        });

        _this.option('webpack-entries', {
            type: Object
        });

        _this.option('webpack-config', {
            type: Boolean,
            defaults: true
        });

        _this.option('webpack-hot-reload', {
            type: Boolean,
            defaults: false
        });

        _this.option('webpack-html', {
            type: Boolean,
            defaults: false
        });

        _this.option('webpack-config-dist', {
            type: Boolean,
            defaults: true
        });

        _this.option('webpack-config-base', {
            type: Boolean,
            defaults: true
        });

        _this.option('webpack-config-dev', {
            type: Boolean,
            defaults: true
        });

        _this.option('webpack-config-path', {
            type: String
        });

        _this.option('webpack-config-base-path', {
            type: String
        });

        _this.option('webpack-config-dist-path', {
            type: String
        });

        _this.option('webpack-config-dev-path', {
            type: String
        });

        _this.option('images', {
            type: Boolean,
            defaults: true
        });

        _this.option('images-path', {
            type: String,
            defaults: 'img'
        });

        _this.option('images-src-path', {
            type: String
        });

        _this.option('images-dest-path', {
            type: String
        });

        _this.option('scss', {
            type: Boolean,
            defaults: true
        });

        _this.option('scss-path', {
            type: String,
            defaults: 'scss'
        });

        _this.option('css-path', {
            type: String,
            defaults: 'css'
        });

        _this.option('scss-src-path', {
            type: String
        });

        _this.option('scss-tmp-path', {
            type: String
        });

        _this.option('scss-dest-path', {
            type: String
        });

        _this.option('browsersync', {
            type: Boolean,
            defaults: true
        });

        _this.option('browsersync-host', {
            type: String
        });

        _this.option('browsersync-proxy', {
            type: String
        });

        _this.option('browsersync-base-dir', {
            type: String,
            defaults: './'
        });

        _this.option('browsersync-files', {
            type: String,
            defaults: './*'
        });
        return _this;
    }

    _createClass(AppGenerator, [{
        key: 'prompting',
        get: function get() {
            return {
                welcome: function welcome() {
                    if (this.options.quiet) {
                        return;
                    }

                    console.log(_chalk2.default.yellow('\n----------------------'));
                    console.log('Build tools Generator');
                    console.log(_chalk2.default.yellow('----------------------\n'));
                },
                prompts: function prompts() {
                    var _this2 = this;

                    var prompts = [];

                    if (!this.options['project-name']) {
                        prompts.push(this.prompts.project_name);
                    }

                    if (!prompts.length) {
                        return null;
                    }

                    return this.prompt(prompts).then(function (answers) {
                        if (answers['project-name']) {
                            _this2.options['project-name'] = answers['project-name'];
                        }
                    });
                }
            };
        }
    }, {
        key: 'writing',
        get: function get() {
            return {
                config: function config() {
                    var srcPath = _lodash2.default.get(this.options, 'src-path');
                    var destPath = _lodash2.default.get(this.options, 'dest-path');

                    var buildPath = _lodash2.default.get(this.options, 'path', false);
                    var tmpPath = _lodash2.default.get(this.options, 'tmp-path');
                    var hasBrowserSync = _lodash2.default.get(this.options, 'browsersync', false);
                    var browserSyncHost = _lodash2.default.get(this.options, 'browsersync-host', null);
                    var browserSyncProxy = _lodash2.default.get(this.options, 'browsersync-proxy', null);
                    var browserSyncBaseDir = _lodash2.default.get(this.options, 'browsersync-base-dir', []);
                    var browserSyncFiles = _lodash2.default.get(this.options, 'browsersync-files', []);
                    var jsPath = _lodash2.default.get(this.options, 'js-path', 'js');
                    var jsTmpPath = _lodash2.default.get(this.options, 'js-tmp-path', null) || _path2.default.join(tmpPath, jsPath);

                    var imagesPath = _lodash2.default.get(this.options, 'images-path', 'img');
                    var imagesSrcPath = _lodash2.default.get(this.options, 'images-src-path', null) || _path2.default.join(srcPath, imagesPath, '**/*.{jpg,png,jpeg,gif,svg}');
                    var imagesDestPath = _lodash2.default.get(this.options, 'images-dest-path', null) || _path2.default.join(destPath, imagesPath);

                    var templateData = {
                        hasBrowserSync: hasBrowserSync,
                        browserSyncHost: browserSyncHost && browserSyncHost.length ? browserSyncHost : null,
                        browserSyncProxy: browserSyncProxy && browserSyncProxy.length ? browserSyncProxy : null,
                        browserSyncBaseDir: _lodash2.default.isArray(browserSyncBaseDir) ? browserSyncBaseDir : browserSyncBaseDir.split(','),
                        browserSyncFiles: _lodash2.default.isArray(browserSyncFiles) ? browserSyncFiles : browserSyncFiles.split(','),
                        imagesSrcPath: imagesSrcPath,
                        imagesDestPath: imagesDestPath,
                        modernizrDestPath: _path2.default.join(jsTmpPath, 'modernizr.js')
                    };

                    var configSrcPath = this.templatePath('config.js');
                    var configDestPath = this.destinationPath(_path2.default.join(buildPath, 'config.js'));
                    this.fs.copyTpl(configSrcPath, configDestPath, templateData);
                },
                browsersync: function browsersync() {
                    if (!_lodash2.default.get(this.options, 'browsersync', false)) {
                        return;
                    }

                    if (!this.options.browsersync) {
                        return;
                    }

                    var templateData = {
                        options: this.options
                    };

                    var buildPath = _lodash2.default.get(this.options, 'path');
                    var srcPath = this.templatePath('browsersync.js');
                    var destPath = this.destinationPath(_path2.default.join(buildPath, 'browsersync.js'));
                    this.fs.copyTpl(srcPath, destPath, templateData);
                },
                modernizr: function modernizr() {
                    if (!_lodash2.default.get(this.options, 'modernizr', false)) {
                        return;
                    }

                    var destPath = _lodash2.default.get(this.options, 'dest-path');
                    var jsPath = _lodash2.default.get(this.options, 'js-path', 'js');
                    var jsDestPath = _lodash2.default.get(this.options, 'js-dest-path', null) || _path2.default.join(destPath, jsPath);

                    var templateData = {
                        destPath: _path2.default.join(jsDestPath, 'modernizr.js')
                    };

                    var buildPath = _lodash2.default.get(this.options, 'path');
                    var modernizrSrcPath = this.templatePath('modernizr.js');
                    var modernizrDestPath = this.destinationPath(_path2.default.join(buildPath, 'modernizr.js'));
                    this.fs.copyTpl(modernizrSrcPath, modernizrDestPath, templateData);
                },
                postcssConfig: function postcssConfig() {
                    if (!_lodash2.default.get(this.options, 'scss', false)) {
                        return;
                    }

                    var templateData = {};

                    var buildPath = _lodash2.default.get(this.options, 'path');
                    var srcPath = this.templatePath('postcss.config.js');
                    var destPath = this.destinationPath(_path2.default.join(buildPath, 'postcss.config.js'));
                    this.fs.copyTpl(srcPath, destPath, templateData);
                },
                imagemin: function imagemin() {
                    if (!_lodash2.default.get(this.options, 'images', false)) {
                        return;
                    }

                    var templateData = {};

                    var buildPath = _lodash2.default.get(this.options, 'path');
                    var srcPath = this.templatePath('imagemin.js');
                    var destPath = this.destinationPath(_path2.default.join(buildPath, 'imagemin.js'));
                    this.fs.copyTpl(srcPath, destPath, templateData);
                },
                release: function release() {
                    if (!_lodash2.default.get(this.options, 'release', false)) {
                        return;
                    }

                    var templateData = {};

                    var buildPath = _lodash2.default.get(this.options, 'path');
                    var srcPath = this.templatePath('release.sh');
                    var destPath = this.destinationPath(_path2.default.join(buildPath, 'release.sh'));
                    this.fs.copyTpl(srcPath, destPath, templateData);
                },
                webpack: function webpack() {
                    if (!_lodash2.default.get(this.options, 'js', false)) {
                        return;
                    }

                    var buildPath = _lodash2.default.get(this.options, 'path');
                    var tmpPath = _lodash2.default.get(this.options, 'tmp-path');
                    var srcPath = _lodash2.default.get(this.options, 'src-path');
                    var destPath = _lodash2.default.get(this.options, 'dest-path');
                    var jsPath = _lodash2.default.get(this.options, 'js-path', 'js');
                    var jsTmpPath = _lodash2.default.get(this.options, 'js-tmp-path', null) || _path2.default.join(tmpPath, jsPath);
                    var jsSrcPath = _lodash2.default.get(this.options, 'js-src-path', null) || _path2.default.join(srcPath, jsPath);
                    var jsDestPath = _lodash2.default.get(this.options, 'js-dest-path', null) || _path2.default.join(destPath, jsPath);
                    var publicPath = _lodash2.default.get(this.options, 'webpack-public-path', null) || jsPath.replace(/^\/?/, '/');
                    var entry = _lodash2.default.get(this.options, 'webpack-entry', null);
                    var entries = {};
                    if (entry !== null) {
                        entries = {
                            main: entry
                        };
                    } else {
                        entries = _lodash2.default.get(this.options, 'webpack-entries', []);
                    }
                    if (entries && !_lodash2.default.isObject(entries)) {
                        var newEntries = {};
                        if (!_lodash2.default.isArray(entries)) {
                            entries = entries.length ? [entries] : [];
                        }
                        entries.forEach(function (it) {
                            var entryParts = it.split(',');
                            newEntries[entryParts[0]] = entryParts.slice(1);
                        });
                        entries = newEntries;
                    }
                    if (this.options['webpack-hot-reload']) {
                        var hotReloadEntries = ['react-hot-loader/patch', 'webpack/hot/dev-server', 'webpack-hot-middleware/client?reload=true'];
                        if (typeof entries.main !== 'undefined') {
                            entries.main = [].concat(hotReloadEntries, _toConsumableArray(!_lodash2.default.isArray(entries.main) ? [entries.main] : entries.main));
                        } else if (_lodash2.default.isString(entries) || _lodash2.default.isArray(entries)) {
                            entries = [].concat(hotReloadEntries, _toConsumableArray(!_lodash2.default.isArray(entries) ? [entries] : entries));
                        }
                    }

                    var templateData = {
                        options: this.options,
                        srcPath: jsSrcPath,
                        tmpPath: jsTmpPath,
                        destPath: jsDestPath,
                        publicPath: publicPath,
                        entries: entries
                    };

                    var configSrcPath = void 0;
                    var configDestPath = void 0;

                    if (_lodash2.default.get(this.options, 'webpack-config')) {
                        configSrcPath = _lodash2.default.get(this.options, 'webpack-config-path') || this.templatePath('webpack.config.js');
                        configDestPath = this.destinationPath(_path2.default.join(buildPath, 'webpack.config.js'));
                        this.fs.copyTpl(configSrcPath, configDestPath, templateData);
                    }

                    if (_lodash2.default.get(this.options, 'webpack-config-base')) {
                        configSrcPath = _lodash2.default.get(this.options, 'webpack-config-base-path') || this.templatePath('webpack.config.base.js');
                        configDestPath = this.destinationPath(_path2.default.join(buildPath, 'webpack.config.base.js'));
                        this.fs.copyTpl(configSrcPath, configDestPath, templateData);
                    }

                    if (_lodash2.default.get(this.options, 'webpack-config-dist')) {
                        configSrcPath = _lodash2.default.get(this.options, 'webpack-config-dist-path') || this.templatePath('webpack.config.dist.js');
                        configDestPath = this.destinationPath(_path2.default.join(buildPath, 'webpack.config.dist.js'));
                        this.fs.copyTpl(configSrcPath, configDestPath, templateData);
                    }

                    if (this.options.browsersync && _lodash2.default.get(this.options, 'webpack-config-dev')) {
                        configSrcPath = _lodash2.default.get(this.options, 'webpack-config-dev-path') || this.templatePath('webpack.config.dev.js');
                        configDestPath = this.destinationPath(_path2.default.join(buildPath, 'webpack.config.dev.js'));
                        this.fs.copyTpl(configSrcPath, configDestPath, templateData);
                    }
                },
                packageJSONScripts: function packageJSONScripts() {
                    var projectPath = _lodash2.default.get(this.options, 'project-path');
                    var buildPath = _lodash2.default.get(this.options, 'path');
                    var tmpPath = _lodash2.default.get(this.options, 'tmp-path');
                    var srcPath = _lodash2.default.get(this.options, 'src-path');
                    var destPath = _lodash2.default.get(this.options, 'dest-path');

                    var scripts = {
                        'clean:tmp': 'rm -rf ' + tmpPath,
                        clean: 'npm run clean:tmp',
                        'mkdir:tmp': 'mkdir -p ' + tmpPath,
                        mkdir: 'npm run mkdir:tmp'
                    };

                    var scriptsServerPrepare = [];
                    var scriptsWatch = [];
                    var scriptsBuild = ['npm run build:files'];
                    var scriptsBuildFiles = ['npm run clean && npm run mkdir'];

                    if (_lodash2.default.get(this.options, 'clean-dest')) {
                        scripts['mkdir:dist'] = 'mkdir -p ' + destPath;
                        scripts['clean:dist'] = 'rm -rf ' + destPath;
                        scripts.mkdir += ' && npm run mkdir:dist';
                        scripts.clean += ' && npm run clean:dist';
                    }

                    if (_lodash2.default.get(this.options, 'browsersync')) {
                        scriptsServerPrepare.push('npm run clean:tmp');
                        scriptsServerPrepare.push('npm run mkdir:tmp');
                    } else if (_lodash2.default.get(this.options, 'watch')) {
                        scriptsWatch.push('npm run clean:tmp');
                        scriptsWatch.push('npm run mkdir:tmp');
                    }

                    if (_lodash2.default.get(this.options, 'copy')) {
                        var copyPath = _lodash2.default.get(this.options, 'copy-path', []);
                        var copyPaths = _lodash2.default.isArray(copyPath) ? copyPath : [copyPath];
                        var copyScripts = copyPaths.map(function (pathToCopy) {
                            return 'cp -v ' + pathToCopy + ' dist/ 2>/dev/null || :';
                        });
                        scripts['copy:dist'] = copyScripts.join(' && ');
                        scripts.copy = 'npm run copy:dist';
                        scriptsBuildFiles.push('npm run copy');
                    }

                    if (_lodash2.default.get(this.options, 'release')) {
                        scripts.release = _path2.default.join(buildPath, 'release.sh');
                    }

                    if (_lodash2.default.get(this.options, 'browsersync')) {
                        var browserSyncPath = _path2.default.join(buildPath, 'browsersync.js');
                        scripts.browsersync = 'node -r babel-register ' + browserSyncPath;
                        scripts['server:prepare'] = 'echo "Preparing server..."';
                        if (_lodash2.default.get(this.options, 'watch')) {
                            scripts.server = 'npm run server:prepare && concurrently "npm run watch" "npm run browsersync"';
                        } else {
                            scripts.server = 'npm run server:prepare && npm run browsersync';
                        }
                        scripts.start = 'npm run server';
                    }

                    if (_lodash2.default.get(this.options, 'modernizr')) {
                        var modernizrPath = _path2.default.join(buildPath, 'modernizr.js');
                        scripts['modernizr:dist'] = 'node -r babel-register ' + modernizrPath + ' --dist';
                        scripts['modernizr:server'] = 'node -r babel-register ' + modernizrPath;
                        scripts.modernizr = 'npm run modernizr:dist';
                        scripts['build:modernizr'] = 'npm run modernizr:dist';
                        if (_lodash2.default.get(this.options, 'browsersync')) {
                            scriptsServerPrepare.push('npm run modernizr:server');
                        } else if (_lodash2.default.get(this.options, 'watch')) {
                            scriptsWatch.push('npm run sass:dist');
                        }
                        scriptsBuild.push('npm run build:modernizr');
                    }

                    if (_lodash2.default.get(this.options, 'images')) {
                        scripts['imagemin:dist'] = 'node -r babel-register ./build/imagemin.js';
                        scripts.imagemin = 'npm run imagemin:dist';
                        scripts['build:images'] = 'npm run imagemin:dist';
                        scriptsBuild.push('npm run build:images');
                    }

                    if (_lodash2.default.get(this.options, 'scss')) {
                        var postcssConfigFile = _path2.default.join(buildPath, 'postcss.js');
                        var scssPath = _lodash2.default.get(this.options, 'scss-path', 'scss');
                        var cssPath = _lodash2.default.get(this.options, 'css-path', 'css');
                        var scssSrcPath = _lodash2.default.get(this.options, 'scss-src-path', null) || _path2.default.join(srcPath, scssPath);
                        var scssTmpPath = _lodash2.default.get(this.options, 'scss-tmp-path', null) || _path2.default.join(tmpPath, cssPath);
                        var scssDestPath = _lodash2.default.get(this.options, 'scss-dest-path', null) || _path2.default.join(destPath, cssPath);

                        scripts['postcss:dist'] = 'postcss -c ' + postcssConfigFile + ' -u autoprefixer -u cssnano -d ' + scssDestPath + ' ' + _path2.default.join(scssTmpPath, '/**/*.css');
                        scripts.postcss = 'npm run postcss:dist';
                        scripts['sass:dist'] = 'node-sass -r ' + scssSrcPath + ' --output ' + scssTmpPath;
                        scripts['sass:watch'] = 'node-sass -r --watch ' + scssSrcPath + ' --output ' + scssTmpPath;
                        scripts['styles:dist'] = 'npm run sass:dist && npm run postcss:dist';
                        scripts['styles:watch'] = 'npm run sass:watch';
                        scripts.styles = 'npm run styles:dist';
                        scripts['watch:styles'] = 'npm run styles:watch';
                        scripts['build:styles'] = 'npm run styles';

                        if (_lodash2.default.get(this.options, 'browsersync')) {
                            scriptsServerPrepare.push('npm run sass:dist');
                        } else if (_lodash2.default.get(this.options, 'watch')) {
                            scriptsWatch.push('npm run sass:dist');
                        }
                        if (_lodash2.default.get(this.options, 'watch')) {
                            scriptsWatch.push('npm run watch:styles');
                        }

                        scriptsBuild.push('npm run build:styles');
                    }

                    if (_lodash2.default.get(this.options, 'js')) {
                        var webpackConfigFile = _path2.default.join(buildPath, 'webpack.config.js');
                        var jsPath = _lodash2.default.get(this.options, 'js-path', 'js');
                        var jsSrcPath = _lodash2.default.get(this.options, 'js-src-path', null) || _path2.default.join(srcPath, jsPath);
                        scripts['lint:dist'] = 'eslint ' + _path2.default.join(jsSrcPath, '/**.js');
                        scripts.lint = 'npm run lint:dist';
                        scripts.jscs = 'jscs ' + _path2.default.join(jsSrcPath, '/**.js');
                        scripts['webpack:dist'] = 'node -r babel-register ./node_modules/webpack/bin/webpack --env=dist  --config ' + webpackConfigFile + ' --progress --colors';
                        scripts.webpack = 'npm run webpack:dist';
                        scripts['scripts:dist'] = 'npm run webpack:dist';
                        scripts.scripts = 'npm run scripts:dist';
                        scripts['build:js'] = 'npm run lint && npm run scripts';
                        scriptsBuild.push('npm run build:js');
                    }

                    scriptsBuild.push('npm run clean:tmp');

                    if (scriptsServerPrepare.length) {
                        scripts['server:prepare'] = scriptsServerPrepare.join(' && ');
                    }

                    if (scriptsWatch.length) {
                        scripts.watch = scriptsWatch.join(' && ');
                    }

                    if (scriptsBuild.length) {
                        scripts.build = scriptsBuild.join(' && ');
                    }

                    if (scriptsBuildFiles.length) {
                        scripts['build:files'] = scriptsBuildFiles.join(' && ');
                    }

                    var packagePath = this.destinationPath(_path2.default.join(projectPath, 'package.json'));
                    this.fs.extendJSON(packagePath, {
                        scripts: scripts
                    });
                }
            };
        }
    }, {
        key: 'install',
        get: function get() {
            return {
                npm: function npm() {
                    if (this.options['skip-install']) {
                        return;
                    }

                    this.yarnInstall(['autoprefixer@latest', 'babel-core@latest', 'babel-loader@latest', 'babel-register@latest', 'babel-plugin-dynamic-import-node@latest', 'babel-plugin-syntax-dynamic-import@latest', 'babel-plugin-transform-es2015-spread@latest', 'babel-plugin-transform-object-rest-spread@latest', 'babel-plugin-transform-class-properties@latest', 'babel-preset-env@latest', 'babel-preset-react@latest', 'brfs@latest', 'browser-sync@latest', 'bs-fullscreen-message@latest', 'concurrently@latest', 'commander@latest', 'css-loader@latest', 'cssnano@latest', 'customizr@latest', 'expose-loader@latest', 'extract-text-webpack-plugin@latest', 'html-loader@latest', 'imagemin-cli@latest', 'imagemin-mozjpeg@latest', 'imagemin-pngquant@latest', 'imports-loader@latest', 'json-loader@latest', 'node-sass@latest', 'postcss-cli@latest', 'postcss-loader@latest', 'pretty-bytes@latest', 'proxy-middleware@latest', 'raw-loader@latest', 'transform-loader@latest', 'sass-loader@latest', 'serve-static@latest', 'strip-ansi@latest', 'style-loader@latest', 'svg-react-loader@latest', 'webpack@latest', 'webpack-dev-middleware@latest', 'webpack-merge@latest'], {
                        dev: true
                    });

                    if (this.options['webpack-html']) {
                        this.yarnInstall(['autoprefixer@latest'], {
                            dev: true
                        });
                    }

                    if (this.options['webpack-hot-reload']) {
                        this.yarnInstall(['webpack-hot-middleware@latest', 'react-hot-loader@^3.0.0-beta.7'], {
                            dev: true
                        });
                    }
                },
                sass: function sass() {
                    if (this.options['skip-install']) {
                        return;
                    }

                    this.spawnCommand('gem', ['install', 'sass']);
                }
            };
        }
    }]);

    return AppGenerator;
}(_generator2.default);