import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import { pascal } from 'change-case';
import Generator from '../../lib/generator';

module.exports = class ReactPackageGenerator extends Generator {

    constructor(...args) {
        super(...args);

        this.argument('package_name', {
            type: String,
            required: false,
        });

        this.argument('component_name', {
            type: String,
            required: false,
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

        this.option('examples-path', {
            type: String,
            desc: 'Path for examples',
            defaults: './examples',
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('React Package Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.package_name) {
                    prompts.push({
                        type: 'input',
                        name: 'package_name',
                        message: 'Name of the package:',
                    });
                }

                if (!this.component_name) {
                    prompts.push({
                        type: 'input',
                        name: 'component_name',
                        message: 'Name of the component:',
                        default: (answers) => {
                            const packageName = (this.package_name || answers.package_name);
                            return packageName ? pascal(packageName) : undefined;
                        },
                    });
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts)
                    .then((answers) => {
                        if (answers.package_name) {
                            this.package_name = answers.package_name;
                        }
                        if (answers.component_name) {
                            this.component_name = answers.component_name;
                        }
                    });
            },
        };
    }

    configuring() {
        const srcPath = _.get(this.options, 'src-path');
        const destPath = _.get(this.options, 'dest-path');
        const tmpPath = _.get(this.options, 'tmp-path');
        const buildPath = _.get(this.options, 'build-path');
        const examplesPath = _.get(this.options, 'examples-path');
        const skipInstall = _.get(this.options, 'skip-install', false);

        this.composeWith('folklore:npm-package', {
            arguments: [this.package_name],
            options: {
                'src-path': srcPath,
                'dest-path': destPath,
                'tmp-path': tmpPath,
                'build-path': buildPath,
                'skip-install': skipInstall,
                'webpack-config': false,
                'webpack-config-dev': false,
                'browsersync-base-dir': [
                    tmpPath,
                    examplesPath,
                ],
                'browsersync-files': [
                    path.join(examplesPath, '**'),
                ],
                quiet: true,
            },
        });
    }

    get writing() {
        return {
            examples() {
                const srcPath = this.templatePath('examples');
                const destPath = this.destinationPath('examples');
                this.directory(srcPath, destPath);
            },

            src() {
                const indexPath = this.destinationPath('src/index.js');
                if (this.fs.exists(indexPath)) {
                    this.fs.delete(indexPath);
                }

                const indexTestPath = this.destinationPath('src/__tests__/index-test.js');
                if (this.fs.exists(indexTestPath)) {
                    this.fs.delete(indexTestPath);
                }

                const srcPath = this.templatePath('src');
                const destPath = this.destinationPath('src');
                this.fs.copyTpl(srcPath, destPath, {
                    componentName: this.component_name,
                });
            },

            storybookConfig() {
                const srcPath = this.templatePath('storybook.config.js');
                const destPath = this.destinationPath('.storybook/config.js');
                this.fs.copy(srcPath, destPath);
            },

            webpackConfig() {
                const buildPath = _.get(this.options, 'build-path');
                const srcPath = _.get(this.options, 'src-path');
                const tmpPath = _.get(this.options, 'tmp-path');
                const examplesPath = _.get(this.options, 'examples-path');
                const jsTmpPath = path.join(tmpPath, 'js');
                const jsExamplesPath = path.join(examplesPath, 'js');

                // Main
                const configSrcPath = this.templatePath('webpack.config.js');
                const configDestPath = this.destinationPath(path.join(buildPath, 'webpack.config.js'));
                this.fs.copyTpl(configSrcPath, configDestPath, {
                    srcPath,
                    tmpPath,
                    componentName: this.component_name,
                });

                // Browser sync
                const configBrowsersyncSrcPath = this.templatePath('webpack.config.browsersync.js');
                const configBrowsersyncDestPath = this.destinationPath(path.join(buildPath, 'webpack.config.browsersync.js'));
                this.fs.copyTpl(configBrowsersyncSrcPath, configBrowsersyncDestPath, {
                    srcPath: jsExamplesPath,
                    tmpPath: jsTmpPath,
                });
            },

            packageJSON() {
                const packagePath = this.destinationPath('package.json');
                this.fs.extendJSON(packagePath, {
                    scripts: {
                        storybook: 'start-storybook -p 9001 -c .storybook',
                    },
                });
            },
        };
    }

    get install() {
        return {
            npm() {
                if (this.options['skip-install']) {
                    return;
                }

                this.npmInstall([
                    'react@latest',
                    'react-dom@latest',
                ], {
                    save: true,
                });

                this.npmInstall([
                    'domready@latest',
                    'jquery@latest',
                    'enzyme@latest',
                    'react-test-renderer@latest',
                    '@kadira/storybook@latest',
                ], {
                    saveDev: true,
                });
            },
        };
    }
};
