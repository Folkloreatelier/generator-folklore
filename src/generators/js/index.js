import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class JsGenerator extends Generator {

    // The name `constructor` is important here
    constructor(...args) {
        super(...args);

        this.argument('project_name', {
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

                if (!this.project_name) {
                    prompts.push(Generator.prompts.project_name);
                }

                if (!this.type) {
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
                        const type = this.type || answers.type;
                        return type === 'react';
                    },
                });

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts)
                    .then((answers) => {
                        if (answers.type) {
                            this.type = answers.type;
                        }

                        if (answers.react_features) {
                            this.react_features = answers.react_features;
                        }

                        if (answers.project_name) {
                            this.project_name = answers.project_name;
                        }
                    });
            },
        };
    }

    get writing() {
        return {
            directory() {
                const jsPath = _.get(this.options, 'path');
                const srcPath = this.templatePath(this.type);
                const destPath = this.destinationPath(jsPath);
                this.directory(srcPath, destPath);

                if (this.react_features.indexOf('relay') !== -1) {
                    const relaySrcPath = this.templatePath('relay');
                    const relayDestPath = this.destinationPath(jsPath);
                    this.directory(relaySrcPath, relayDestPath);
                }
            },

            graphqlRelay() {
                if (!this.react_features || this.react_features.indexOf('relay') === -1) {
                    return;
                }
                const graphqlPath = _.get(this.options, 'relay-graphql-path');
                const srcPath = this.templatePath('graphql');
                const destPath = this.destinationPath(graphqlPath);
                this.directory(srcPath, destPath);
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
                const srcPath = this.templatePath('babelrc');
                const destPath = this.destinationPath(path.join(projectPath, '.babelrc'));
                this.fs.copyTpl(srcPath, destPath, {
                    react_features: this.react_features,
                });
            },

            packageJSON() {
                const projectPath = _.get(this.options, 'project-path');
                const srcPath = this.templatePath('_package.json');
                const destPath = this.destinationPath(path.join(projectPath, 'package.json'));

                const packageJSON = this.fs.readJSON(srcPath);
                packageJSON.name = this.project_name;
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
                    'hoist-non-react-statics@latest',
                    'hypernova@latest',
                    'immutable@latest',
                    'invariant@latest',
                    'keymirror@latest',
                    'lodash@latest',
                    'react@latest',
                    'react-dom@latest',
                    'react-redux@latest',
                    'react-router@latest',
                    'react-router-scroll@latest',
                    'react-router-redux@latest',
                    'redux@latest',
                    'redux-thunk@latest',
                    'redux-logger@latest',
                    'redux-promise@latest',
                    'redux-devtools@latest',
                    'redux-devtools-log-monitor@latest',
                    'redux-devtools-dock-monitor@latest',
                ], {
                    save: true,
                });

                if (this.react_features.indexOf('relay') !== -1) {
                    this.npmInstall([
                        'react-relay@latest',
                    ], {
                        save: true,
                    });

                    this.npmInstall([
                        'babel-relay-plugin@latest',
                        'babel-plugin-transform-relay-hot@latest',
                    ], {
                        saveDev: true,
                    });
                }

                this.npmInstall([
                    'babel-eslint@latest',
                    'eslint@latest',
                    'eslint-config-airbnb@latest',
                    'eslint-plugin-import@latest',
                    'eslint-plugin-jsx-a11y@latest',
                    'eslint-plugin-react@latest',
                ], {
                    saveDev: true,
                });
            },
        };
    }
};
