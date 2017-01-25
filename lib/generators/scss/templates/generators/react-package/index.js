'use strict';

var Generator = require('../../lib/generator');
var _ = require('lodash');
var path = require('path');
var colors = require('colors');
var pascalCase = require('change-case').pascal;

module.exports = Generator.extend({

    // The name `constructor` is important here
    constructor: function constructor() {
        Generator.apply(this, arguments);

        this.argument('package_name', {
            type: String,
            required: false
        });

        this.argument('component_name', {
            type: String,
            required: false
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

        this.option('build-path', {
            type: String,
            desc: 'Path for build',
            defaults: './build'
        });

        this.option('examples-path', {
            type: String,
            desc: 'Path for examples',
            defaults: './examples'
        });
    },

    prompting: {

        welcome: function welcome() {
            if (this.options.quiet) {
                return;
            }

            console.log('\n----------------------'.yellow);
            console.log('React Package Generator');
            console.log('----------------------\n'.yellow);
        },

        prompts: function prompts() {
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
                    default: function (answers) {
                        var packageName = this.package_name || answers.package_name;
                        return packageName ? pascalCase(packageName) : undefined;
                    }.bind(this)
                });
            }

            if (!prompts.length) {
                return;
            }

            return this.prompt(prompts).then(function (answers) {
                if (answers.package_name) {
                    this.package_name = answers.package_name;
                }
                if (answers.component_name) {
                    this.component_name = answers.component_name;
                }
            }.bind(this));
        }
    },

    configuring: function configuring() {
        var srcPath = _.get(this.options, 'src-path');
        var destPath = _.get(this.options, 'dest-path');
        var tmpPath = _.get(this.options, 'tmp-path');
        var buildPath = _.get(this.options, 'build-path');
        var examplesPath = _.get(this.options, 'examples-path');
        var skipInstall = _.get(this.options, 'skip-install', false);

        this.composeWith('folklore:npm-package', {
            arguments: [this.package_name],
            options: {
                'src-path': srcPath,
                'dest-path': destPath,
                'tmp-path': tmpPath,
                'build-path': buildPath,
                'skip-install': skipInstall,
                'webpack-config': false,
                'webpack-config-browsersync': false,
                'browsersync-base-dir': [tmpPath, examplesPath],
                'browsersync-files': [path.join(examplesPath, '**')],
                'quiet': true
            }
        });
    },

    writing: {

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
            var buildPath = _.get(this.options, 'build-path');
            var srcPath = _.get(this.options, 'src-path');
            var tmpPath = _.get(this.options, 'tmp-path');
            var examplesPath = _.get(this.options, 'examples-path');
            var jsTmpPath = path.join(tmpPath, 'js');
            var jsExamplesPath = path.join(examplesPath, 'js');

            //Main
            var configSrcPath = this.templatePath('webpack.config.js');
            var configDestPath = this.destinationPath(path.join(buildPath, 'webpack.config.js'));
            this.fs.copyTpl(configSrcPath, configDestPath, {
                srcPath: srcPath,
                tmpPath: tmpPath,
                componentName: this.component_name
            });

            //Browser sync
            configSrcPath = this.templatePath('webpack.config.browsersync.js');
            configDestPath = this.destinationPath(path.join(buildPath, 'webpack.config.browsersync.js'));
            this.fs.copyTpl(configSrcPath, configDestPath, {
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

    },

    install: {
        npm: function npm() {
            if (this.options['skip-install']) {
                return;
            }

            this.npmInstall(['react@latest', 'react-dom@latest'], {
                'save': true
            });

            this.npmInstall(['domready@latest', 'jquery@latest', 'enzyme@latest', 'react-test-renderer@latest', '@kadira/storybook@latest'], {
                'saveDev': true
            });
        }
    }

});