'use strict';

// https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module/#13163075
module.exports = function(gulp, plugins) {
    const fs = require('fs');

    let sshTasks = require('./ssh.json');

    for (const key in sshTasks) {
        let config = sshTasks[key];

        const connect = new plugins.ssh({
            sshConfig: {
                host: config.connection.host,
                port: config.connection.port,
                username: config.connection.username,
                privateKey: fs.readFileSync(config.connection.privateKey)
            },
            ignoreErrors: false
        });

        //https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220
        module[key] = function(cb) {
            if (config.command == 'read') {
                return connect.sftp(config.command, config.src, {
                        filePath: config.options.filePath,
                        autoExit: config.options.autoExit
                    }).pipe(gulp.dest(config.dest));
            } else {
                return gulp.src(config.src)
                    .pipe(connect.sftp(config.command, config.dest, {
                        filePath: config.options.filePath,
                        autoExit: config.options.autoExit
                    }));
            };

            cb();
        };

        // https://medium.com/shopback-engineering/https-medium-com-shopback-engineering-construct-gulp-series-tasks-dynamically-db744b923229
        module[key].displayName = key;
    };

    return module;
};
