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
    _inherits(JsGenerator, _Generator);

    // The name `constructor` is important here
    function JsGenerator() {
        var _ref;

        _classCallCheck(this, JsGenerator);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = JsGenerator.__proto__ || Object.getPrototypeOf(JsGenerator)).call.apply(_ref, [this].concat(args)));

        _this.argument('project_name', {
            type: String,
            required: false
        });

        _this.argument('type', {
            type: String,
            required: false
        });

        _this.option('project-path', {
            type: String,
            defaults: './'
        });

        _this.option('relay-graphql-path', {
            type: String,
            defaults: './graphql'
        });

        _this.option('path', {
            type: String,
            defaults: 'src/js'
        });
        return _this;
    }

    _createClass(JsGenerator, [{
        key: 'initializing',
        value: function initializing() {
            this.react_features = [];
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
                    console.log('Javascript Generator');
                    console.log(_chalk2.default.yellow('----------------------\n'));
                },
                prompts: function prompts() {
                    var _this2 = this;

                    var prompts = [];

                    if (!this.project_name) {
                        prompts.push(_generator2.default.prompts.project_name);
                    }

                    if (!this.type) {
                        prompts.push({
                            type: 'list',
                            name: 'type',
                            message: 'What type of javascript project?',
                            choices: [{
                                name: 'React',
                                value: 'react'
                            }]
                        });
                    }

                    prompts.push({
                        type: 'checkbox',
                        name: 'react_features',
                        message: 'Which React features?',
                        choices: [{
                            name: 'Router',
                            value: 'router',
                            checked: true
                        }, {
                            name: 'Redux',
                            value: 'redux',
                            checked: true,
                            short: 'Redux'
                        }, {
                            name: 'Relay',
                            value: 'relay',
                            checked: false,
                            short: 'Relay'
                        }],
                        when: function when(answers) {
                            var type = _this2.type || answers.type;
                            return type === 'react';
                        }
                    });

                    if (!prompts.length) {
                        return null;
                    }

                    return this.prompt(prompts).then(function (answers) {
                        if (answers.type) {
                            _this2.type = answers.type;
                        }

                        if (answers.react_features) {
                            _this2.react_features = answers.react_features;
                        }

                        if (answers.project_name) {
                            _this2.project_name = answers.project_name;
                        }
                    });
                }
            };
        }
    }, {
        key: 'writing',
        get: function get() {
            return {
                directory: function directory() {
                    var jsPath = _lodash2.default.get(this.options, 'path');
                    var srcPath = this.templatePath(this.type);
                    var destPath = this.destinationPath(jsPath);
                    this.directory(srcPath, destPath);

                    if (this.react_features.indexOf('relay') !== -1) {
                        var relaySrcPath = this.templatePath('relay');
                        var relayDestPath = this.destinationPath(jsPath);
                        this.directory(relaySrcPath, relayDestPath);
                    }
                },
                graphqlRelay: function graphqlRelay() {
                    if (!this.react_features || this.react_features.indexOf('relay') === -1) {
                        return;
                    }
                    var graphqlPath = _lodash2.default.get(this.options, 'relay-graphql-path');
                    var srcPath = this.templatePath('graphql');
                    var destPath = this.destinationPath(graphqlPath);
                    this.directory(srcPath, destPath);
                },
                config: function config() {
                    var jsPath = _lodash2.default.get(this.options, 'path');
                    var srcPath = this.templatePath('config.js');
                    var destPath = this.destinationPath(_path2.default.join(jsPath, 'config.js'));
                    this.fs.copy(srcPath, destPath);
                },
                eslintrc: function eslintrc() {
                    var projectPath = _lodash2.default.get(this.options, 'project-path');
                    var srcPath = this.templatePath('eslintrc');
                    var destPath = this.destinationPath(_path2.default.join(projectPath, '.eslintrc'));
                    this.fs.copy(srcPath, destPath);
                },
                babelrc: function babelrc() {
                    var projectPath = _lodash2.default.get(this.options, 'project-path');
                    var srcPath = this.templatePath('babelrc');
                    var destPath = this.destinationPath(_path2.default.join(projectPath, '.babelrc'));
                    this.fs.copyTpl(srcPath, destPath, {
                        react_features: this.react_features
                    });
                },
                packageJSON: function packageJSON() {
                    var projectPath = _lodash2.default.get(this.options, 'project-path');
                    var srcPath = this.templatePath('_package.json');
                    var destPath = this.destinationPath(_path2.default.join(projectPath, 'package.json'));

                    var packageJSON = this.fs.readJSON(srcPath);
                    packageJSON.name = this.project_name;
                    var currentPackageJSON = this.fs.exists(destPath) ? this.fs.readJSON(destPath) : {};
                    this.fs.writeJSON(destPath, _lodash2.default.merge(packageJSON, currentPackageJSON));
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

                    this.npmInstall(['domready@latest', 'fastclick@latest', 'hoist-non-react-statics@latest', 'hypernova@latest', 'immutable@latest', 'invariant@latest', 'keymirror@latest', 'lodash@latest', 'react@latest', 'react-dom@latest', 'react-redux@latest', 'react-router@latest', 'react-router-scroll@latest', 'react-router-redux@latest', 'redux@latest', 'redux-thunk@latest', 'redux-logger@latest', 'redux-promise@latest', 'redux-devtools@latest', 'redux-devtools-log-monitor@latest', 'redux-devtools-dock-monitor@latest'], {
                        save: true
                    });

                    if (this.react_features.indexOf('relay') !== -1) {
                        this.npmInstall(['react-relay@latest'], {
                            save: true
                        });

                        this.npmInstall(['babel-relay-plugin@latest', 'babel-plugin-transform-relay-hot@latest'], {
                            saveDev: true
                        });
                    }

                    this.npmInstall(['babel-eslint@latest', 'eslint@latest', 'eslint-config-airbnb@latest', 'eslint-plugin-import@latest', 'eslint-plugin-jsx-a11y@latest', 'eslint-plugin-react@latest'], {
                        saveDev: true
                    });
                }
            };
        }
    }]);

    return JsGenerator;
}(_generator2.default);