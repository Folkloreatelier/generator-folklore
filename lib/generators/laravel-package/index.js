'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _changeCase = require('change-case');

var _generator = require('../../lib/generator');

var _generator2 = _interopRequireDefault(_generator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (_Generator) {
    _inherits(ComposerPackageGenerator, _Generator);

    function ComposerPackageGenerator() {
        var _ref;

        _classCallCheck(this, ComposerPackageGenerator);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = ComposerPackageGenerator.__proto__ || Object.getPrototypeOf(ComposerPackageGenerator)).call.apply(_ref, [this].concat(args)));

        _this.argument('package-name', {
            type: String,
            required: false
        });

        _this.option('package-namespace', {
            type: String,
            desc: 'Package namespace',
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
        return _this;
    }

    _createClass(ComposerPackageGenerator, [{
        key: 'configuring',
        value: function configuring() {
            var namespaceParts = this.options['package-namespace'].split('\\');
            var baseName = namespaceParts[1];
            this.templateData = {
                packageName: this.options['package-name'],
                namespace: this.options['package-namespace'],
                namespacePath: namespaceParts.join('/'),
                baseClassName: (0, _changeCase.pascalCase)(baseName),
                basePath: this.options['package-name'],
                baseName: baseName
            };
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
                    console.log('Composer Package Generator');
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
                                return 'folklore/' + parts[parts.length - 1];
                            }
                        });
                    }

                    if (!this.options['package-namespace']) {
                        prompts.push({
                            type: 'input',
                            name: 'package-namespace',
                            message: 'Namespace of the package:',
                            default: function _default(answers) {
                                var packageName = _this2.options['package-name'] || answers['package-name'];
                                var namespace = packageName.split('/').map(function (part) {
                                    return (0, _changeCase.pascalCase)(part);
                                }).join('\\');
                                return namespace;
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
                        if (answers['package-namespace']) {
                            _this2.options['package-namespace'] = answers['package-namespace'];
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
                    this.fs.copyTpl(srcPath, destPath, this.templateData);
                },
                tests: function tests() {
                    var srcPath = this.templatePath('tests');
                    var destPath = this.destinationPath('tests');
                    this.fs.copyTpl(srcPath, destPath, this.templateData);
                },
                serviceProvider: function serviceProvider() {
                    var _templateData = this.templateData,
                        namespacePath = _templateData.namespacePath,
                        baseClassName = _templateData.baseClassName;

                    var srcPath = this.templatePath('ServiceProvider.php');
                    var destPath = this.destinationPath('src/' + namespacePath + '/' + baseClassName + 'ServiceProvider.php');
                    this.fs.copyTpl(srcPath, destPath, this.templateData);
                },
                testCase: function testCase() {
                    var baseClassName = this.templateData.baseClassName;

                    var srcPath = this.templatePath('TestCase.php');
                    var destPath = this.destinationPath('tests/' + baseClassName + 'TestCase.php');
                    this.fs.copyTpl(srcPath, destPath, this.templateData);
                },
                gitignore: function gitignore() {
                    var srcPath = this.templatePath('gitignore');
                    var destPath = this.destinationPath('.gitignore');
                    this.fs.copy(srcPath, destPath);
                },
                coveralls: function coveralls() {
                    var srcPath = this.templatePath('coveralls.yml');
                    var destPath = this.destinationPath('.coveralls.yml');
                    this.fs.copy(srcPath, destPath);
                },
                travis: function travis() {
                    var srcPath = this.templatePath('travis.yml');
                    var destPath = this.destinationPath('.travis.yml');
                    this.fs.copy(srcPath, destPath);
                },
                phpcs: function phpcs() {
                    var srcPath = this.templatePath('phpcs.xml');
                    var destPath = this.destinationPath('phpcs.xml');
                    this.fs.copy(srcPath, destPath);
                },
                phpunit: function phpunit() {
                    var srcPath = this.templatePath('phpunit.xml');
                    var destPath = this.destinationPath('phpunit.xml');
                    this.fs.copyTpl(srcPath, destPath, this.templateData);
                },
                readme: function readme() {
                    var srcPath = this.templatePath('Readme.md');
                    var destPath = this.destinationPath('Readme.md');
                    this.fs.copy(srcPath, destPath);
                },
                composerJSON: function composerJSON() {
                    var _templateData2 = this.templateData,
                        packageName = _templateData2.packageName,
                        namespace = _templateData2.namespace;

                    var srcPath = this.templatePath('_composer.json');
                    var destPath = this.destinationPath('composer.json');
                    var newJson = this.fs.readJSON(srcPath);
                    newJson.name = packageName;
                    newJson.autoload['psr-0'] = _defineProperty({}, namespace, 'src/');
                    var currentJson = this.fs.exists(destPath) ? this.fs.readJSON(destPath) : {};
                    this.fs.writeJSON(destPath, _lodash2.default.merge(newJson, currentJson));
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
                composer: function composer() {
                    var skipInstall = _lodash2.default.get(this.options, 'skip-install', false);
                    if (skipInstall) {
                        return;
                    }

                    var done = this.async();
                    this.spawnCommand('composer', ['install']).on('close', done);
                }
            };
        }
    }]);

    return ComposerPackageGenerator;
}(_generator2.default);