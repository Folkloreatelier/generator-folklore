'use strict';

var Generator = require('../../lib/generator');
var _ = require('lodash');

module.exports = Generator.extend({

    // The name `constructor` is important here
    constructor: function constructor() {
        Generator.apply(this, arguments);

        this.argument('project_name', {
            type: String,
            required: false
        });

        this.argument('type', {
            type: String,
            required: false
        });
    },

    prompting: function prompting() {
        var prompts = [];

        if (!this.project_name) {
            prompts.push(this.prompts.project_name);
        }

        if (!this.type) {
            prompts.push({
                type: 'list',
                name: 'type',
                message: 'What type of project?',
                choices: [{
                    'name': 'HTML',
                    'value': 'html'
                }, {
                    'name': 'Laravel',
                    'value': 'laravel'
                }, {
                    'name': 'Javascript',
                    'value': 'js'
                }, {
                    'name': 'NPM Package',
                    'value': 'npm-package'
                }, {
                    'name': 'React Package',
                    'value': 'react-package'
                }]
            });
        }

        if (!prompts.length) {
            return;
        }

        return this.prompt(prompts).then(function (answers) {
            if (answers.type) {
                this.type = answers.type;
            }

            if (answers.project_name) {
                this.project_name = answers.project_name;
            }
        }.bind(this));
    },

    configuring: function configuring() {
        var composeWith = 'folklore:' + this.type;
        var args = [];
        var opts = this.options;

        if (this.project_name && this.project_name.length) {
            args.push(this.project_name);
        }

        this.composeWith(composeWith, {
            arguments: args,
            options: opts
        });
    }

});