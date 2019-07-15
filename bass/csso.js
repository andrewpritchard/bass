'use strict';

// https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module/#13163075
module.exports = function(gulp, plugins) {
    let cssoTasks = require('./csso.json');

    //https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220
    for (const key in cssoTasks) {
        let config = cssoTasks[key];

        module[key] = function(cb) {
            return gulp.src(config.src)
                .pipe(plugins.csso({
                    // [https://github.com/css/csso#usage-data]
                    restructure: config.options.restructure,
                    debug: config.options.debug,
                    usage: config.options.usage
                }))
                .pipe(gulp.dest(config.dest));

            cb();
        };

        // https://medium.com/shopback-engineering/https-medium-com-shopback-engineering-construct-gulp-series-tasks-dynamically-db744b923229
        module[key].displayName = key;
    };

    return module;
};