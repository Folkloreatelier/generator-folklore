import path from 'path';
import chalk from 'chalk';
import Generator from '../../lib/generator';

module.exports = class EditorConfigGenerator extends Generator {

    constructor(...args) {
        super(...args);

        this.option('project-path', {
            type: String,
            required: false,
            defaults: './',
        });
    }

    get prompting() {
        return {
            welcome() {
                if (this.options.quiet) {
                    return;
                }

                console.log(chalk.yellow('\n----------------------'));
                console.log('Editor Config Generator');
                console.log(chalk.yellow('----------------------\n'));
            },
        };
    }

    get writing() {
        return {
            editorconfig() {
                const projectPath = path.join(this.destinationPath(), this.options['project-path']);
                const srcPath = this.templatePath('editorconfig');
                const destPath = path.join(projectPath, '.editorconfig');
                this.fs.copy(srcPath, destPath);
            },
        };
    }
};
