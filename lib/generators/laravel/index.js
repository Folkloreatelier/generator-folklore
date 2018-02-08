'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _yeomanRemote = require('yeoman-remote');

var _yeomanRemote2 = _interopRequireDefault(_yeomanRemote);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _passwordGenerator = require('password-generator');

var _passwordGenerator2 = _interopRequireDefault(_passwordGenerator);

var _generator = require('../../lib/generator');

var _generator2 = _interopRequireDefault(_generator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (_Generator) {
    _inherits(LaravelGenerator, _Generator);

    _createClass(LaravelGenerator, null, [{
        key: 'safeDbString',
        value: function safeDbString(str) {
            return str.replace(/[-s.]+/gi, '_').replace(/[^a-z0-9]+/gi, '');
        }
    }, {
        key: 'getPassword',
        value: function getPassword() {
            return (0, _passwordGenerator2.default)(20, false);
        }
    }]);

    function LaravelGenerator() {
        var _ref;

        _classCallCheck(this, LaravelGenerator);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = LaravelGenerator.__proto__ || Object.getPrototypeOf(LaravelGenerator)).call.apply(_ref, [this].concat(args)));

        _this.argument('project-name', {
            type: String,
            required: false
        });

        _this.argument('project-host', {
            type: String,
            required: false
        });

        _this.option('url', {
            type: String,
            desc: 'Project url',
            defaults: 'http://<%= project_host %>'
        });

        _this.option('local-url', {
            type: String,
            desc: 'Project local url',
            defaults: 'http://<%= project_host %>.local.flklr.ca'
        });

        _this.option('proxy-url', {
            type: String,
            desc: 'Project proxy url',
            defaults: 'http://<%= project_host %>.homestead.flklr.ca'
        });

        _this.option('tmp-path', {
            type: String,
            desc: 'Path for temp files',
            defaults: '.tmp'
        });

        _this.option('assets-path', {
            type: String,
            desc: 'Path for assets',
            defaults: 'resources/assets'
        });

        _this.option('public-path', {
            type: String,
            desc: 'Path for build',
            defaults: 'public'
        });

        _this.option('build-path', {
            type: String,
            desc: 'Path for the build tools',
            defaults: 'build'
        });

        _this.option('js-path', {
            type: String,
            desc: 'Path for the javascript',
            defaults: 'js'
        });

        _this.option('scss-path', {
            type: String,
            desc: 'Path for the scss',
            defaults: 'scss'
        });

        _this.option('css-path', {
            type: String,
            desc: 'Path for the css',
            defaults: 'css'
        });

        _this.option('images-path', {
            type: String,
            desc: 'Path for the images',
            defaults: 'img'
        });

        _this.option('db-host', {
            type: String,
            desc: 'Database host',
            defaults: 'localhost'
        });

        _this.option('db-username', {
            type: String,
            desc: 'Database username',
            defaults: 'homestead'
        });

        _this.option('db-password', {
            type: String,
            desc: 'Database password',
            defaults: 'secret'
        });

        _this.option('db-name', {
            type: String,
            desc: 'Database name'
        });

        _this.option('hot-reload', {
            type: Boolean,
            desc: 'Enable hot reload',
            defaults: false
        });
        return _this;
    }

    _createClass(LaravelGenerator, [{
        key: 'configuring',
        value: function configuring() {
            var projectPath = this.destinationPath();
            var assetsPath = _lodash2.default.get(this.options, 'assets-path', '').replace(/\/$/, '');
            var tmpPath = _lodash2.default.get(this.options, 'tmp-path', '').replace(/\/$/, '');
            var publicPath = _lodash2.default.get(this.options, 'public-path');
            var buildPath = _lodash2.default.get(this.options, 'build-path');
            var jsPath = _lodash2.default.get(this.options, 'js-path');
            var jsSrcPath = _path2.default.join(assetsPath, jsPath);
            var scssPath = _lodash2.default.get(this.options, 'scss-path');
            var scssSrcPath = _path2.default.join(assetsPath, scssPath);
            var cssPath = _lodash2.default.get(this.options, 'css-path');
            var imagesPath = _lodash2.default.get(this.options, 'images-path');
            var skipInstall = _lodash2.default.get(this.options, 'skip-install', false);
            var urlLocal = _lodash2.default.template(_lodash2.default.get(this.options, 'local-url'))({
                project_host: this.options['project-host'],
                project_name: this.options['project-name']
            }).replace(/^(http)?(s)?(:\/\/)?/, 'http$2://');
            var urlProxy = _lodash2.default.template(_lodash2.default.get(this.options, 'proxy-url', _lodash2.default.get(this.options, 'local-url')))({
                project_host: this.options['project-host'],
                project_name: this.options['project-name']
            }).replace(/^(http)?(s)?(:\/\/)?/, 'http$2://');

            this.composeWith('folklore:js', {
                'project-name': this.options['project-name'],
                'project-path': projectPath,
                path: jsSrcPath,
                'skip-install': skipInstall,
                'react-hot-reload': this.options['hot-reload'],
                quiet: true
            });

            this.composeWith('folklore:scss', {
                'project-name': this.options['project-name'],
                'project-path': projectPath,
                path: scssSrcPath,
                quiet: true
            });

            this.composeWith('folklore:build', {
                'project-name': this.options['project-name'],
                'project-path': projectPath,
                path: buildPath,
                'tmp-path': tmpPath,
                'src-path': assetsPath,
                'dest-path': publicPath,
                'webpack-public-path': '/' + jsPath.replace(/\/$/, '') + '/',
                'js-path': jsPath,
                'scss-path': scssPath,
                'css-path': cssPath,
                'images-path': imagesPath,
                'webpack-entries': {
                    main: './index',
                    config: './config',
                    vendor: ['lodash']
                },
                'webpack-hot-reload': this.options['hot-reload'],
                'browsersync-base-dir': [tmpPath, publicPath],
                'browsersync-host': urlLocal.replace(/^https?:\/\//, ''),
                'browsersync-proxy': urlProxy,
                'browsersync-files': ['config/**/*.php', 'app/**/*.php', 'routes/*.php', 'resources/lang/**/*.php', 'resources/views/**/*.php', _path2.default.join(tmpPath, 'css/*.css'), _path2.default.join(publicPath, '*.html'), _path2.default.join(publicPath, '**/*.{jpg,png,ico,gif}')],
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
                    console.log('Laravel Generator');
                    console.log(_chalk2.default.yellow('----------------------\n'));
                },
                prompts: function prompts() {
                    var _this2 = this;

                    var prompts = [];

                    if (!this.options['project-name']) {
                        prompts.push(_generator2.default.prompts.project_name);
                    }

                    if (!this.options['project-host']) {
                        prompts.push({
                            type: 'input',
                            name: 'project-host',
                            message: 'What is the host of the project?',
                            default: function _default(answers) {
                                var projectName = _this2.options['project-name'] || answers['project-name'];
                                return projectName.match(/.[^.]+$/) ? projectName : projectName + '.com';
                            }
                        });
                    }

                    if (!this.options['db-name']) {
                        prompts.push({
                            type: 'input',
                            name: 'db-name',
                            message: 'What is the name of the database?',
                            default: function _default(answers) {
                                var projectName = _this2.options['project-name'] || answers['project-name'];
                                return projectName.match(/^([^.]+)/)[1];
                            }
                        });
                    }

                    if (!prompts.length) {
                        return null;
                    }

                    return this.prompt(prompts).then(function (answers) {
                        if (answers['project-name']) {
                            _this2.options['project-name'] = answers['project-name'];
                        }
                        if (answers['project-host']) {
                            _this2.options['project-host'] = answers['project-host'];
                        }
                        if (answers['db-name']) {
                            _this2.options['db-name'] = answers['db-name'];
                        }
                    });
                }
            };
        }
    }, {
        key: 'writing',
        get: function get() {
            return {
                laravel: function laravel() {
                    var _this3 = this;

                    var done = this.async();

                    (0, _yeomanRemote2.default)('laravel', 'laravel', function (err, cachePath) {
                        var destinationPath = _this3.destinationPath();
                        var files = _glob2.default.sync('**', {
                            dot: true,
                            nodir: true,
                            cwd: cachePath
                        });

                        var source = void 0;
                        var destination = void 0;
                        files.forEach(function (file) {
                            source = _path2.default.join(cachePath, file);
                            destination = _path2.default.join(destinationPath, file);
                            if (!_this3.fs.exists(destination)) {
                                _this3.fs.copy(source, destination);
                            }
                        });

                        done();
                    });
                },
                removeFiles: function removeFiles() {
                    var _this4 = this;

                    var files = ['gulpfile.js', 'package.json', 'webpack.mix.js', 'config/app.php', 'routes/web.php', 'public/css/app.css', 'public/js/app.js', 'app/Providers/AppServiceProvider.php', 'resources/assets/sass', 'resources/assets/js', 'resources/assets/js/app.js', 'resources/assets/js/bootstrap.js', 'resources/views/welcome.blade.php'];

                    files.forEach(function (file) {
                        var filePath = _this4.destinationPath(file);
                        _this4.fs.delete(filePath);
                    });
                },
                packageJSON: function packageJSON() {
                    var jsonPath = this.destinationPath('package.json');
                    var packageJSON = this.fs.exists(jsonPath) ? this.fs.readJSON(jsonPath) : {};
                    packageJSON.scripts = {};
                    packageJSON.devDependencies = {};
                    this.fs.writeJSON(jsonPath, packageJSON);
                },
                composerJSON: function composerJSON() {
                    var src = this.destinationPath('composer.json');
                    this.fs.extendJSON(src, {
                        require: {
                            'folklore/image': 'v1.x-dev',
                            'folklore/laravel-locale': '^2.2',
                            'folklore/laravel-hypernova': '^0.1',
                            'barryvdh/laravel-debugbar': '^2.3'
                        }
                    });
                },
                env: function env() {
                    var url = _lodash2.default.template(_lodash2.default.get(this.options, 'local-url'))({
                        project_host: this.options['project-host'],
                        project_name: this.options['project-name']
                    }).replace(/^(http)?(s)?(:\/\/)?/, 'http$2://');

                    var urlLocal = _lodash2.default.template(_lodash2.default.get(this.options, 'local-url'))({
                        project_host: this.options['project-host'],
                        project_name: this.options['project-name']
                    }).replace(/^(http)?(s)?(:\/\/)?/, 'http$2://');

                    var templateData = {
                        project_name: this.options['project-name'],
                        db_host: this.options['db-host'],
                        db_username: this.options['db-username'],
                        db_password: this.options['db-password'],
                        db_name: this.options['db-name'],
                        url: urlLocal
                    };

                    var src = this.templatePath('env');
                    var dest = this.destinationPath('.env');
                    this.fs.copyTpl(src, dest, templateData);

                    var srcExample = this.templatePath('env');
                    var destExample = this.destinationPath('.env.example');
                    this.fs.copyTpl(srcExample, destExample, templateData);

                    var srcProd = this.templatePath('env.prod');
                    var destProd = this.destinationPath('.env.prod');
                    templateData.url = url;
                    templateData.db_username = this.options['db-name'];
                    this.fs.copyTpl(srcProd, destProd, templateData);
                },
                phpcs: function phpcs() {
                    var srcPath = this.templatePath('phpcs.xml');
                    var destPath = this.destinationPath('phpcs.xml');
                    this.fs.copy(srcPath, destPath);
                },
                editorconfig: function editorconfig() {
                    var srcPath = this.templatePath('editorconfig');
                    var destPath = this.destinationPath('.editorconfig');
                    this.fs.copy(srcPath, destPath);
                },
                gitignore: function gitignore() {
                    var srcPath = this.templatePath('gitignore');
                    var destPath = this.destinationPath('.gitignore');
                    if (this.fs.exists(destPath)) {
                        this.fs.delete(destPath);
                    }
                    this.fs.copy(srcPath, destPath);
                },
                files: function files() {
                    var _this5 = this;

                    var templatePath = this.templatePath('laravel');
                    var destinationPath = this.destinationPath();
                    var files = _glob2.default.sync('**', {
                        dot: true,
                        nodir: true,
                        cwd: templatePath
                    });

                    files.forEach(function (file) {
                        var source = _path2.default.join(templatePath, file);
                        var destination = _path2.default.join(destinationPath, file);
                        if (file.match(/\.(jpg|jpeg|gif|png)$/i)) {
                            _this5.fs.copy(source, destination);
                        } else {
                            _this5.fs.copyTpl(source, destination, {
                                project_name: _this5.options['project-name']
                            });
                        }
                    });
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
                },
                permissions: function permissions() {
                    this.spawnCommand('chmod', ['-R', '777', 'storage']);
                    this.spawnCommand('chmod', ['-R', '777', 'public/files']);
                },
                keyGenerate: function keyGenerate() {
                    var skipInstall = _lodash2.default.get(this.options, 'skip-install', false);
                    if (skipInstall) {
                        return;
                    }

                    var done = this.async();
                    this.spawnCommand('php', ['artisan', 'key:generate']).on('close', done);
                },
                vendorPublish: function vendorPublish() {
                    var skipInstall = _lodash2.default.get(this.options, 'skip-install', false);
                    if (skipInstall) {
                        return;
                    }

                    var done = this.async();
                    this.spawnCommand('php', ['artisan', 'vendor:publish']).on('close', done);
                }
            };
        }
    }]);

    return LaravelGenerator;
}(_generator2.default);