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

        this.option('relay-graphql-path', {
            type: String,
            defaults: './graphql'
        });

        this.option('path', {
            type: String,
            defaults: 'src/js'
        });
    },

    initializing: function()
    {
        this.react_features = [];
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
                        'short': 'Redux'
                    },
                    {
                        'name': 'Relay',
                        'value': 'relay',
                        'checked': false,
                        'short': 'Relay'
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

            if (this.react_features.indexOf('relay') !== -1) {
                var relaySrcPath = this.templatePath('relay');
                var relayDestPath = this.destinationPath(jsPath);
                this.directory(relaySrcPath, relayDestPath);
            }
        },

        graphqlRelay: function()
        {
            var graphqlPath = _.get(this.options, 'relay-graphql-path');
            var srcPath = this.templatePath('graphql');
            var destPath = this.destinationPath(graphqlPath);
            this.directory(srcPath, destPath);
        },

        config: function()
        {
            var jsPath = _.get(this.options, 'path');
            var srcPath = this.templatePath('config.js');
            var destPath = this.destinationPath(path.join(jsPath, 'config.js'));
            this.fs.copy(srcPath, destPath);
        },

        eslintrc: function()
        {
            var projectPath = _.get(this.options, 'project-path');
            var srcPath = this.templatePath('eslintrc');
            var destPath = this.destinationPath(path.join(projectPath, '.eslintrc'));
            this.fs.copy(srcPath, destPath);
        },

        babelrc: function()
        {
            var projectPath = _.get(this.options, 'project-path');
            var srcPath = this.templatePath('babelrc');
            var destPath = this.destinationPath(path.join(projectPath, '.babelrc'));
            this.fs.copyTpl(srcPath, destPath, {
                react_features: this.react_features
            });
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
                'domready@latest',
                'fastclick@latest',
                'hoist-non-react-statics@latest',
                'hypernova@latest',
                'immutable@latest',
                'invariant@latest',
                'keymirror@latest',
                'lodash@latest',
                'react@latest',
                'react-dom@latest',
                'react-redux@latest',
                'react-router@latest',
                'react-router-scroll@latest',
                'react-router-redux@latest',
                'redux@latest',
                'redux-thunk@latest',
                'redux-logger@latest',
                'redux-promise@latest',
                'redux-devtools@latest',
                'redux-devtools-log-monitor@latest',
                'redux-devtools-dock-monitor@latest'
            ], {
                'save': true
            });

            if (this.react_features.indexOf('relay') !== -1) {
                this.npmInstall([
                    'react-relay@latest',
                ], {
                    'save': true
                });

                this.npmInstall([
                    'babel-relay-plugin@latest',
                    'babel-plugin-transform-relay-hot@latest',
                ], {
                    'saveDev': true
                });
            }

            this.npmInstall([
                'babel-eslint@latest',
                'eslint@latest',
                'eslint-config-airbnb@latest',
                'eslint-plugin-import@latest',
                'eslint-plugin-jsx-a11y@latest',
                'eslint-plugin-react@latest',
            ], {
                'saveDev': true
            });
        }
    }

});
