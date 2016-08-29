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
                'label': 'React',
                'name': 'react'
            }
        ];
    },
    
    prompting: function ()
    {
        var prompts = [];
        
        if(!this.project_name)
        {
            prompts.push({
                type    : 'input',
                name    : 'project_name',
                message : 'What is the name of the project?'
            });
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
                var type = _.find(this.types, function(type)
                {
                    return type.label === answers.type;
                });
                this.type = type.name;
                
                this.project_name = answers.project_name;
            }.bind(this));
    }
    
});
