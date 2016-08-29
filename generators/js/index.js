var Generator = require('../../lib/generator');
var _ = require('lodash');
var path = require('path');

module.exports = Generator.extend({
    
    // The name `constructor` is important here
    constructor: function ()
    {
        Generator.apply(this, arguments);
        
        this.argument('project_name', {
            type: String,
            required: false
        });
        
        this.argument('type', {
            type: String,
            required: false
        });
        
        this.option('project-path', {
            type: String,
            defaults: './'
        });
        
        this.option('path', {
            type: String,
            defaults: 'src/js'
        });
        
        this.types = [
            {
                'label': 'React',
                'name': 'react'
            }
        ];
    },
    
    initializing: function()
    {
        
    },
    
    prompting: function ()
    {
        var prompts = [];
        
        if(!this.project_name)
        {
            prompts.push(this.prompts.project_name);
        }
        
        if(!this.type)
        {
            prompts.push({
                type    : 'list',
                name    : 'type',
                message : 'What type of javascript project?',
                choices: _.map(this.types, 'label')
            });
        }
        
        if(!prompts.length)
        {
            return;
        }
        
        return this.prompt(prompts)
            .then(function (answers)
            {
                if(answers.type)
                {
                    this.type = _.get(_.find(this.types, function(type)
                    {
                        return type.label === answers.type;
                    }), 'name');
                }
                
                if(answers.project_name)
                {
                    this.project_name = answers.project_name;
                }
            }.bind(this));
    },
    
    writing: {
        directory: function()
        {
            var jsPath = _.get(this.options, 'path');
            var srcPath = this.templatePath(this.type);
            var destPath = this.destinationPath(jsPath);
            this.directory(srcPath, destPath);
        },
        
        packageJSON: function()
        {
            var projectPath = _.get(this.options, 'project-path');
            var srcPath = this.templatePath('package.json');
            var destPath = this.destinationPath(path.join(projectPath, 'package.json'));
            this.fs.copyTpl(srcPath, destPath, {
                name: this.project_name
            });
        }
    }
    
});
