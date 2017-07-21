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

        this.option('relay-graphql-path', {
            type: String,
            defaults: './graphql',
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

                prompts.push({
                    type: 'checkbox',
                    name: 'react_features',
                    message: 'Which React features?',
                    choices: [
                        {
                            name: 'Router',
                            value: 'router',
                            checked: true,
                        },
                        {
                            name: 'Redux',
                            value: 'redux',
                            checked: true,
                            short: 'Redux',
                        },
                        {
                            name: 'Relay',
                            value: 'relay',
                            checked: false,
                            short: 'Relay',
                        },
                    ],
                    when: (answers) => {
                        const type = this.options.type || answers.type;
                        return type === 'react';
                    },
                });

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

                if (this.react_features.indexOf('relay') !== -1) {
                    const relaySrcPath = this.templatePath('relay');
                    const relayDestPath = this.destinationPath(jsPath);
                    /* this.directory */this.fs.copyTpl(relaySrcPath, relayDestPath, this);
                }
            },

            graphqlRelay() {
                if (!this.react_features || this.react_features.indexOf('relay') === -1) {
                    return;
                }
                const graphqlPath = _.get(this.options, 'relay-graphql-path');
                const srcPath = this.templatePath('graphql');
                const destPath = this.destinationPath(graphqlPath);
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

                this.yarnInstall([
                    'babel-plugin-add-module-exports@latest',
                    'babel-preset-airbnb@latest',
                    'domready@latest',
                    'fastclick@latest',
                    'hoist-non-react-statics@latest',
                    'hypernova@latest',
                    'immutable@latest',
                    'invariant@latest',
                    'keymirror@latest',
                    'lodash@latest',
                    'react@latest',
                    'prop-types@latest',
                    'react-dom@latest',
                    'react-redux@latest',
                    'history@3.0',
                    'react-router@3.0',
                    'react-router-scroll@latest',
                    'react-router-redux@4.0',
                    'redux@latest',
                    'redux-thunk@latest',
                    'redux-logger@latest',
                    'redux-promise@latest',
                    'redux-devtools@latest',
                    'redux-devtools-log-monitor@latest',
                    'redux-devtools-dock-monitor@latest',
                ]);

                if (this.options['webpack-hot-reload']) {
                    this.yarnInstall([
                        'react-hot-loader@^3.0.0-beta.7',
                    ], {
                        dev: true,
                    });
                }

                if (this.react_features.indexOf('relay') !== -1) {
                    this.yarnInstall([
                        'react-relay@latest',
                    ]);

                    this.yarnInstall([
                        'babel-relay-plugin@latest',
                        'babel-plugin-transform-relay-hot@latest',
                    ], {
                        dev: true,
                    });
                }

                this.yarnInstall([
                    'babel-eslint@latest',
                    'eslint@3.19.0',
                    'eslint-config-airbnb@15.0.2',
                    'eslint-plugin-import@2.6.1',
                    'eslint-plugin-jsx-a11y@5.1.1',
                    'eslint-plugin-react@7.1.0',
                    'html-webpack-plugin@latest',
                ], {
                    dev: true,
                });
            },
        };
    }
};
