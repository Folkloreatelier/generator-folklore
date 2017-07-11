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
    _inherits(HTMLGenerator, _Generator);

    // The name `constructor` is important here
    function HTMLGenerator() {
        var _ref;

        _classCallCheck(this, HTMLGenerator);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = HTMLGenerator.__proto__ || Object.getPrototypeOf(HTMLGenerator)).call.apply(_ref, [this].concat(args)));

        _this.argument('project-name', {
            type: String,
            required: false
        });

        _this.option('path', {
            type: String,
            desc: 'Path for the html project',
            defaults: './'
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

        _this.option('js-path', {
            type: String,
            desc: 'Path for the javascript',
            defaults: ''
        });

        _this.option('css-path', {
            type: String,
            desc: 'Path for the css',
            defaults: 'css'
        });

        _this.option('scss-path', {
            type: String,
            desc: 'Path for the scss',
            defaults: 'styles'
        });

        _this.option('images-path', {
            type: String,
            desc: 'Path for the images',
            defaults: 'img'
        });

        _this.option('build-path', {
            type: String,
            desc: 'Path for the build tools',
            defaults: 'build'
        });

        _this.option('server', {
            type: Boolean,
            defaults: false,
            desc: 'Add a node.js server'
        });

        _this.option('server-path', {
            type: String,
            desc: 'Path for the node.js server'
        });
        return _this;
    }

    _createClass(HTMLGenerator, [{
        key: 'configuring',
        value: function configuring() {
            var projectName = _lodash2.default.get(this.options, 'project-name');
            var projectPath = this.destinationPath();
            var srcPath = _lodash2.default.get(this.options, 'src-path');
            var destPath = _lodash2.default.get(this.options, 'dest-path');
            var tmpPath = _lodash2.default.get(this.options, 'tmp-path');
            var buildPath = _lodash2.default.get(this.options, 'build-path') || projectPath + '/build';
            var jsPath = _lodash2.default.get(this.options, 'js-path');
            var jsSrcPath = _path2.default.join(projectPath, srcPath, jsPath);
            var scssPath = _lodash2.default.get(this.options, 'scss-path');
            var scssSrcPath = _path2.default.join(projectPath, srcPath, scssPath);
            var cssPath = _lodash2.default.get(this.options, 'css-path');
            var imagesPath = _lodash2.default.get(this.options, 'images-path');
            var skipInstall = _lodash2.default.get(this.options, 'skip-install', false);

            this.composeWith('folklore:js', {
                'project-name': projectName,
                'project-path': projectPath,
                'react-hot-reload': true,
                path: jsSrcPath,
                'skip-install': skipInstall,
                quiet: true
            });

            this.composeWith('folklore:scss', {
                'project-name': projectName,
                'project-path': projectPath,
                path: scssSrcPath,
                'skip-install': skipInstall,
                quiet: true
            });

            if (this.options.server) {
                this.composeWith('folklore:server', {
                    'project-name': projectName,
                    'project-path': projectPath,
                    path: _lodash2.default.get(this.options, 'server-path') || projectPath + '/server',
                    'skip-install': skipInstall,
                    quiet: true
                });
            }

            this.composeWith('folklore:build', {
                'project-name': projectName,
                'project-path': projectPath,
                path: buildPath,
                'tmp-path': tmpPath,
                'src-path': srcPath,
                'dest-path': destPath,
                'js-path': jsPath,
                'scss-path': scssPath,
                'css-path': cssPath,
                'images-path': imagesPath,
                copy: true,
                'copy-path': _path2.default.join(srcPath, '*.{html,ico,txt,png}'),
                'clean-dest': true,
                'webpack-entries': {
                    main: './index',
                    config: './config',
                    vendor: ['lodash']
                },
                'webpack-hot-reload': true,
                'webpack-html': true,
                'browsersync-base-dir': [tmpPath, srcPath],
                'browsersync-files': [_path2.default.join(tmpPath, 'css/*.css'), _path2.default.join(srcPath, '*.html')],
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
                    console.log('HTML Generator');
                    console.log(_chalk2.default.yellow('----------------------\n'));
                },
                prompts: function prompts() {
                    var _this2 = this;

                    var prompts = [];

                    if (!this.options['project-name']) {
                        prompts.push(_generator2.default.prompts.project_name);
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
                html: function html() {
                    var projectName = _lodash2.default.get(this.options, 'project-name');
                    var srcPath = _lodash2.default.get(this.options, 'src-path');
                    var jsPath = _lodash2.default.get(this.options, 'js-path', 'js').replace(/^\/?/, '/');
                    var cssPath = _lodash2.default.get(this.options, 'css-path', 'css').replace(/^\/?/, '/');

                    var indexSrcPath = this.templatePath('index.html.ejs');
                    var indexDestPath = this.destinationPath(_path2.default.join(srcPath, 'index.html.ejs'));
                    this.fs.copyTpl(indexSrcPath, indexDestPath, {
                        title: projectName || 'Prototype',
                        jsPath: jsPath,
                        cssPath: cssPath
                    });
                },
                editorconfig: function editorconfig() {
                    var projectPath = _lodash2.default.get(this.options, 'path');
                    var srcPath = this.templatePath('editorconfig');
                    var destPath = this.destinationPath(_path2.default.join(projectPath, '.editorconfig'));
                    this.fs.copy(srcPath, destPath);
                },
                gitignore: function gitignore() {
                    var srcPath = this.templatePath('gitignore');
                    var destPath = this.destinationPath('.gitignore');
                    this.fs.copy(srcPath, destPath);
                }
            };
        }
    }]);

    return HTMLGenerator;
}(_generator2.default);