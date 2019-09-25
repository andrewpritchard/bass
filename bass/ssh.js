/*//////////////////////////////////////////////////////////////////////////////
// SSH setup
//////////////////////////////////////////////////////////////////////////////*/

'use strict';

// Pattern for getting arguments from the gulpfile into an external file [https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module/#13163075]
module.exports = function(gulp, plugins) {
    // Brings in the ability to read key files
    plugins.fs = require('fs');
    // Prints out the home directory
    plugins.homeDir = require('os').homedir();
    // Helper which tests for different key configurations & outputs the result
    function key_test(path, home, key) {
        // Recommended to use 'let' instead of 'var' to avoid scope issues [https://medium.com/podiihq/javascript-variables-should-you-use-let-var-or-const-394f7645c88f#ec5a]
        let construct_path = path;
        // Stops errors if the value returns falsy [https://developer.mozilla.org/en-US/docs/Glossary/Falsy]
        if(path === false) {
            // Checks for JSON
            const is_json = path.includes('.json');
            // Is the location under home?
            if(home && path === false) {
                construct_path = plugins.homeDir + path;
                if(is_json) {
                    // Loads the JSON file & retrieves the value associated with the key
                    construct_path = plugins.homeDir + require(construct_path)[key];
                };
            } else if(is_json) {
                // Relative reference means the 'bass' folder needs to be removed to get to the gulpfile root
                construct_path = '.' + require(__dirname.replace('/bass', '') + construct_path)[key];
            };
            // Reads the key file
            return plugins.fs.readFileSync(construct_path);
        } else {
            return path;
        };
    };
    // Loads a file from the this folder with an array of configs
    let sshTasks = require('./ssh.json');
    // Loops the plugin task objects, allows a developer to quickly add new tasks from the config file [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
    for (const key in sshTasks) {
        // Stores this iteration's options
        let config = sshTasks[key];
        // Connection details for the secure server
        const connect = new plugins.ssh({
            sshConfig: {
                // Client options [https://github.com/mscdex/ssh2#client-methods]
                host: config.connection.host,
                port: config.connection.port,
                username: key_test(config.connection.username, config.connection.useHomeDirectory, 'username'),
                password: config.connection.password,
                privateKey: key_test(config.connection.privateKey, config.connection.useHomeDirectory, 'privateKey'),
                useAgent: config.connection.useAgent,
                passphrase: config.connection.passphrase
            },
            ignoreErrors: false
        });

        // Attaches each task to its title [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
        module[key] = function(cb) {
            // gulp syntax is slightly different depending on the command
            if (config.command == 'read') {
                return connect.sftp(config.command, config.src, {
                        // List of options [https://github.com/teambition/gulp-ssh#gulpsshsftpcommand-filepath-options]
                        filePath: config.options.filePath,
                        autoExit: config.options.autoExit
                    })
                    .pipe(gulp.dest(config.dest));
            } else {
                return gulp.src(config.src)
                    .pipe(connect.sftp(config.command, config.dest, {
                        // List of options [https://github.com/teambition/gulp-ssh#gulpsshsftpcommand-filepath-options]
                        filePath: config.options.filePath,
                        autoExit: config.options.autoExit
                    }));
            };
            // Tells gulp it's done
            cb();
        };
        // Stops the task functions being named '<anonymous>' in Node [https://medium.com/shopback-engineering/https-medium-com-shopback-engineering-construct-gulp-series-tasks-dynamically-db744b923229]
        module[key].displayName = key;
    };
    // Sends each looped task to the gulpfile
    return module;
};