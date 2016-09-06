var Generator = require('../../lib/generator');
var _ = require('lodash');
var remote = require('yeoman-remote');
var glob = require('glob');
var path = require('path');
var colors = require('colors');
var generatePassword = require('password-generator');

module.exports = Generator.extend({
    
    // The name `constructor` is important here
    constructor: function ()
    {
        Generator.apply(this, arguments);
        
        this.argument('project_name', {
            type: String,
            required: false
        });
        
        this.argument('project_host', {
            type: String,
            required: false
        });
        
        this.option('url', {
            type: String,
            desc: 'Project url',
            defaults: 'http://<%= project_host %>'
        });
        
        this.option('local-url', {
            type: String,
            desc: 'Project local url',
            defaults: 'http://<%= project_host %>.local.flklr.ca'
        });
        
        this.option('tmp-path', {
            type: String,
            desc: 'Path for temp files',
            defaults: '.tmp'
        });
        
        this.option('assets-path', {
            type: String,
            desc: 'Path for assets',
            defaults: 'resources/assets'
        });
        
        this.option('public-path', {
            type: String,
            desc: 'Path for build',
            defaults: 'public'
        });
        
        this.option('build-path', {
            type: String,
            desc: 'Path for the build tools',
            defaults: 'build'
        });
        
        this.option('js-path', {
            type: String,
            desc: 'Path for the javascript',
            defaults: 'js'
        });
        
        this.option('scss-path', {
            type: String,
            desc: 'Path for the scss',
            defaults: 'scss'
        });
        
        this.option('css-path', {
            type: String,
            desc: 'Path for the css',
            defaults: 'css'
        });
        
        this.option('images-path', {
            type: String,
            desc: 'Path for the images',
            defaults: 'img'
        });
        
        this.option('skip-db', {
            type: Boolean,
            desc: 'Skip the creation of the database',
            defaults: false
        });
        
        this.option('db-name', {
            type: String,
            desc: 'Database name'
        });
        
        this.option('db-user', {
            type: String,
            desc: 'Database user'
        });
        
        this.option('db-password', {
            type: String,
            desc: 'Database password'
        });
    },
    
    prompting: {
        
        welcome: function()
        {
            if(this.options.quiet)
            {
                return;
            }
            
            console.log('\n----------------------'.yellow);
            console.log('Laravel Generator');
            console.log('----------------------\n'.yellow);
        },
        
        prompts: function ()
        {
            
            
            var prompts = [];
            
            if(!this.project_name)
            {
                prompts.push(this.prompts.project_name);
            }
            
            if(!this.project_host)
            {
                prompts.push({
                    type    : 'input',
                    name    : 'project_host',
                    message : 'What is the host of the project?',
                    default: function(answers)
                    {
                        var projectName = (this.project_name || answers.project_name);
                        return projectName.match(/\.[^\.]+$/) ? projectName:(projectName+'.com');
                    }.bind(this)
                });
            }
            
            if(!this.options['skip-db'])
            {
                if(!this.options['db-name'] || !this.options['db-name'].length)
                {
                    prompts.push({
                        type    : 'input',
                        name    : 'db_name',
                        message : 'Database name:',
                        default: function(answers)
                        {
                            return this._safeDbString(this.project_name || answers.project_name);
                        }.bind(this)
                    });
                }
                
                if(!this.options['db-user'] || !this.options['db-user'].length)
                {
                    prompts.push({
                        type    : 'input',
                        name    : 'db_user',
                        message : 'Database user:',
                        default: function(answers)
                        {
                            return this._safeDbString(this.project_name || answers.project_name);
                        }.bind(this)
                    });
                }
                
                if(!this.options['db-password'] || !this.options['db-password'].length)
                {
                    prompts.push({
                        type: 'input',
                        name: 'db_password',
                        message: 'Database password:',
                        default: 'leave empty for auto-generated'
                    });
                }
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
                    if(answers.project_host)
                    {
                        this.project_host = answers.project_host;
                    }
                    
                    if(!this.options['skip-db'])
                    {
                        this.db_name = _.get(answers, 'db_name', this.options['db-name']);
                        this.db_user = _.get(answers, 'db_user', this.options['db-user']);
                        this.db_password = _.get(answers, 'db_password', this.options['db-password']) || '';
                        if(!this.db_password.length || this.db_password === 'leave empty for auto-generated')
                        {
                            this.db_password = this._getPassword();
                        }
                    }
                    
                }.bind(this));
        }
    },
    
    configuring: function()
    {
        var projectPath = this.destinationPath();
        var assetsPath = _.get(this.options, 'assets-path', '').replace(/\/$/, '');
        var tmpPath = _.get(this.options, 'tmp-path', '').replace(/\/$/, '');
        var publicPath = _.get(this.options, 'public-path');
        var buildPath = _.get(this.options, 'build-path');
        var jsPath = _.get(this.options, 'js-path');
        var jsSrcPath = path.join(assetsPath, jsPath);
        var scssPath = _.get(this.options, 'scss-path');
        var scssSrcPath = path.join(assetsPath, scssPath);
        var cssPath = _.get(this.options, 'css-path');
        var imagesPath = _.get(this.options, 'images-path');
        var skipInstall = _.get(this.options, 'skip-install', false);
        var urlLocal = _.template(_.get(this.options, 'local-url'))({
            project_host: this.project_host,
            project_name: this.project_name
        }).replace(/^(http)?(s)?(\:\/\/)?/, 'http$2://');
        
        this.composeWith('folklore:js', {
            arguments: [this.project_name],
            options: {
                'project-path': projectPath,
                'path': jsSrcPath,
                'skip-install': skipInstall,
                'quiet': true
            }
        });
        
        this.composeWith('folklore:scss', {
            arguments: [this.project_name],
            options: {
                'project-path': projectPath,
                'path': scssSrcPath,
                'quiet': true
            }
        });
        
        this.composeWith('folklore:build', {
            arguments: [this.project_name],
            options: {
                'project-path': projectPath,
                'path': buildPath,
                'tmp-path': tmpPath,
                'src-path': assetsPath,
                'dest-path': publicPath,
                'js-path': jsPath,
                'scss-path': scssPath,
                'css-path': cssPath,
                'images-path': imagesPath,
                'webpack-entry-vendor': ['jquery', 'lodash'],
                'browsersync-base-dir': [
                    tmpPath,
                    publicPath
                ],
                'browsersync-proxy': urlLocal,
                'browsersync-files': [
                    'config/**/*.php',
                    'app/**/*.php',
                    'resources/views/**/*.php',
                    path.join(tmpPath, 'css/*.css'),
                    path.join(publicPath, '*.html'),
                    path.join(publicPath, '**/*.{jpg,png,ico,gif}')
                ],
                'skip-install': skipInstall,
                'quiet': true
            }
        });
        
        if(!this.options['skip-db'])
        {
            this.composeWith('folklore:db', {
                arguments: [this.db_name],
                options: {
                    'user': this.db_user,
                    'password': this.db_password,
                    'quiet': true
                }
            });
        }
    },
    
    writing: {
        
        laravel: function()
        {
            var done = this.async();
            
            remote('laravel', 'laravel', function (err, cachePath)
            {
                var destinationPath = this.destinationPath();
                var files = glob.sync('**', {
                    dot: true,
                    nodir: true,
                    cwd: cachePath
                });
                
                var source, destination;
                for (var i in files)
                {
                    source = path.join(cachePath, files[i]);
                    destination = path.join(destinationPath, files[i]);
                    this.bulkCopy(source, destination);
                }
                
                done();
            }.bind(this));
        },
        
        removeFiles: function()
        {
            var files = [
                'gulpfile.js',
                'package.json',
                'config/app.php',
                'routes/web.php',
                'public/css/app.css',
                'public/js/app.js',
                'resources/assets/sass',
                'resources/assets/js',
                'resources/views/welcome.blade.php'
            ];
            
            var file;
            for(var i = 0, fl = files.length; i < fl; i++)
            {
                file = this.destinationPath(files[i]);
                this.fs.delete(file);
            }
        },
        
        composerJSON: function()
        {
            var src = this.destinationPath('composer.json');
            this.fs.extendJSON(src, {
                require: {
                    'folklore/image': '^0.3',
                    'folklore/locale': '^2.0',
                    'barryvdh/laravel-debugbar': '^2.2'
                }
            });
        },
        
        env: function()
        {
            var url = _.template(_.get(this.options, 'local-url'))({
                project_host: this.project_host,
                project_name: this.project_name
            }).replace(/^(http)?(s)?(\:\/\/)?/, 'http$2://');
            
            var urlLocal = _.template(_.get(this.options, 'local-url'))({
                project_host: this.project_host,
                project_name: this.project_name
            }).replace(/^(http)?(s)?(\:\/\/)?/, 'http$2://');
            
            var templateData = {
                project_name: this.project_name,
                db_name: this.db_name,
                db_user: this.db_user,
                db_password: this.db_password,
                url: urlLocal
            };
            
            var src = this.templatePath('env');
            var dest = this.destinationPath('.env');
            this.fs.copyTpl(src, dest, templateData);
            
            var srcProd = this.templatePath('env.prod');
            var destProd = this.destinationPath('.env.prod');
            templateData.url = url;
            this.fs.copyTpl(srcProd, destProd, templateData);
        },
        
        files: function()
        {    
            var templatePath = this.templatePath('laravel');
            var destinationPath = this.destinationPath();
            var files = glob.sync('**', {
                dot: true,
                nodir: true,
                cwd: templatePath
            });
            
            var file, source, destination;
            for (var i in files)
            {
                file = files[i];
                source = path.join(templatePath, file);
                destination = path.join(destinationPath, file);
                if(file.match(/\.(jpg|jpeg|gif|png)$/i))
                {
                    this.fs.copy(source, destination);
                }
                else
                {
                    this.fs.copyTpl(source, destination, {
                        project_name: this.project_name
                    });
                }
            }
        }
        
    },
    
    install: {
        
        composer: function()
        {
            if(this.options['skip-install'])
            {
                return;
            }
            
            this.spawnCommand('composer', ['install']);
        },
        
        permissions: function()
        {
            this.spawnCommand('chmod', ['-R', '777', 'storage']);
            this.spawnCommand('chmod', ['-R', '777', 'public/files']);
        },
        
        keyGenerate: function()
        {
            this.spawnCommand('php', ['artisan', 'key:generate']);
        },
        
        vendorPublish: function()
        {
            this.spawnCommand('php', ['artisan', 'vendor:publish']);
        }
        
    },
    
    _safeDbString: function(str)
    {
        return str.replace(/[\-\s\.]+/gi, '_')
            .replace(/[^a-z0-9]+/gi, '');
    },
    
    _getPassword: function()
    {
        return generatePassword(20, false);
    }
    
});
