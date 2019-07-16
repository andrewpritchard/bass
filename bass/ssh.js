'use strict';

// https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module/#13163075
module.exports = function(gulp, plugins) {
    let sshTasks = require('./ssh.json');

    for (const key in sshTasks) {
        let config = sshTasks[key];

        const connect = new plugins.ssh({
            sshConfig: {
                host: config.connection.host,
                port: config.connection.port,
                username: config.connection.username,
                privateKey: config.connection.privateKey,
                privateKeyFile: config.connection.privateKeyFile,
                useAgent: config.connection.useAgent,
                passphrase: config.connection.passphrase
            },
            ignoreErrors: false
        });

        //https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220
        module[key] = function(cb) {
            return gulp.src(config.src)
                .pipe(connect.sftp(config.command, config.dest, {
                    filePath: config.option.filePath,
                    autoExit: config.option.autoExit
                }));

            cb();
        };

        // https://medium.com/shopback-engineering/https-medium-com-shopback-engineering-construct-gulp-series-tasks-dynamically-db744b923229
        module[key].displayName = key;
    };

    return module;
};