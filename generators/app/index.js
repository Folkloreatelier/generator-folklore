var Generator = require('../../lib/generator');
var _ = require('lodash');

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
        
        this.types = [
            {
                'label': 'HTML',
                'name': 'html'
            },
            {
                'label': 'Laravel',
                'name': 'laravel'
            },
            {
                'label': 'Javascript',
                'name': 'js'
            }
        ];
        
        this.option('html-path', {
            type: String
        });
        this.option('js-path', {
            type: String
        });
        this.option('laravel-path', {
            type: String
        });
        this.option('build-path', {
            type: String
        });
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
                message : 'What type of project?',
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
    
    configuring: function()
    {
        var composeWith = 'folklore:'+this.type;
        var args = [];
        var opts = this.options;
        
        if(this.project_name && this.project_name.length)
        {
            args.push(this.project_name);
        }
        
        this.composeWith(composeWith, {
            arguments: args,
            options: opts
        });
    }
    
});
