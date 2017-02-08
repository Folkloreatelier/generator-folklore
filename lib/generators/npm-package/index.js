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

        _this.argument('package_name', {
            type: String,
            required: false
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

        _this.option('webpack-config', {
            type: Boolean,
            desc: 'Add a webpack config file',
            defaults: true
        });

        _this.option('webpack-config-browsersync', {
            type: Boolean,
            desc: 'Add a webpack config file for browsersync',
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
            var webpackConfig = _lodash2.default.get(this.options, 'webpack-config', false);
            var webpackConfigBrowsersync = _lodash2.default.get(this.options, 'webpack-config-browsersync', false);
            var browserSyncBaseDir = _lodash2.default.get(this.options, 'browsersync-base-dir') || [tmpPath, srcPath];
            var browserSyncFiles = _lodash2.default.get(this.options, 'browsersync-files') || [_path2.default.join(srcPath, '*.html')];

            this.composeWith('folklore:build', {
                arguments: [this.package_name],
                options: {
                    'project-path': projectPath,
                    path: buildPath,
                    'tmp-path': tmpPath,
                    'src-path': srcPath,
                    'dest-path': destPath,
                    'js-path': './',
                    scss: false,
                    images: false,
                    copy: false,
                    'clean-dest': true,
                    modernizr: false,
                    'webpack-config': webpackConfig,
                    'webpack-config-browsersync': webpackConfigBrowsersync,
                    'browsersync-base-dir': browserSyncBaseDir,
                    'browsersync-files': browserSyncFiles,
                    'skip-install': skipInstall,
                    quiet: true
                }
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

                    if (!this.package_name) {
                        prompts.push({
                            type: 'input',
                            name: 'package_name',
                            message: 'Name of the package:'
                        });
                    }

                    if (!prompts.length) {
                        return null;
                    }

                    return this.prompt(prompts).then(function (answers) {
                        if (answers.package_name) {
                            _this2.package_name = answers.package_name;
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
                    var srcPath = this.templatePath('src');
                    var destPath = this.destinationPath('src');
                    this.directory(srcPath, destPath);
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
                    packageJSON.name = this.package_name;
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