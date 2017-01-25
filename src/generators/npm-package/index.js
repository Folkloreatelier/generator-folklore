var Generator = require('../../lib/generator');
var _ = require('lodash');
var path = require('path');
var colors = require('colors');

module.exports = Generator.extend({

    // The name `constructor` is important here
    constructor: function ()
    {
        Generator.apply(this, arguments);

        this.argument('package_name', {
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

        this.option('browsersync-base-dir', {
            type: String,
            desc: 'BrowserSync base directories'
        });

        this.option('browsersync-files', {
            type: String,
            desc: 'BrowserSync files to watch'
        });

        this.option('webpack-config', {
            type: Boolean,
            desc: 'Add a webpack config file',
            defaults: true
        });

        this.option('webpack-config-browsersync', {
            type: Boolean,
            desc: 'Add a webpack config file for browsersync',
            defaults: true
        });

    },

    prompting: {

        welcome: function()
        {
            if(this.options.quiet)
            {
                return;
            }

            console.log('\n----------------------'.yellow);
            console.log('NPM Package Generator');
            console.log('----------------------\n'.yellow);
        },

        prompts: function ()
        {
            var prompts = [];

            if(!this.package_name)
            {
                prompts.push({
                    type: 'input',
                    name: 'package_name',
                    message: 'Name of the package:'
                });
            }

            if(!prompts.length)
            {
                return;
            }

            return this.prompt(prompts)
                .then(function (answers)
                {
                    if(answers.package_name)
                    {
                        this.package_name = answers.package_name;
                    }
                }.bind(this));
        }
    },

    configuring: function()
    {
        var projectPath = this.destinationPath();
        var srcPath = _.get(this.options, 'src-path');
        var destPath = _.get(this.options, 'dest-path');
        var tmpPath = _.get(this.options, 'tmp-path');
        var buildPath = _.get(this.options, 'build-path');
        var skipInstall = _.get(this.options, 'skip-install', false);
        var webpackConfig = _.get(this.options, 'webpack-config', false);
        var webpackConfigBrowsersync = _.get(this.options, 'webpack-config-browsersync', false);
        var browserSyncBaseDir = _.get(this.options, 'browsersync-base-dir') || [
            tmpPath,
            srcPath
        ];
        var browserSyncFiles = _.get(this.options, 'browsersync-files') || [
            path.join(srcPath, '*.html')
        ];

        this.composeWith('folklore:build', {
            arguments: [this.package_name],
            options: {
                'project-path': projectPath,
                'path': buildPath,
                'tmp-path': tmpPath,
                'src-path': srcPath,
                'dest-path': destPath,
                'js-path': './',
                'scss': false,
                'images': false,
                'copy': false,
                'clean-dest': true,
                'modernizr': false,
                'webpack-config': webpackConfig,
                'webpack-config-browsersync': webpackConfigBrowsersync,
                'browsersync-base-dir': browserSyncBaseDir,
                'browsersync-files': browserSyncFiles,
                'skip-install': skipInstall,
                'quiet': true
            }
        });
    },

    writing: {

        src: function()
        {
            var srcPath = this.templatePath('src');
            var destPath = this.destinationPath('src');
            this.directory(srcPath, destPath);
        },

        gitignore: function()
        {
            var projectPath = this.destinationPath();
            var srcPath = this.templatePath('gitignore');
            var destPath = this.destinationPath('.gitignore');
            this.fs.copy(srcPath, destPath);
        },

        eslintrc: function()
        {
            var srcPath = this.templatePath('eslintrc');
            var destPath = this.destinationPath('.eslintrc');
            this.fs.copy(srcPath, destPath);
        },

        babelrc: function()
        {
            var srcPath = this.templatePath('babelrc');
            var destPath = this.destinationPath('.babelrc');
            this.fs.copy(srcPath, destPath);
        },

        readme: function()
        {
            var srcPath = this.templatePath('Readme.md');
            var destPath = this.destinationPath('Readme.md');
            this.fs.copy(srcPath, destPath);
        },

        packageJSON: function()
        {
            var srcPath = this.templatePath('_package.json');
            var destPath = this.destinationPath('package.json');
            var packageJSON = this.fs.readJSON(srcPath);
            packageJSON.name = this.package_name;
            var currentPackageJSON = this.fs.exists(destPath) ? this.fs.readJSON(destPath):{};
            this.fs.writeJSON(destPath, _.merge(packageJSON, currentPackageJSON));
        },

        editorconfig: function()
        {
            var srcPath = this.templatePath('editorconfig');
            var destPath = this.destinationPath('.editorconfig');
            this.fs.copy(srcPath, destPath);
        }

    },

    install: {
        npm: function()
        {
            this.npmInstall([
                'babel-eslint@latest',
                'eslint@latest',
                'eslint-config-airbnb@latest',
                'eslint-plugin-import@latest',
                'eslint-plugin-jsx-a11y@latest',
                'eslint-plugin-react@latest',
                'jest@latest',
            ], {
                saveDev: true,
            });
        }
    }

});
