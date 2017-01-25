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
            defaults: './build/'
        });

        this.option('tmp-path', {
            type: String,
            defaults: './.tmp/'
        });

        this.option('src-path', {
            type: String,
            defaults: './src/'
        });

        this.option('dest-path', {
            type: String,
            defaults: './dist/'
        });

        this.option('clean-dest', {
            type: Boolean,
            defaults: false
        });

        this.option('watch', {
            type: Boolean,
            defaults: true
        });

        this.option('modernizr', {
            type: Boolean,
            defaults: true
        });

        this.option('copy', {
            type: Boolean,
            defaults: false
        });

        this.option('copy-path', {
            type: String,
            defaults: 'src/*.{js,css,html,ico,txt}'
        });

        this.option('js', {
            type: Boolean,
            defaults: true
        });

        this.option('js-path', {
            type: String,
            defaults: 'js'
        });

        this.option('js-src-path', {
            type: String,
            defaults: null
        });

        this.option('js-tmp-path', {
            type: String,
            defaults: null
        });

        this.option('js-dest-path', {
            type: String,
            defaults: null
        });

        this.option('webpack-public-path', {
            type: String,
            defaults: null
        });

        this.option('webpack-entry', {
            type: String
        });

        this.option('webpack-config', {
            type: Boolean,
            defaults: true
        });

        this.option('webpack-config-build', {
            type: Boolean,
            defaults: true
        });

        this.option('webpack-config-browsersync', {
            type: Boolean,
            defaults: true
        });

        this.option('webpack-config-path', {
            type: String
        });

        this.option('webpack-config-build-path', {
            type: String
        });

        this.option('webpack-config-browsersync-path', {
            type: String
        });

        this.option('images', {
            type: Boolean,
            defaults: true
        });

        this.option('images-path', {
            type: String,
            defaults: 'img'
        });

        this.option('images-src-path', {
            type: String,
            defaults: null
        });

        this.option('images-dest-path', {
            type: String,
            defaults: null
        });

        this.option('scss', {
            type: Boolean,
            defaults: true
        });

        this.option('scss-path', {
            type: String,
            defaults: 'scss'
        });

        this.option('css-path', {
            type: String,
            defaults: 'css'
        });

        this.option('scss-src-path', {
            type: String,
            defaults: null
        });

        this.option('scss-tmp-path', {
            type: String,
            defaults: null
        });

        this.option('scss-dest-path', {
            type: String,
            defaults: null
        });

        this.option('browsersync', {
            type: Boolean,
            defaults: true
        });

        this.option('browsersync-proxy', {
            type: String
        });

        this.option('browsersync-base-dir', {
            type: String,
            defaults: './'
        });

        this.option('browsersync-files', {
            type: String,
            defaults: './*'
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
            console.log('Build tools Generator');
            console.log('----------------------\n'.yellow);
        },

        prompts: function ()
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
        }
    },

    writing: {
        config: function()
        {
            var buildPath = _.get(this.options, 'path', false);
            var tmpPath = _.get(this.options, 'tmp-path');
            var hasBrowserSync = _.get(this.options, 'browsersync', false);
            var browserSyncProxy = _.get(this.options, 'browsersync-proxy', null);
            var browserSyncBaseDir = _.get(this.options, 'browsersync-base-dir', []);
            var browserSyncFiles = _.get(this.options, 'browsersync-files', []);
            var jsPath = _.get(this.options, 'js-path', 'js');
            var jsTmpPath = _.get(this.options, 'js-tmp-path', null) || path.join(tmpPath, jsPath);

            var templateData = {
                hasBrowserSync: hasBrowserSync,
                browserSyncProxy: browserSyncProxy && browserSyncProxy.length ? browserSyncProxy:null,
                browserSyncBaseDir: _.isArray(browserSyncBaseDir) ? browserSyncBaseDir:[browserSyncBaseDir],
                browserSyncFiles: _.isArray(browserSyncFiles) ? browserSyncFiles:[browserSyncFiles],
                modernizrDestPath: path.join(jsTmpPath, 'modernizr.js')
            };

            var srcPath = this.templatePath('config.js');
            var destPath = this.destinationPath(path.join(buildPath, 'config.js'));
            this.fs.copyTpl(srcPath, destPath, templateData);
        },

        browsersync: function()
        {
            if(!_.get(this.options, 'browsersync', false))
            {
                return;
            }

            if(!this.options.browsersync)
            {
                return;
            }

            var templateData = {

            };

            var buildPath = _.get(this.options, 'path');
            var srcPath = this.templatePath('browsersync.js');
            var destPath = this.destinationPath(path.join(buildPath, 'browsersync.js'));
            this.fs.copyTpl(srcPath, destPath, templateData);
        },

        modernizr: function()
        {
            if(!_.get(this.options, 'modernizr', false))
            {
                return;
            }

            var destPath = _.get(this.options, 'dest-path');
            var jsPath = _.get(this.options, 'js-path', 'js');
            var jsDestPath = _.get(this.options, 'js-dest-path', null) || path.join(destPath, jsPath);

            var templateData = {
                destPath: path.join(jsDestPath, 'modernizr.js')
            };

            var buildPath = _.get(this.options, 'path');
            var modernizrSrcPath = this.templatePath('modernizr.js');
            var modernizrDestPath = this.destinationPath(path.join(buildPath, 'modernizr.js'));
            this.fs.copyTpl(modernizrSrcPath, modernizrDestPath, templateData);
        },

        postcss: function()
        {
            if(!_.get(this.options, 'scss', false))
            {
                return;
            }

            var templateData = {

            };

            var buildPath = _.get(this.options, 'path');
            var srcPath = this.templatePath('postcss.js');
            var destPath = this.destinationPath(path.join(buildPath, 'postcss.js'));
            this.fs.copyTpl(srcPath, destPath, templateData);
        },

        webpack: function()
        {
            if(!_.get(this.options, 'js', false))
            {
                return;
            }

            var buildPath = _.get(this.options, 'path');
            var projectPath = _.get(this.options, 'project-path');
            var tmpPath = _.get(this.options, 'tmp-path');
            var srcPath = _.get(this.options, 'src-path');
            var destPath = _.get(this.options, 'dest-path');
            var jsPath = _.get(this.options, 'js-path', 'js');
            var jsTmpPath = _.get(this.options, 'js-tmp-path', null) || path.join(tmpPath, jsPath);
            var jsSrcPath = _.get(this.options, 'js-src-path', null) || path.join(srcPath, jsPath);
            var jsDestPath = _.get(this.options, 'js-dest-path', null) || path.join(destPath, jsPath);
            var publicPath = _.get(this.options, 'webpack-public-path', null) || jsPath.replace(/^\/?/, '/');
            var entries = _.get(this.options, 'webpack-entry');
            if(entries && !_.isObject(entries))
            {
                var newEntries = {};
                entries = _.isArray(entries) ? entries:(entries && entries.length ? [entries]:[]);
                _.each(entries, function(entry)
                {
                    entry = entry.split(',');
                    newEntries[entry[0]] = entry.slice(1);
                });
                entries = newEntries;
            } else if (!entries) {
                entries = {
                    main: './index'
                };
            }

            var templateData = {
                srcPath: jsSrcPath,
                tmpPath: jsTmpPath,
                destPath: jsDestPath,
                publicPath: publicPath,
                entries: entries
            };

            var configSrcPath, configDestPath;

            if(_.get(this.options, 'webpack-config'))
            {
                configSrcPath = _.get(this.options, 'webpack-config-path') || this.templatePath('webpack.config.js');
                configDestPath = this.destinationPath(path.join(buildPath, 'webpack.config.js'));
                this.fs.copyTpl(configSrcPath, configDestPath, templateData);
            }

            if(_.get(this.options, 'webpack-config-build'))
            {
                configSrcPath = _.get(this.options, 'webpack-config-build-path') || this.templatePath('webpack.config.build.js');
                configDestPath = this.destinationPath(path.join(buildPath, 'webpack.config.build.js'));
                this.fs.copyTpl(configSrcPath, configDestPath, templateData);
            }

            if(this.options.browsersync && _.get(this.options, 'webpack-config-browsersync'))
            {
                configSrcPath = _.get(this.options, 'webpack-config-browsersync-path') || this.templatePath('webpack.config.browsersync.js');
                configDestPath = this.destinationPath(path.join(buildPath, 'webpack.config.browsersync.js'));
                this.fs.copyTpl(configSrcPath, configDestPath, templateData);
            }
        },

        packageJSONScripts: function()
        {
            var projectPath = _.get(this.options, 'project-path');
            var buildPath = _.get(this.options, 'path');
            var tmpPath = _.get(this.options, 'tmp-path');
            var srcPath = _.get(this.options, 'src-path');
            var destPath = _.get(this.options, 'dest-path');

            var scripts = {
                'clean:tmp': 'rm -rf '+tmpPath,
                'clean': 'npm run clean:tmp',
                'mkdir:tmp': 'mkdir -p '+tmpPath,
                'mkdir': 'npm run mkdir:tmp'
            };

            var scriptsServerPrepare = [];
            var scriptsWatch = [];
            var scriptsBuild = [
                'npm run build:files'
            ];
            var scriptsBuildFiles = [
                'npm run clean && npm run mkdir'
            ];

            if(_.get(this.options, 'clean-dest'))
            {
                scripts = _.extend(scripts, {
                    'mkdir:dist': 'mkdir -p '+destPath,
                    'clean:dist': 'rm -rf '+destPath
                });

                scripts.mkdir += ' && npm run mkdir:dist';
                scripts.clean += ' && npm run clean:dist';
            }

            if (_.get(this.options, 'browsersync')) {
                scriptsServerPrepare.push('npm run clean:tmp');
                scriptsServerPrepare.push('npm run mkdir:tmp');
            } else if (_.get(this.options, 'watch')) {
                scriptsWatch.push('npm run clean:tmp');
                scriptsWatch.push('npm run mkdir:tmp');
            }

            if(_.get(this.options, 'copy'))
            {
                var copyPath = _.get(this.options, 'copy-path', []);
                var copyScripts = _.map(_.isArray(copyPath) ? copyPath:[copyPath], function(path)
                {
                    return 'cp -v '+path+' dist/ 2>/dev/null || :';
                });
                scripts = _.extend(scripts, {
                    'copy:dist': copyScripts.join(' && '),
                    'copy': 'npm run copy:dist'
                });

                scriptsBuildFiles.push('npm run copy');
            }

            if(_.get(this.options, 'browsersync'))
            {
                var browserSyncPath = path.join(buildPath, 'browsersync.js');
                scripts = _.extend(scripts, {
                    'browsersync': 'node '+browserSyncPath,
                    'server:prepare': 'echo "Preparing server..."',
                    'server': 'npm run server:prepare && concurrently "npm run watch" "npm run browsersync"',
                    'start': 'npm run server'
                });
            }

            if(_.get(this.options, 'modernizr'))
            {
                var modernizrPath = path.join(buildPath, 'modernizr.js');
                scripts = _.extend(scripts, {
                    'modernizr:dist': 'node '+modernizrPath+' --prod',
                    'modernizr:server': 'node '+modernizrPath,
                    'modernizr': 'npm run modernizr:dist',
                    'build:modernizr': 'npm run modernizr:dist',
                });

                if (_.get(this.options, 'browsersync')) {
                    scriptsServerPrepare.push('npm run modernizr:server');
                } else if (_.get(this.options, 'watch')) {
                    scriptsWatch.push('npm run sass:dist');
                }
                scriptsBuild.push('npm run build:modernizr');
            }

            if(_.get(this.options, 'images'))
            {
                var imagesPath = _.get(this.options, 'images-path', 'img');
                var imagesSrcPath = _.get(this.options, 'images-src-path', null) || path.join(srcPath, imagesPath, '**/*.{jpg,png,jpeg,gif,svg}');
                var imagesDestPath = _.get(this.options, 'images-dest-path', null) || path.join(destPath, imagesPath);
                scripts = _.extend(scripts, {
                    'imagemin:dist': 'imagemin '+imagesSrcPath+' --out-dir='+imagesDestPath,
                    'imagemin': 'npm run imagemin:dist',
                    'build:images': 'npm run imagemin:dist',
                });
                scriptsBuild.push('npm run build:images');
            }

            if(_.get(this.options, 'scss'))
            {
                var postcssConfigFile = path.join(buildPath, 'postcss.js');
                var scssPath = _.get(this.options, 'scss-path', 'scss');
                var cssPath = _.get(this.options, 'css-path', 'css');
                var scssSrcPath = _.get(this.options, 'scss-src-path', null) || path.join(srcPath, scssPath);
                var scssTmpPath = _.get(this.options, 'scss-tmp-path', null) || path.join(tmpPath, cssPath);
                var scssDestPath = _.get(this.options, 'scss-dest-path', null) || path.join(destPath, cssPath);
                scripts = _.extend(scripts, {
                    'postcss:dist': 'postcss -c '+postcssConfigFile+' -u autoprefixer -u cssnano -d '+scssDestPath+' '+path.join(scssTmpPath, '/**/*.css'),
                    'postcss': 'npm run postcss:dist',
                    'sass:dist': 'node-sass -r '+scssSrcPath+' --output '+scssTmpPath,
                    'sass:watch': 'node-sass -r --watch '+scssSrcPath+' --output '+scssTmpPath,
                    'styles:dist': 'npm run sass:dist && npm run postcss:dist',
                    'styles:watch': 'npm run sass:watch',
                    'styles': 'npm run styles:dist',
                    'watch:styles': 'npm run styles:watch',
                    'build:styles': 'npm run styles'
                });

                if (_.get(this.options, 'browsersync')) {
                    scriptsServerPrepare.push('npm run sass:dist');
                } else if (_.get(this.options, 'watch')) {
                    scriptsWatch.push('npm run sass:dist');
                }
                if (_.get(this.options, 'watch')) {
                    scriptsWatch.push('npm run watch:styles');
                }

                scriptsBuild.push('npm run build:styles');
            }

            if(_.get(this.options, 'js'))
            {
                var webpackConfigFile = path.join(buildPath, 'webpack.config.build.js');
                var jsPath = _.get(this.options, 'js-path', 'js');
                var jsSrcPath = _.get(this.options, 'js-src-path', null) || path.join(srcPath, jsPath);
                scripts = _.extend(scripts, {
                    'jshint:dist': 'jshint '+path.join(jsSrcPath, '/**.js'),
                    'jshint': 'npm run jshint:dist',
                    'jscs': 'jscs '+path.join(jsSrcPath, '/**.js'),
                    'webpack:dist': 'webpack --config '+webpackConfigFile,
                    'webpack': 'npm run webpack:dist',
                    'scripts:dist': 'npm run webpack:dist',
                    'scripts': 'npm run scripts:dist',
                    'build:js': 'npm run jshint && npm run scripts'
                });
                scriptsBuild.push('npm run build:js');
            }

            scriptsBuild.push('npm run clean:tmp');

            if (scriptsServerPrepare.length) {
                scripts['server:prepare'] = scriptsServerPrepare.join(' && ');
            }

            if (scriptsWatch.length) {
                scripts.watch = scriptsWatch.join(' && ');
            }

            if (scriptsBuild.length) {
                scripts.build = scriptsBuild.join(' && ');
            }

            if (scriptsBuildFiles.length) {
                scripts['build:files'] = scriptsBuildFiles.join(' && ');
            }

            var packagePath = this.destinationPath(path.join(projectPath, 'package.json'));
            this.fs.extendJSON(packagePath, {
                scripts: scripts
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
                'autoprefixer@latest',
                'babel-core@latest',
                'babel-loader@latest',
                'babel-plugin-transform-class-properties@latest',
                'babel-preset-es2015@latest',
                'babel-preset-react@latest',
                'babel-preset-stage-0@latest',
                'brfs@latest',
                'browser-sync@latest',
                'bs-fullscreen-message@latest',
                'concurrently@latest',
                'commander@latest',
                'css-loader@latest',
                'cssnano@latest',
                'customizr@latest',
                'expose-loader@latest',
                'html-loader@latest',
                'imagemin-cli@latest',
                'imports-loader@latest',
                'json-loader@latest',
                'node-sass@latest',
                'postcss-cli@latest',
                'proxy-middleware@latest',
                'raw-loader@latest',
                'transform-loader@latest',
                'sass-loader@latest',
                'serve-static@latest',
                'strip-ansi@latest',
                'style-loader@latest',
                'svg-react-loader@latest',
                'webpack@latest',
                'webpack-dev-middleware@latest',
            ], {
                'saveDev': true
            });
        },

        sass: function()
        {
            if(this.options['skip-install'])
            {
                return;
            }

            this.spawnCommand('gem', ['install', 'sass']);
        }
    }

});
