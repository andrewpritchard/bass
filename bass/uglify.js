/*//////////////////////////////////////////////////////////////////////////////
// Uglify setup
//////////////////////////////////////////////////////////////////////////////*/

'use strict';

// Pattern for getting arguments from the gulpfile into an external file [https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module/#13163075]
module.exports = function(gulp, plugins) {
    // Handles error conditions with Node streams [https://github.com/terinjokes/gulp-uglify#usage]
    plugins.pipeline = require('readable-stream').pipeline;
    // Loads a file from the this folder with an array of configs
    let uglifyTasks = require('./uglify.json');
    // The documentation specifies the 'output' option's default value as 'null', but this creates an error - this helper allows the default value to work
    function null_check(option) {
        if(option == null) {
            return {};
        }
    };
    // Loops the plugin task objects, allows a developer to quickly add new tasks from the config file [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
    for (const key in uglifyTasks) {
        // Stores this iteration's options
        let config = uglifyTasks[key];

        // Attaches each task to its title [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
        module[key] = function(cb) {
            return plugins.pipeline(
                gulp.src(config.src),
                plugins.uglify({
                    // List of options [https://github.com/mishoo/UglifyJS2#minify-options]
                    warnings: config.options.warnings,
                    parse: config.options.parse,
                    compress: config.options.compress,
                    mangle: config.options.mangle,
                    output: null_check(config.options.output),
                    toplevel: config.options.toplevel,
                    ie8: config.options.ie8,
                    keep_fnames: config.options.keep_fnames
                }),
                gulp.dest(config.dest));
            // Tells gulp it's done
            cb();
        };
        // Stops the task functions being named '<anonymous>' in Node [https://medium.com/shopback-engineering/https-medium-com-shopback-engineering-construct-gulp-series-tasks-dynamically-db744b923229]
        module[key].displayName = key;
    };
    // Sends each looped task to the gulpfile
    return module;
};