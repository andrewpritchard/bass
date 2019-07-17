'use strict';

// https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module/#13163075
module.exports = function(gulp, plugins) {
    // [https://github.com/dlmanning/gulp-sass#basic-usage]
    plugins.sass.compiler = require('node-sass');

    let sassTasks = require('./sass.json');

    //https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220
    for (const key in sassTasks) {
        let config = sassTasks[key];

        module[key] = function(cb) {
            return gulp.src(config.src)
                .pipe(plugins.sass({
                    // [https://github.com/saƒss/node-sass#outputstyle]
                    outputStyle: config.options.outputStyle,
                    precision: config.options.precision,
                    sourceComments: config.options.sourceComments
                }).on('error', plugins.sass.logError))
                .pipe(gulp.dest(config.dest));

            cb();
        };

        // https://medium.com/shopback-engineering/https-medium-com-shopback-engineering-construct-gulp-series-tasks-dynamically-db744b923229
        module[key].displayName = key;
    };

    return module;
};
