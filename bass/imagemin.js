/*//////////////////////////////////////////////////////////////////////////////
// Imagemin setup
//////////////////////////////////////////////////////////////////////////////*/

'use strict';

// Pattern for getting arguments from the gulpfile into an external file [https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module/#13163075]
module.exports = function(gulp, plugins) {
    // Loads a file from the this folder with an array of configs
    let imageminTasks = require('./imagemin.json');
    // Loops the plugin task objects, allows a developer to quickly add new tasks from the config file [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
    for (const key in imageminTasks) {
        // Stores this iteration's options
        let config = imageminTasks[key];

        // Attaches each task to its title [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
        module[key] = function(cb) {
            return gulp.src(config.src)
                // This will only get file(s) that have changed since the last time it was ran
                .pipe(plugins.changed(config.dest))
                .pipe(plugins.imagemin([
                    plugins.imagemin.gifsicle({
                        // Plugin options [https://github.com/imagemin/imagemin-gifsicle#options]
                        interlaced: config.gifsicle.options.interlaced,
                        optimizationLevel: config.gifsicle.options.optimizationLevel
                    }),
                    plugins.imagemin.jpegtran({
                        // Plugin options [https://github.com/imagemin/imagemin-jpegtran#options]
                        progressive: config.jpegtran.options.progressive,
                        arithmetic: config.jpegtran.options.arithmetic
                    }),
                    plugins.imagemin.optipng({
                        // Plugin options [https://github.com/imagemin/imagemin-optipng#options]
                        optimizationLevel: config.optipng.options.optimizationLevel,
                        bitDepthReduction: config.optipng.options.bitDepthReduction,
                        colorTypeReduction: config.optipng.options.colorTypeReduction,
                        paletteReduction: config.optipng.options.paletteReduction
                    })
                ], {
                    // List of options [https://github.com/sindresorhus/gulp-imagemin#options]
                    verbose: false
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