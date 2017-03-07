'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _changeCase = require('change-case');

var _generator = require('../../lib/generator');

var _generator2 = _interopRequireDefault(_generator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (_Generator) {
    _inherits(ReactPackageGenerator, _Generator);

    function ReactPackageGenerator() {
        var _ref;

        _classCallCheck(this, ReactPackageGenerator);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = ReactPackageGenerator.__proto__ || Object.getPrototypeOf(ReactPackageGenerator)).call.apply(_ref, [this].concat(args)));

        _this.argument('package_name', {
            type: String,
            required: false
        });

        _this.argument('component_name', {
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

        _this.option('examples-path', {
            type: String,
            desc: 'Path for examples',
            defaults: './examples'
        });
        return _this;
    }

    _createClass(ReactPackageGenerator, [{
        key: 'configuring',
        value: function configuring() {
            var srcPath = _lodash2.default.get(this.options, 'src-path');
            var destPath = _lodash2.default.get(this.options, 'dest-path');
            var tmpPath = _lodash2.default.get(this.options, 'tmp-path');
            var buildPath = _lodash2.default.get(this.options, 'build-path');
            var examplesPath = _lodash2.default.get(this.options, 'examples-path');
            var skipInstall = _lodash2.default.get(this.options, 'skip-install', false);

            this.composeWith('folklore:npm-package', {
                arguments: [this.package_name],
                options: {
                    'src-path': srcPath,
                    'dest-path': destPath,
                    'tmp-path': tmpPath,
                    'build-path': buildPath,
                    'skip-install': skipInstall,
                    'webpack-config-base': false,
                    'webpack-config-dev': false,
                    'browsersync-base-dir': [tmpPath, examplesPath],
                    'browsersync-files': [_path2.default.join(examplesPath, '**')],
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
                    console.log('React Package Generator');
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

                    if (!this.component_name) {
                        prompts.push({
                            type: 'input',
                            name: 'component_name',
                            message: 'Name of the component:',
                            default: function _default(answers) {
                                var packageName = _this2.package_name || answers.package_name;
                                return packageName ? (0, _changeCase.pascal)(packageName) : undefined;
                            }
                        });
                    }

                    if (!prompts.length) {
                        return null;
                    }

                    return this.prompt(prompts).then(function (answers) {
                        if (answers.package_name) {
                            _this2.package_name = answers.package_name;
                        }
                        if (answers.component_name) {
                            _this2.component_name = answers.component_name;
                        }
                    });
                }
            };
        }
    }, {
        key: 'writing',
        get: function get() {
            return {
                examples: function examples() {
                    var srcPath = this.templatePath('examples');
                    var destPath = this.destinationPath('examples');
                    this.directory(srcPath, destPath);
                },
                src: function src() {
                    var indexPath = this.destinationPath('src/index.js');
                    if (this.fs.exists(indexPath)) {
                        this.fs.delete(indexPath);
                    }

                    var indexTestPath = this.destinationPath('src/__tests__/index-test.js');
                    if (this.fs.exists(indexTestPath)) {
                        this.fs.delete(indexTestPath);
                    }

                    var srcPath = this.templatePath('src');
                    var destPath = this.destinationPath('src');
                    this.fs.copyTpl(srcPath, destPath, {
                        componentName: this.component_name
                    });
                },
                storybookConfig: function storybookConfig() {
                    var srcPath = this.templatePath('storybook.config.js');
                    var destPath = this.destinationPath('.storybook/config.js');
                    this.fs.copy(srcPath, destPath);
                },
                webpackConfig: function webpackConfig() {
                    var buildPath = _lodash2.default.get(this.options, 'build-path');
                    var srcPath = _lodash2.default.get(this.options, 'src-path');
                    var tmpPath = _lodash2.default.get(this.options, 'tmp-path');
                    var examplesPath = _lodash2.default.get(this.options, 'examples-path');
                    var jsTmpPath = _path2.default.join(tmpPath, 'js');
                    var jsExamplesPath = _path2.default.join(examplesPath, 'js');

                    // Main
                    var configBaseSrcPath = this.templatePath('webpack.config.base.js');
                    var configBaseDestPath = this.destinationPath(_path2.default.join(buildPath, 'webpack.config.base.js'));
                    this.fs.copyTpl(configBaseSrcPath, configBaseDestPath, {
                        srcPath: srcPath,
                        tmpPath: tmpPath,
                        componentName: this.component_name
                    });

                    // Browser sync
                    var configDevSrcPath = this.templatePath('webpack.config.dev.js');
                    var configDevDestPath = this.destinationPath(_path2.default.join(buildPath, 'webpack.config.dev.js'));
                    this.fs.copyTpl(configDevSrcPath, configDevDestPath, {
                        srcPath: jsExamplesPath,
                        tmpPath: jsTmpPath
                    });
                },
                packageJSON: function packageJSON() {
                    var packagePath = this.destinationPath('package.json');
                    this.fs.extendJSON(packagePath, {
                        scripts: {
                            storybook: 'start-storybook -p 9001 -c .storybook'
                        }
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

                    this.npmInstall(['react@latest', 'react-dom@latest'], {
                        save: true
                    });

                    this.npmInstall(['domready@latest', 'jquery@latest', 'enzyme@latest', 'react-test-renderer@latest', '@kadira/storybook@latest'], {
                        saveDev: true
                    });
                }
            };
        }
    }]);

    return ReactPackageGenerator;
}(_generator2.default);