/*//////////////////////////////////////////////////////////////////////////////
// Notifier setup
//////////////////////////////////////////////////////////////////////////////*/

'use strict';

// Pattern for getting arguments from the gulpfile into an external file [https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module/#13163075]
module.exports = function(gulp, plugins) {
    // Loads the plugin following the scheme of other setup files, needed since the prefix is ignored by 'gulp-load-plugins'
    plugins.notifier = require('node-notifier');
    // Loads a file from the this folder with an array of configs
    let notifierTasks = require('./notifier.json');
    // Loops the plugin task objects, allows a developer to quickly add new tasks from the config file [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
    for (const key in notifierTasks) {
        // Stores this iteration's options
        let config = notifierTasks[key];

        // Attaches each task to its title [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
        module[key] = function(cb) {
            plugins.notifier.notify({
                    // List of options [https://github.com/mikaelbr/node-notifier#cross-platform-advanced-usage]
                    title: config.title,
                    message: config.message
                });
            // Return is necessary to tells gulp it's done
            return cb();
        };
        // Stops the task functions being named '<anonymous>' in Node [https://medium.com/shopback-engineering/https-medium-com-shopback-engineering-construct-gulp-series-tasks-dynamically-db744b923229]
        module[key].displayName = key;
    };
    // Sends each looped task to the gulpfile
    return module;
};