import _ from 'lodash';
import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class ScssGenerator extends Generator {

    constructor(...args) {
        super(...args);

        this.argument('project_name', {
            type: String,
            required: false,
        });

        this.option('project-path', {
            type: String,
            defaults: './',
        });

        this.option('path', {
            type: String,
            defaults: 'src/scss',
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }
                console.log(chalk);
                console.log(chalk.yellow('\n----------------------'));
                console.log('SCSS Generator');
                console.log(chalk.yellow('----------------------\n'));
            },

            prompts() {
                const prompts = [];

                if (!this.project_name) {
                    prompts.push(Generator.prompts.project_name);
                }

                if (!prompts.length) {
                    return null;
                }

                return this.prompt(prompts)
                    .then((answers) => {
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
                const srcPath = this.templatePath('src');
                const destPath = this.destinationPath(_.get(this.options, 'path'));
                this.directory(srcPath, destPath);
            },

            sasslint() {
                const srcPath = this.templatePath('sass-lint.yml');
                const destPath = this.destinationPath('.sass-lint.yml');
                this.fs.copy(srcPath, destPath);
            },
        };
    }
};
