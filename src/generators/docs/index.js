import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class DocsGenerator extends Generator {

    constructor(...args) {
        super(...args);

        this.option('project-path', {
            type: String,
            required: false,
            defaults: './',
        });

        this.option('docs-path', {
            type: String,
            required: false,
            defaults: './docs',
        });

        this.option('language', {
            type: String,
            required: false,
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Eslint Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.options.language) {
                    prompts.push({
                        type: 'list',
                        name: 'type',
                        message: 'What language is used?',
                        defaults: () => (
                            this.fs.exists(this.destinationPath('composer.json')) ? 'php' : 'js'
                        ),
                        choices: [
                            {
                                name: 'Javascript',
                                value: 'js',
                            },
                            {
                                name: 'PHP',
                                value: 'php',
                            },
                        ],
                    });
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts)
                    .then((answers) => {
                        if (answers.language) {
                            this.language = answers.language;
                        }
                    });
            },
        };
    }

    get writing() {
        return {
            bookJSON() {
                const projectPath = path.join(this.destinationPath(), this.options['project-path']);
                const srcPath = this.templatePath('book.json');
                const destPath = path.join(projectPath, 'book.json');
                this.fs.copy(srcPath, destPath);
            },

            jsdocJSON() {
                if (this.options.language !== 'js') {
                    return;
                }
                const projectPath = path.join(this.destinationPath(), this.options['project-path']);
                const srcPath = this.templatePath('jsdoc.json');
                const destPath = path.join(projectPath, 'jsdoc.json');
                this.fs.copy(srcPath, destPath);
            },

            phpdoc() {
                if (this.options.language !== 'php') {
                    return;
                }
                const projectPath = path.join(this.destinationPath(), this.options['project-path']);
                const srcPath = this.templatePath('phpdoc.xml');
                const destPath = path.join(projectPath, 'phpdoc.xml');
                this.fs.copy(srcPath, destPath);
            },

            docs() {
                const srcPath = this.templatePath('docs');
                const destPath = path.join(
                    this.destinationPath(),
                    this.options['project-path'],
                    this.options['docs-path'],
                );
                this.fs.copy(srcPath, destPath);
            },

            generateApiDoc() {
                const srcPath = this.templatePath(`generate_api_doc.${this.options.language}`);
                const destPath = path.join(
                    this.destinationPath(),
                    this.options['project-path'],
                    this.options['docs-path'],
                    'scripts/generate_api_doc',
                );
                this.fs.copy(srcPath, destPath);
            },

            packageJSON() {
                const generateApiPath = path.join(
                    this.options['project-path'],
                    this.options['docs-path'],
                    './scripts/generate_api_doc',
                );
                const scripts = {
                    'docs:prepare': 'gitbook install',
                    'docs:api': `phpdoc && ${generateApiPath}`,
                    'docs:serve': 'npm run docs:prepare && npm run docs:api && gitbook serve',
                    'build:docs': 'npm run docs:prepare && npm run docs:api',
                };

                const projectPath = _.get(this.options, 'project-path');
                const srcPath = this.templatePath('_package.json');
                const destPath = this.destinationPath(path.join(projectPath, 'package.json'));

                const packageJSON = this.fs.readJSON(srcPath);
                packageJSON.scripts = {
                    ...packageJSON.scripts,
                    ...scripts,
                };
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
                    'gitbook-cli@latest',
                ], {
                    saveDev: true,
                });

                if (this.options.langage === 'js') {
                    this.npmInstall([
                        'jsdoc@latest',
                        'jsdoc-babel@latest',
                    ], {
                        saveDev: true,
                    });
                }
            },
        };
    }
};
