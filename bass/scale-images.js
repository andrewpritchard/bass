/*//////////////////////////////////////////////////////////////////////////////
// Scale-images setup
//////////////////////////////////////////////////////////////////////////////*/

'use strict';

// Pattern for getting arguments from the gulpfile into an external file [https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module/#13163075]
module.exports = function(gulp, plugins) {
    // Adds a plugin that allows multiple variant sizes [https://github.com/derhuerst/gulp-scale-images#usage]
    plugins.flatMap = require('flat-map').default;
    // Loads a file from the this folder with an array of configs
    let scaleImagesTasks = require('./scale-images.json');
    // Loops the plugin task objects, allows a developer to quickly add new tasks from the config file [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
    for (const key in scaleImagesTasks) {
        // Stores this iteration's options
        let config = scaleImagesTasks[key];

        // Attaches each task to its title [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
        module[key] = function(cb) {
            return gulp.src(config.src)
                // This will only get file(s) that have changed since the last time it was ran
                .pipe(plugins.changed(config.dest))
                .pipe(plugins.flatMap(function(file, cb) {
                    let sizes = [];
                    // Defines the output for each size by grabbing the settings from the nested arrays
                    for (const out in config.options) {
                        sizes[out] = file.clone();
                        sizes[out].scale = config.options[out];
                    }
                    // Shows the whole array without including the keys [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values]
                    cb(null, Object.values(sizes));
                }))
                // List of options [https://github.com/sass/node-sass#outputstyle]
                .pipe(plugins.scaleImages())
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