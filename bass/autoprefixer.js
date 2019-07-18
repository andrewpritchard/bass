/*//////////////////////////////////////////////////////////////////////////////
// Autoprefixer setup
//////////////////////////////////////////////////////////////////////////////*/

'use strict';

// Pattern for getting arguments from the gulpfile into an external file [https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module/#13163075]
module.exports = function(gulp, plugins) {
    // Loads a file from the this folder with an array of configs
    let autoprefixerTasks = require('./autoprefixer.json');
    // Loops the plugin task objects, allows a developer to quickly add new tasks from the config file [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
    for (const key in autoprefixerTasks) {
        // Stores this iteration's options
        let config = autoprefixerTasks[key];

        // Attaches each task to its title [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
        module[key] = function(cb) {
            return gulp.src(config.src)
                .pipe(plugins.autoprefixer({
                    // List of options [https://github.com/postcss/autoprefixer#options]
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
            // Tells gulp it's done
            cb();
        };
        // Stops the task functions being named '<anonymous>' in Node [https://medium.com/shopback-engineering/https-medium-com-shopback-engineering-construct-gulp-series-tasks-dynamically-db744b923229]
        module[key].displayName = key;
    };
    // Sends each looped task to the gulpfile
    return module;
};