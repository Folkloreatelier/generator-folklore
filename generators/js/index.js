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
            console.log('Javascript Generator');
            console.log('----------------------\n'.yellow);
        },
        
        prompts: function ()
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
                    choices : [
                        {
                            'name': 'React',
                            'value': 'react'
                        }
                    ]
                });
            }
            
            prompts.push({
                type: 'checkbox',
                name: 'react_features',
                message: 'Which React features?',
                choices: [
                    {
                        'name': 'Router',
                        'value': 'router',
                        'checked': true
                    },
                    {
                        'name': 'Redux',
                        'value': 'redux',
                        'checked': true,
                        'short': 'Router'
                    }
                ],
                when: function(answers)
                {
                    var type = this.type || answers.type;
                    return type === 'react' ? true:false;
                }.bind(this)
            });
            
            if(!prompts.length)
            {
                return;
            }
            
            return this.prompt(prompts)
                .then(function (answers)
                {
                    if(answers.type)
                    {
                        this.type = answers.type;
                    }
                    
                    if(answers.react_features)
                    {
                        this.react_features = answers.react_features;
                    }
                    
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
            var jsPath = _.get(this.options, 'path');
            var srcPath = this.templatePath(this.type);
            var destPath = this.destinationPath(jsPath);
            this.directory(srcPath, destPath);
        },
        
        config: function()
        {
            var jsPath = _.get(this.options, 'path');
            var srcPath = this.templatePath('config.js');
            var destPath = this.destinationPath(path.join(jsPath, 'config.js'));
            this.fs.copy(srcPath, destPath);
        },
        
        jshintrc: function()
        {
            var projectPath = _.get(this.options, 'project-path');
            var srcPath = this.templatePath('jshintrc');
            var destPath = this.destinationPath(path.join(projectPath, '.jshintrc'));
            this.fs.copy(srcPath, destPath);
        },
        
        babelrc: function()
        {
            var projectPath = _.get(this.options, 'project-path');
            var srcPath = this.templatePath('babelrc');
            var destPath = this.destinationPath(path.join(projectPath, '.babelrc'));
            this.fs.copy(srcPath, destPath);
        },
        
        editorconfig: function()
        {
            var projectPath = _.get(this.options, 'project-path');
            var srcPath = this.templatePath('editorconfig');
            var destPath = this.destinationPath(path.join(projectPath, '.editorconfig'));
            this.fs.copy(srcPath, destPath);
        },
        
        packageJSON: function()
        {
            var projectPath = _.get(this.options, 'project-path');
            var srcPath = this.templatePath('_package.json');
            var destPath = this.destinationPath(path.join(projectPath, 'package.json'));
            this.fs.copyTpl(srcPath, destPath, {
                name: this.project_name
            });
        }
    },
    
    install: {
        npm: function()
        {
            if(this.options['skip-install'])
            {
                return;
            }
            
            this.npmInstall([
                'jquery@latest',
                'lodash@latest',
                'react@latest',
                'react-dom@latest',
                'redux@latest',
                'redux-thunk@latest',
                'redux-logger@latest',
                'redux-promise@latest',
                'react-redux@latest',
                'react-router@latest',
                'react-router-redux@latest',
                'immutable@latest',
                'keymirror@latest',
                'fastclick@latest',
                'redux-devtools@latest',
                'redux-devtools-log-monitor@latest',
                'redux-devtools-dock-monitor@latest'
            ], {
                'save': true
            });
        }
    }
    
});
