import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class AppGenerator extends Generator {

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
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('FOLKLORE Generator');
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
                        message: 'What type of project?',
                        choices: [
                            {
                                name: 'HTML',
                                value: 'html',
                            },
                            {
                                name: 'Laravel',
                                value: 'laravel',
                            },
                            {
                                name: 'Javascript',
                                value: 'js',
                            },
                            {
                                name: 'NPM Package',
                                value: 'npm-package',
                            },
                            {
                                name: 'React Package',
                                value: 'react-package',
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
                            this.type = answers.type;
                        }

                        if (answers.project_name) {
                            this.project_name = answers.project_name;
                        }
                    });
            },
        };
    }

    configuring() {
        const composeWith = `folklore:${this.type}`;
        const args = [];
        const opts = this.options;

        if (this.project_name && this.project_name.length) {
            args.push(this.project_name);
        }

        this.composeWith(composeWith, {
            arguments: args,
            options: opts,
        });
    }

};
