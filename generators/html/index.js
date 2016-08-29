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
        
        this.option('path', {
            type: String,
            desc: 'Path for the html project',
            defaults: './'
        });
        
        this.option('src-path', {
            type: String,
            desc: 'Path for source',
            defaults: './src'
        });
        
        this.option('tmp-path', {
            type: String,
            desc: 'Path for temp files',
            defaults: './.tmp'
        });
        
        this.option('dest-path', {
            type: String,
            desc: 'Path for build',
            defaults: './dist'
        });
        
        this.option('js-path', {
            type: String,
            desc: 'Path for the javascript',
            defaults: 'js'
        });
        
        this.option('css-path', {
            type: String,
            desc: 'Path for the css',
            defaults: 'css'
        });
        
        this.option('build-path', {
            type: String,
            desc: 'Path for the build tools',
            defaults: 'build'
        });
        
        this.option('server', {
            type: Boolean,
            defaults: false,
            desc: 'Add a node.js server'
        });
        
        this.option('server-path', {
            type: String,
            desc: 'Path for the node.js server'
        });
    },
    
    prompting: function ()
    {
        var prompts = [];
        
        if(!this.project_name)
        {
            prompts.push(this.prompts.project_name);
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
    },
    
    configuring: function()
    {
        var projectPath = _.get(this.options, 'path', '').replace(/\/$/, '');
        var srcPath = _.get(this.options, 'src-path');
        var destPath = _.get(this.options, 'dest-path');
        var tmpPath = _.get(this.options, 'tmp-path');
        var buildPath = _.get(this.options, 'build-path') || (projectPath + '/build');
        var jsPath = _.get(this.options, 'js-path', 'js');
        var jsSrcPath = path.join(projectPath, srcPath, jsPath);
        var cssPath = _.get(this.options, 'css-path', 'css');
        var cssSrcPath = path.join(projectPath, srcPath, cssPath);
        var withoutDependencies = _.get(this.options, 'without-dependencies', false);
        
        this.composeWith('folklore:js', {
            arguments: [this.project_name],
            options: {
                'project-path': projectPath,
                'path': jsSrcPath,
                'without-dependencies': withoutDependencies
            }
        });
        
        this.composeWith('folklore:css', {
            arguments: [this.project_name],
            options: {
                'project-path': projectPath,
                'path': cssSrcPath,
                'without-dependencies': withoutDependencies
            }
        });
        
        if(this.options.server)
        {
            this.composeWith('folklore:server', {
                arguments: [this.project_name],
                options: {
                    'project-path': projectPath,
                    'path': _.get(this.options, 'server-path') || (projectPath + '/server'),
                    'without-dependencies': withoutDependencies
                }
            });
        }
        
        this.composeWith('folklore:build', {
            arguments: [this.project_name],
            options: {
                'project-path': projectPath,
                'path': buildPath,
                'tmp-path': path.join(projectPath, tmpPath),
                'src-path': path.join(projectPath, srcPath),
                'dest-path': path.join(projectPath, destPath),
                'js-path': jsPath,
                'css-path': cssPath,
                'copy': true,
                'copy-path': path.join(projectPath, srcPath, '*.{html,ico,txt,png}'),
                'clean-dest': true,
                'browsersync-base-dir': [
                    path.join(projectPath, tmpPath),
                    path.join(projectPath, srcPath)
                ],
                'browsersync-files': [
                    path.join(projectPath, tmpPath, 'css/*.css'),
                    path.join(projectPath, srcPath, '*.html')
                ],
                'without-dependencies': withoutDependencies
            }
        });
    },
    
    writing:
    {
        html: function()
        {
            var projectPath = _.get(this.options, 'path', '').replace(/\/$/, '');
            var srcPath = _.get(this.options, 'src-path');
            var jsPath = _.get(this.options, 'js-path', 'js').replace(/^\/?/, '/');
            var cssPath = _.get(this.options, 'css-path', 'css').replace(/^\/?/, '/');
            
            var indexSrcPath = this.templatePath(path.join(projectPath, 'index.html'));
            var indexDestPath = this.destinationPath(path.join(projectPath, 'src/index.html'));
            this.fs.copyTpl(indexSrcPath, indexDestPath, {
                title: this.project_name,
                jsPath: jsPath,
                cssPath: cssPath
            });
        }
    }
    
});
