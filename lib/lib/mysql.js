'use strict';

module.exports = function (connection) {
    var Mysql = {
        createDatabase: function createDatabase(name) {
            return new Promise(function (resolve, reject) {
                connection.query('CREATE DATABASE IF NOT EXISTS ' + name + ';', function (err, rows) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(rows);
                });
            });
        },
        createUser: function createUser(user, password) {
            return new Promise(function (resolve, reject) {
                connection.query('CREATE USER "' + user + '"@"localhost" IDENTIFIED BY "' + password + '"', function (err, rows) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(rows);
                });
            });
        },
        createDatabaseUser: function createDatabaseUser(database, user, password) {
            return new Promise(function (resolve, reject) {
                connection.query('GRANT ALL ON `' + database + '`.* TO "' + user + '"@"localhost" IDENTIFIED BY "' + password + '"', function (err, rows) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(rows);
                });
            });
        },
        grantPrivileges: function grantPrivileges(user, database) {
            return new Promise(function (resolve, reject) {
                var newDatabase = database;
                if (typeof database !== 'undefined' && database && database.length) {
                    newDatabase += '.*';
                } else {
                    newDatabase = '*.*';
                }
                connection.query('GRANT ALL PRIVILEGES ON ' + newDatabase + ' TO "' + user + '"@"localhost" WITH GRANT OPTION', function (err, rows) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(rows);
                });
            });
        }
    };

    return Mysql;
};