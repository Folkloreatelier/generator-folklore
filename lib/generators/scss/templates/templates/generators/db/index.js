'use strict';

var Generator = require('../../lib/generator');
var _ = require('lodash');
var path = require('path');
var colors = require('colors');
var mysql = require('mysql');
var createMySQLClient = require('../../lib/mysql');

module.exports = Generator.extend({

    // The name `constructor` is important here
    constructor: function constructor() {
        Generator.apply(this, arguments);

        this.argument('database_name', {
            type: String,
            required: false
        });

        this.option('user', {
            type: String
        });

        this.option('password', {
            type: String
        });

        this.option('skip-user', {
            type: Boolean,
            defaults: false
        });

        this.option('mysql-reset', {
            type: Boolean,
            defaults: false
        });

        this.option('mysql-host', {
            type: String
        });

        this.option('mysql-user', {
            type: String
        });

        this.option('mysql-password', {
            type: String
        });

        this.mysql = null;

        this.on('end', function () {
            if (this.mysql) {
                this.mysql.end();
                this.mysql = null;
            }
        });
    },

    initializing: function initializing() {
        var configOptions = {
            mysql_host: _.get(this.options, 'mysql-host'),
            mysql_user: _.get(this.options, 'mysql-user'),
            mysql_password: _.get(this.options, 'mysql-password')
        };
        var force = _.get(this.options, 'mysql-reset');
        this.config = this.updateConfig(configOptions, force);
    },

    prompting: {

        welcome: function welcome() {
            if (this.options.quiet) {
                return;
            }

            console.log('\n----------------------'.yellow);
            console.log('Database Generator');
            console.log('----------------------\n'.yellow);
        },

        prompts: function prompts() {
            var prompts = [];

            if (!this.database_name) {
                prompts.push({
                    type: 'input',
                    name: 'database_name',
                    message: 'Name of the database:'
                });
            }

            if (!this.config.mysql_host) {
                prompts.push({
                    type: 'input',
                    name: 'mysql_host',
                    message: 'MySQL Server host:',
                    default: 'localhost'
                });
            }

            if (!this.config.mysql_user) {
                prompts.push({
                    type: 'input',
                    name: 'mysql_user',
                    message: 'MySQL Server user:',
                    default: 'root'
                });
            }

            if (!this.config.mysql_password) {
                prompts.push({
                    type: 'input',
                    name: 'mysql_password',
                    message: 'MySQL Server password:',
                    default: 'root'
                });
            }

            if (!prompts.length) {
                return;
            }

            return this.prompt(prompts).then(function (answers) {
                var configPrompt = _.pick(answers, ['mysql_host', 'mysql_user', 'mysql_password']);
                this.config = this.updateConfig(configPrompt);

                if (answers.database_name) {
                    this.database_name = answers.database_name;
                }
            }.bind(this));
        }
    },

    configuring: function configuring() {
        var config = this.getConfig();

        this.mysql = mysql.createConnection({
            host: config.mysql_host,
            user: config.mysql_user,
            password: config.mysql_password
        });
        this.mysqlClient = createMySQLClient(this.mysql);

        this.mysql.connect();
    },

    writing: {
        createDatabase: function createDatabase() {
            var done = this.async();
            this.mysqlClient.createDatabase(this.database_name).then(function () {
                console.log('Database created: '.green + this.database_name);
                done();
            }.bind(this), function (err) {
                return done(err);
            });
        },

        createUser: function createUser() {
            if (this.options['skip-user']) {
                return;
            }

            var done = this.async();
            var user = _.get(this.options, 'user') || this.database_name;
            var password = _.get(this.options, 'password') || this._getPassword();
            this.mysqlClient.createDatabaseUser(this.database_name, user, password).then(function () {
                console.log('Database user created: '.green + user);
                return done();
            }, function (err) {
                return done(err);
            });
        }
    },

    _getPassword: function _getPassword() {
        return 'password';
    }

});