'use strict';

// https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module/#13163075
module.exports = function(gulp, plugins) {
    plugins.notifier = require('node-notifier');

    let notifierTasks = require('./notifier.json');

    //https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220
    for (const key in notifierTasks) {
        let config = notifierTasks[key];

        module[key] = function(cb) {
            plugins.notifier.notify({
                    title: config.title,
                    message: config.message
                });

            return cb();
        };

        // https://medium.com/shopback-engineering/https-medium-com-shopback-engineering-construct-gulp-series-tasks-dynamically-db744b923229
        module[key].displayName = key;
    };

    return module;
};
