// [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode]
'use strict';

const gulp = require('gulp');
const { series } = require('gulp');
// [https://github.com/jackfranklin/gulp-load-plugins#usage]
const plugins = require('gulp-load-plugins')();
// [https://github.com/dlmanning/gulp-sass#basic-usage]
plugins.sass.compiler = require('node-sass');

let sassTasks = require('./bass/sass.json');

//https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220
for (const key in sassTasks) {
    let config = sassTasks[key];

    sassTasks[key] = function() {
        return gulp.src(config.src)
            .pipe(plugins.sass({
                // [https://github.com/sass/node-sass#outputstyle]
                outputStyle: config.options.outputStyle,
                precision: config.options.precision,
                sourceComments: config.options.sourceComments
            }).on('error', plugins.sass.logError))
            .pipe(gulp.dest(config.dest));

        cb();
    };

    sassTasks[key].displayName = key;
};

let autoprefixerTasks = require('./bass/autoprefixer.json');

for (const key in autoprefixerTasks) {
    let config = autoprefixerTasks[key];

    autoprefixerTasks[key] = function() {
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

    autoprefixerTasks[key].displayName = key;
};

let cssoTasks = require('./bass/csso.json');

for (const key in cssoTasks) {
    let config = cssoTasks[key];

    cssoTasks[key] = function() {
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

    cssoTasks[key].displayName = key;
};

exports.default = series(sassTasks.sass_default, autoprefixerTasks.autoprefixer_default, cssoTasks.csso_default);