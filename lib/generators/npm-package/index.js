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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (_Generator) {
    _inherits(NpmPackageGenerator, _Generator);

    function NpmPackageGenerator() {
        var _ref;

        _classCallCheck(this, NpmPackageGenerator);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = NpmPackageGenerator.__proto__ || Object.getPrototypeOf(NpmPackageGenerator)).call.apply(_ref, [this].concat(args)));

        _this.argument('package-name', {
            type: String,
            required: false
        });

        _this.option('src', {
            type: Boolean,
            desc: 'Includes src path',
            defaults: true
        });

        _this.option('src-path', {
            type: String,
            desc: 'Path for source',
            defaults: './src'
        });

        _this.option('tmp-path', {
            type: String,
            desc: 'Path for temp files',
            defaults: './.tmp'
        });

        _this.option('dest-path', {
            type: String,
            desc: 'Path for build',
            defaults: './dist'
        });

        _this.option('build-path', {
            type: String,
            desc: 'Path for build',
            defaults: './build'
        });

        _this.option('browsersync-base-dir', {
            type: String,
            desc: 'BrowserSync base directories'
        });

        _this.option('browsersync-files', {
            type: String,
            desc: 'BrowserSync files to watch'
        });

        _this.option('webpack-html', {
            type: Boolean,
            desc: 'Add html to webpack',
            defaults: false
        });

        _this.option('webpack-dev-context', {
            type: String,
            desc: 'Specify dev context path'
        });

        _this.option('webpack-dev-entries', {
            type: Object,
            desc: 'Specify dev entries'
        });

        _this.option('webpack-dist-entries', {
            type: Object,
            desc: 'Specify dist entries'
        });

        _this.option('webpack-hot-reload', {
            type: Boolean,
            desc: 'Add hot reloading',
            defaults: false
        });

        _this.option('webpack-config-base', {
            type: Boolean,
            desc: 'Add a base webpack config file',
            defaults: true
        });

        _this.option('webpack-config-dev', {
            type: Boolean,
            desc: 'Add a dev webpack config file',
            defaults: true
        });
        return _this;
    }

    _createClass(NpmPackageGenerator, [{
        key: 'configuring',
        value: function configuring() {
            var projectPath = this.destinationPath();
            var srcPath = _lodash2.default.get(this.options, 'src-path');
            var destPath = _lodash2.default.get(this.options, 'dest-path');
            var tmpPath = _lodash2.default.get(this.options, 'tmp-path');
            var buildPath = _lodash2.default.get(this.options, 'build-path');
            var skipInstall = _lodash2.default.get(this.options, 'skip-install', false);
            var webpackConfigBase = _lodash2.default.get(this.options, 'webpack-config-base', false);
            var webpackConfigDev = _lodash2.default.get(this.options, 'webpack-config-dev', false);
            var webpackHtml = _lodash2.default.get(this.options, 'webpack-html', false);
            var webpackHotReload = _lodash2.default.get(this.options, 'webpack-hot-reload', false);
            var webpackDevContext = _lodash2.default.get(this.options, 'webpack-dev-context', null);
            var webpackDevEntries = _lodash2.default.get(this.options, 'webpack-dev-entries', null);
            var webpackDistEntries = _lodash2.default.get(this.options, 'webpack-dist-entries', null);
            var webpackEntries = webpackDevEntries !== null && webpackDistEntries !== null ? null : _defineProperty({}, this.options['package-name'], './index');
            var browserSyncBaseDir = _lodash2.default.get(this.options, 'browsersync-base-dir') || [tmpPath, srcPath];
            var browserSyncFiles = _lodash2.default.get(this.options, 'browsersync-files') || [_path2.default.join(srcPath, '*.html')];

            this.composeWith('folklore:build', {
                'project-name': this.options['package-name'],
                'project-path': projectPath,
                path: buildPath,
                'tmp-path': tmpPath,
                'src-path': srcPath,
                'dest-path': destPath,
                'js-path': './',
                scss: false,
                images: false,
                copy: false,
                watch: false,
                'clean-dest': true,
                modernizr: false,
                'webpack-config-base': webpackConfigBase,
                'webpack-config-dev': webpackConfigDev,
                'webpack-html': webpackHtml,
                'webpack-hot-reload': webpackHotReload,
                'webpack-dev-context': webpackDevContext,
                'webpack-entries': webpackEntries,
                'webpack-dist-entries': webpackDistEntries,
                'webpack-dev-entries': webpackDevEntries,
                'browsersync-base-dir': browserSyncBaseDir,
                'browsersync-files': browserSyncFiles,
                'skip-install': skipInstall,
                quiet: true
            });
        }
    }, {
        key: 'prompting',
        get: function get() {
            return {
                welcome: function welcome() {
                    if (this.options.quiet) {
                        return;
                    }

                    console.log(_chalk2.default.yellow('\n----------------------'));
                    console.log('NPM Package Generator');
                    console.log(_chalk2.default.yellow('----------------------\n'));
                },
                prompts: function prompts() {
                    var _this2 = this;

                    var prompts = [];

                    if (!this.options['package-name']) {
                        prompts.push({
                            type: 'input',
                            name: 'package-name',
                            message: 'Name of the package:',
                            default: function _default() {
                                var parts = process.cwd().split(_path2.default.sep);
                                return parts[parts.length - 1];
                            }
                        });
                    }

                    if (!prompts.length) {
                        return null;
                    }

                    return this.prompt(prompts).then(function (answers) {
                        if (answers['package-name']) {
                            _this2.options['package-name'] = answers['package-name'];
                        }
                    });
                }
            };
        }
    }, {
        key: 'writing',
        get: function get() {
            return {
                src: function src() {
                    if (!this.options.src) {
                        return;
                    }
                    var srcPath = this.templatePath('src');
                    var destPath = this.destinationPath('src');
                    /* this.directory */this.fs.copyTpl(srcPath, destPath, this);
                },
                gitignore: function gitignore() {
                    var srcPath = this.templatePath('gitignore');
                    var destPath = this.destinationPath('.gitignore');
                    this.fs.copy(srcPath, destPath);
                },
                eslintrc: function eslintrc() {
                    var srcPath = this.templatePath('eslintrc');
                    var destPath = this.destinationPath('.eslintrc');
                    this.fs.copy(srcPath, destPath);
                },
                babelrc: function babelrc() {
                    var srcPath = this.templatePath('babelrc');
                    var destPath = this.destinationPath('.babelrc');
                    this.fs.copy(srcPath, destPath);
                },
                readme: function readme() {
                    var srcPath = this.templatePath('Readme.md');
                    var destPath = this.destinationPath('Readme.md');
                    this.fs.copy(srcPath, destPath);
                },
                packageJSON: function packageJSON() {
                    var srcPath = this.templatePath('_package.json');
                    var destPath = this.destinationPath('package.json');
                    var packageJSON = this.fs.readJSON(srcPath);
                    packageJSON.name = this.options['package-name'];
                    var currentPackageJSON = this.fs.exists(destPath) ? this.fs.readJSON(destPath) : {};
                    this.fs.writeJSON(destPath, _lodash2.default.merge(packageJSON, currentPackageJSON));
                },
                editorconfig: function editorconfig() {
                    var srcPath = this.templatePath('editorconfig');
                    var destPath = this.destinationPath('.editorconfig');
                    this.fs.copy(srcPath, destPath);
                }
            };
        }
    }, {
        key: 'install',
        get: function get() {
            return {
                npm: function npm() {
                    this.npmInstall(['babel-eslint@latest', 'eslint@latest', 'eslint-config-airbnb@latest', 'eslint-plugin-import@latest', 'eslint-plugin-jsx-a11y@latest', 'eslint-plugin-react@latest', 'jest@latest'], {
                        saveDev: true
                    });
                }
            };
        }
    }]);

    return NpmPackageGenerator;
}(_generator2.default);