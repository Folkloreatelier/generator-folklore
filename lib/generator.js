var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
    
    prompts: {
        project_name: {
            type    : 'input',
            name    : 'project_name',
            message : 'What is the name of the project?'
        }
    },
    
    constructor: function()
    {
        generators.Base.apply(this, arguments);
        
        this.option('without-dependencies', {
            type: Boolean,
            defaults: false
        });
    }
    
});
