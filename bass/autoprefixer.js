'use strict';

// https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module/#13163075
module.exports = function(gulp, plugins) {
    let autoprefixerTasks = require('./autoprefixer.json');

    //https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220
    for (const key in autoprefixerTasks) {
        let config = autoprefixerTasks[key];

        module[key] = function(cb) {
            return gulp.src(config.src)
                .pipe(plugins.autoprefixer({
                    // [https://github.com/postcss/autoprefixer#options]
                    env: config.options.env,
                    cascade: config.options.cascade,
                    remove: config.options.remove,
                    supports: config.options.supports,
                    flexbox: config.options.flexbox,
                    grid: config.options.grid,
                    overrideBrowserslist: config.options.overrideBrowserslist,
                    ignoreUnknownVersions: config.options.ignoreUnknownVersions
                }))
                .pipe(gulp.dest(config.dest));

            cb();
        };

        // https://medium.com/shopback-engineering/https-medium-com-shopback-engineering-construct-gulp-series-tasks-dynamically-db744b923229
        module[key].displayName = key;
    };

    return module;
};