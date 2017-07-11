import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class NpmPackageGenerator extends Generator {

    constructor(...args) {
        super(...args);

        this.argument('package-name', {
            type: String,
            required: false,
        });

        this.option('src', {
            type: Boolean,
            desc: 'Includes src path',
            defaults: true,
        });

        this.option('src-path', {
            type: String,
            desc: 'Path for source',
            defaults: './src',
        });

        this.option('tmp-path', {
            type: String,
            desc: 'Path for temp files',
            defaults: './.tmp',
        });

        this.option('dest-path', {
            type: String,
            desc: 'Path for build',
            defaults: './dist',
        });

        this.option('build-path', {
            type: String,
            desc: 'Path for build',
            defaults: './build',
        });

        this.option('browsersync-base-dir', {
            type: String,
            desc: 'BrowserSync base directories',
        });

        this.option('browsersync-files', {
            type: String,
            desc: 'BrowserSync files to watch',
        });

        this.option('webpack-config-base', {
            type: Boolean,
            desc: 'Add a base webpack config file',
            defaults: true,
        });

        this.option('webpack-config-dev', {
            type: Boolean,
            desc: 'Add a dev webpack config file',
            defaults: true,
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('NPM Package Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options['package-name']) {
                    prompts.push({
                        type: 'input',
                        name: 'package-name',
                        message: 'Name of the package:',
                    });
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts)
                    .then((answers) => {
                        if (answers['package-name']) {
                            this.options['package-name'] = answers['package-name'];
                        }
                    });
            },
        };
    }

    configuring() {
        const projectPath = this.destinationPath();
        const srcPath = _.get(this.options, 'src-path');
        const destPath = _.get(this.options, 'dest-path');
        const tmpPath = _.get(this.options, 'tmp-path');
        const buildPath = _.get(this.options, 'build-path');
        const skipInstall = _.get(this.options, 'skip-install', false);
        const webpackConfigBase = _.get(this.options, 'webpack-config-base', false);
        const webpackConfigDev = _.get(this.options, 'webpack-config-dev', false);
        const browserSyncBaseDir = _.get(this.options, 'browsersync-base-dir') || [
            tmpPath,
            srcPath,
        ];
        const browserSyncFiles = _.get(this.options, 'browsersync-files') || [
            path.join(srcPath, '*.html'),
        ];

        this.composeWith('folklore:build', {
            package_name: this.options['package-name'],
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
            'browsersync-base-dir': browserSyncBaseDir,
            'browsersync-files': browserSyncFiles,
            'skip-install': skipInstall,
            quiet: true,
        });
    }

    get writing() {
        return {
            src() {
                if (!this.options.src) {
                    return;
                }
                const srcPath = this.templatePath('src');
                const destPath = this.destinationPath('src');
                /* this.directory */this.fs.copyTpl(srcPath, destPath, this);
            },

            gitignore() {
                const srcPath = this.templatePath('gitignore');
                const destPath = this.destinationPath('.gitignore');
                this.fs.copy(srcPath, destPath);
            },

            eslintrc() {
                const srcPath = this.templatePath('eslintrc');
                const destPath = this.destinationPath('.eslintrc');
                this.fs.copy(srcPath, destPath);
            },

            babelrc() {
                const srcPath = this.templatePath('babelrc');
                const destPath = this.destinationPath('.babelrc');
                this.fs.copy(srcPath, destPath);
            },

            readme() {
                const srcPath = this.templatePath('Readme.md');
                const destPath = this.destinationPath('Readme.md');
                this.fs.copy(srcPath, destPath);
            },

            packageJSON() {
                const srcPath = this.templatePath('_package.json');
                const destPath = this.destinationPath('package.json');
                const packageJSON = this.fs.readJSON(srcPath);
                packageJSON.name = this.options['package-name'];
                const currentPackageJSON = this.fs.exists(destPath) ?
                    this.fs.readJSON(destPath) : {};
                this.fs.writeJSON(destPath, _.merge(packageJSON, currentPackageJSON));
            },

            editorconfig() {
                const srcPath = this.templatePath('editorconfig');
                const destPath = this.destinationPath('.editorconfig');
                this.fs.copy(srcPath, destPath);
            },
        };
    }

    get install() {
        return {
            npm() {
                this.yarnInstall([
                    'babel-eslint@latest',
                    'eslint@latest',
                    'eslint-config-airbnb@latest',
                    'eslint-plugin-import@latest',
                    'eslint-plugin-jsx-a11y@latest',
                    'eslint-plugin-react@latest',
                    'jest@latest',
                ], {
                    dev: true,
                });
            },
        };
    }
};
