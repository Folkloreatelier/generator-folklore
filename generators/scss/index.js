var Generator = require('../../lib/generator');
var _ = require('lodash');
var path = require('path');
var colors = require('colors');

module.exports = Generator.extend({

    // The name `constructor` is important here
    constructor: function ()
    {
        Generator.apply(this, arguments);

        this.argument('project_name', {
            type: String,
            required: false
        });

        this.option('project-path', {
            type: String,
            defaults: './'
        });

        this.option('path', {
            type: String,
            defaults: 'src/scss'
        });
    },

    initializing: function()
    {

    },

    prompting: {

        welcome: function()
        {
            if(this.options.quiet)
            {
                return;
            }

            console.log('\n----------------------'.yellow);
            console.log('SCSS Generator');
            console.log('----------------------\n'.yellow);
        },

        prompts: function ()
        {
            var prompts = [];

            if(!this.project_name)
            {
                prompts.push(Generator.prompts.project_name);
            }

            if(!prompts.length)
            {
                return;
            }

            return this.prompt(prompts)
                .then(function (answers)
                {
                    if(answers.project_name)
                    {
                        this.project_name = answers.project_name;
                    }
                }.bind(this));
        }
    },

    writing: {
        directory: function()
        {
            var path = _.get(this.options, 'path');
            var srcPath = this.templatePath('src');
            var destPath = this.destinationPath(path);
            this.directory(srcPath, destPath);
        },

        sasslint: function()
        {
            var srcPath = this.templatePath('sass-lint.yml');
            var destPath = this.destinationPath('.sass-lint.yml');
            this.fs.copy(srcPath, destPath);
        }
    }

});
