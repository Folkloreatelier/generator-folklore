import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class JsGenerator extends Generator {

    // The name `constructor` is important here
    constructor(...args) {
        super(...args);

        this.argument('project-name', {
            type: String,
            required: false,
        });

        this.argument('type', {
            type: String,
            required: false,
        });

        this.option('project-path', {
            type: String,
            defaults: './',
        });

        this.option('react-hot-reload', {
            type: Boolean,
            defaults: false,
        });

        this.option('babel-compile', {
            type: Boolean,
            defaults: false,
        });

        this.option('babel-exclude-runtime', {
            type: Boolean,
            defaults: false,
        });

        this.option('path', {
            type: String,
            defaults: 'src/js',
        });
    }

    initializing() {
        this.react_features = [];
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Javascript Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options['project-name']) {
                    prompts.push(Generator.prompts.project_name);
                }

                if (!this.options.type) {
                    prompts.push({
                        type: 'list',
                        name: 'type',
                        message: 'What type of javascript project?',
                        choices: [
                            {
                                name: 'React',
                                value: 'react',
                            },
                        ],
                    });
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts)
                    .then((answers) => {
                        if (answers.type) {
                            this.options.type = answers.type;
                        }

                        if (answers.react_features) {
                            this.react_features = answers.react_features;
                        }

                        if (answers['project-name']) {
                            this.options['project-name'] = answers['project-name'];
                        }
                    });
            },
        };
    }

    get writing() {
        return {
            directory() {
                const jsPath = _.get(this.options, 'path');
                const srcPath = this.templatePath(this.options.type);
                const destPath = this.destinationPath(jsPath);
                /* this.directory */this.fs.copyTpl(srcPath, destPath, this);
            },

            config() {
                const jsPath = _.get(this.options, 'path');
                const srcPath = this.templatePath('config.js');
                const destPath = this.destinationPath(path.join(jsPath, 'config.js'));
                this.fs.copy(srcPath, destPath);
            },

            eslintrc() {
                const projectPath = _.get(this.options, 'project-path');
                const srcPath = this.templatePath('eslintrc');
                const destPath = this.destinationPath(path.join(projectPath, '.eslintrc'));
                this.fs.copy(srcPath, destPath);
            },

            babelrc() {
                const projectPath = _.get(this.options, 'project-path');
                const reactHotReloading = _.get(this.options, 'react-hot-reload');
                const babelCompile = _.get(this.options, 'babel-compile');
                const babelExcludeRuntime = _.get(this.options, 'babel-exclude-runtime');
                const srcPath = this.templatePath('babelrc');
                const destPath = this.destinationPath(path.join(projectPath, '.babelrc'));
                this.fs.copyTpl(srcPath, destPath, {
                    react_features: this.react_features,
                    hotReloading: reactHotReloading,
                    compile: babelCompile,
                    excludeRuntime: babelExcludeRuntime,
                });
            },

            packageJSON() {
                const projectPath = _.get(this.options, 'project-path');
                const srcPath = this.templatePath('_package.json');
                const destPath = this.destinationPath(path.join(projectPath, 'package.json'));

                const packageJSON = this.fs.readJSON(srcPath);
                packageJSON.name = this.options['project-name'];
                const currentPackageJSON = this.fs.exists(destPath) ?
                    this.fs.readJSON(destPath) : {};
                this.fs.writeJSON(destPath, _.merge(packageJSON, currentPackageJSON));
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
                    'domready@latest',
                    'fastclick@latest',
                    'hypernova@latest',
                    'keymirror@latest',
                    'lodash@latest',
                    'react@latest',
                    'prop-types@latest',
                    'react-dom@latest',
                    'react-redux@latest',
                    'history@^4.7.0',
                    'react-router@^4.2.0',
                    'react-router-redux@^5.0.0-alpha.9',
                    'react-helmet@latest',
                    'node-polyglot@latest',
                    'classnames@latest',
                    '@folklore/react-app@latest',
                ], {
                    save: true,
                });

                if (this.options['webpack-hot-reload']) {
                    this.npmInstall([
                        'react-hot-loader@^4.0.0-beta.21',
                    ], {
                        saveDev: true,
                    });
                }

                this.npmInstall([
                    'babel-plugin-add-module-exports@latest',
                    'babel-preset-airbnb@latest',
                    'babel-eslint@latest',
                    'eslint@4.16.0',
                    'eslint-config-airbnb@latest',
                    'eslint-plugin-import',
                    'eslint-plugin-jsx-a11y',
                    'eslint-plugin-react',
                    'html-webpack-plugin@latest',
                ], {
                    saveDev: true,
                });
            },
        };
    }
};
