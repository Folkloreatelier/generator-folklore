var generators = require('yeoman-generator');
var Immutable = require('immutable');
var path = require('path');
var _ = require('lodash');

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
        
        this.option('quiet', {
            type: Boolean,
            defaults: false
        });
    },
    
    getConfigPath: function()
    {
        var home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
        return path.join(home, '.config/yeoman-generator-folklore/config.json');
    },
    
    getConfig: function()
    {
        var configPath = this.getConfigPath();
        return this.fs.exists(configPath) ? this.fs.readJSON(configPath):{};
    },
    
    updateConfig: function(data, force)
    {
        if(typeof(force) === 'undefined')
        {
            force = false;
        }
        
        var config = Immutable.fromJS(this.getConfig());
        var newConfig = config;
        
        _.each(data, function(value, key)
        {
            if(force || (value && value.length && value !== _.get(config, key)))
            {
                newConfig = newConfig.set(key, value);
            }
        });
        
        data = newConfig.toJS();
        
        if(config !== newConfig)
        {
            var configPath = this.getConfigPath();
            this.fs.writeJSON(configPath, data);
        }
        
        return data;
    }
    
});
