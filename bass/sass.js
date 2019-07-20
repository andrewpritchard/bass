/*//////////////////////////////////////////////////////////////////////////////
// Sass setup
//////////////////////////////////////////////////////////////////////////////*/

'use strict';

// Pattern for getting arguments from the gulpfile into an external file [https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module/#13163075]
module.exports = function(gulp, plugins) {
    // Future-proofing the default compiler [https://github.com/dlmanning/gulp-sass#basic-usage]
    plugins.sass.compiler = require('node-sass');
    // Loads a file from the this folder with an array of configs
    let sassTasks = require('./sass.json');
    // Loops the plugin task objects, allows a developer to quickly add new tasks from the config file [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
    for (const key in sassTasks) {
        // Stores this iteration's options
        let config = sassTasks[key];

        // Attaches each task to its title [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
        module[key] = function(cb) {
            return gulp.src(config.src)
                .pipe(plugins.sass({
                    // List of options [https://github.com/sass/node-sass#outputstyle]
                    outputStyle: config.options.outputStyle,
                    precision: config.options.precision,
                    sourceComments: config.options.sourceComments
                }).on('error', plugins.sass.logError))
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