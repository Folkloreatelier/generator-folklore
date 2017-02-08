'use strict';

var Generator = require('../../lib/generator');
var _ = require('lodash');
var path = require('path');
var colors = require('colors');

module.exports = Generator.extend({

    // The name `constructor` is important here
    constructor: function constructor() {
        Generator.apply(this, arguments);

        this.argument('project_name', {
            type: String,
            required: false
        });

        this.option('path', {
            type: String,
            desc: 'Path for the html project',
            defaults: './'
        });

        this.option('src-path', {
            type: String,
            desc: 'Path for source',
            defaults: './src'
        });

        this.option('tmp-path', {
            type: String,
            desc: 'Path for temp files',
            defaults: './.tmp'
        });

        this.option('dest-path', {
            type: String,
            desc: 'Path for build',
            defaults: './dist'
        });

        this.option('js-path', {
            type: String,
            desc: 'Path for the javascript',
            defaults: 'js'
        });

        this.option('css-path', {
            type: String,
            desc: 'Path for the css',
            defaults: 'css'
        });

        this.option('scss-path', {
            type: String,
            desc: 'Path for the scss',
            defaults: 'scss'
        });

        this.option('images-path', {
            type: String,
            desc: 'Path for the images',
            defaults: 'img'
        });

        this.option('build-path', {
            type: String,
            desc: 'Path for the build tools',
            defaults: 'build'
        });

        this.option('server', {
            type: Boolean,
            defaults: false,
            desc: 'Add a node.js server'
        });

        this.option('server-path', {
            type: String,
            desc: 'Path for the node.js server'
        });
    },

    prompting: {

        welcome: function welcome() {
            if (this.options.quiet) {
                return;
            }

            console.log(chalk.yellow('\n----------------------'));
            console.log('HTML Generator');
            console.log(chalk.yellow('----------------------\n'));
        },

        prompts: function prompts() {
            var prompts = [];

            if (!this.project_name) {
                prompts.push(this.prompts.project_name);
            }

            if (!prompts.length) {
                return;
            }

            return this.prompt(prompts).then(function (answers) {
                if (answers.project_name) {
                    this.project_name = answers.project_name;
                }
            }.bind(this));
        }

    },

    configuring: function configuring() {
        var projectPath = this.destinationPath();
        var srcPath = _.get(this.options, 'src-path');
        var destPath = _.get(this.options, 'dest-path');
        var tmpPath = _.get(this.options, 'tmp-path');
        var buildPath = _.get(this.options, 'build-path') || projectPath + '/build';
        var jsPath = _.get(this.options, 'js-path');
        var jsSrcPath = path.join(projectPath, srcPath, jsPath);
        var scssPath = _.get(this.options, 'scss-path');
        var scssSrcPath = path.join(projectPath, srcPath, scssPath);
        var cssPath = _.get(this.options, 'css-path');
        var imagesPath = _.get(this.options, 'images-path');
        var skipInstall = _.get(this.options, 'skip-install', false);

        this.composeWith('folklore:js', {
            arguments: [this.project_name],
            options: {
                'project-path': projectPath,
                'path': jsSrcPath,
                'skip-install': skipInstall,
                'quiet': true
            }
        });

        this.composeWith('folklore:scss', {
            arguments: [this.project_name],
            options: {
                'project-path': projectPath,
                'path': scssSrcPath,
                'skip-install': skipInstall,
                'quiet': true
            }
        });

        if (this.options.server) {
            this.composeWith('folklore:server', {
                arguments: [this.project_name],
                options: {
                    'project-path': projectPath,
                    'path': _.get(this.options, 'server-path') || projectPath + '/server',
                    'skip-install': skipInstall,
                    'quiet': true
                }
            });
        }

        this.composeWith('folklore:build', {
            arguments: [this.project_name],
            options: {
                'project-path': projectPath,
                'path': buildPath,
                'tmp-path': tmpPath,
                'src-path': srcPath,
                'dest-path': destPath,
                'js-path': jsPath,
                'scss-path': scssPath,
                'css-path': cssPath,
                'images-path': imagesPath,
                'copy': true,
                'copy-path': path.join(srcPath, '*.{html,ico,txt,png}'),
                'clean-dest': true,
                'webpack-entry': {
                    'main': './index',
                    'config': './config',
                    'vendor': ['lodash']
                },
                'browsersync-base-dir': [tmpPath, srcPath],
                'browsersync-files': [path.join(tmpPath, 'scss/*.scss'), path.join(srcPath, '*.html')],
                'skip-install': skipInstall,
                'quiet': true
            }
        });
    },

    writing: {
        html: function html() {
            var srcPath = _.get(this.options, 'src-path');
            var jsPath = _.get(this.options, 'js-path', 'js').replace(/^\/?/, '/');
            var cssPath = _.get(this.options, 'css-path', 'css').replace(/^\/?/, '/');

            var indexSrcPath = this.templatePath('index.html');
            var indexDestPath = this.destinationPath(path.join(srcPath, 'index.html'));
            this.fs.copyTpl(indexSrcPath, indexDestPath, {
                title: this.project_name,
                jsPath: jsPath,
                cssPath: cssPath
            });
        },

        editorconfig: function editorconfig() {
            var projectPath = _.get(this.options, 'path');
            var srcPath = this.templatePath('editorconfig');
            var destPath = this.destinationPath(path.join(projectPath, '.editorconfig'));
            this.fs.copy(srcPath, destPath);
        },

        gitignore: function gitignore() {
            var srcPath = this.templatePath('gitignore');
            var destPath = this.destinationPath('.gitignore');
            this.fs.copy(srcPath, destPath);
        }
    }

});