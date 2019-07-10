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
    sassTasks[key] = function() {
        return gulp.src('./default.scss')
            .pipe(plugins.sass({
                // [https://github.com/sass/node-sass#outputstyle]
                outputStyle: '\' + sassTasks[key].options.outputStyle + \'',
                precision: '\' + sassTasks[key].options.precision + \'',
                sourceComments: '\' + sassTasks[key].options.sourceComments + \''
            }).on('error', plugins.sass.logError))
            .pipe(gulp.dest('./css'));
    };
};

let autoprefixerTasks = require('./bass/autoprefixer.json');

//https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220
for (const key in autoprefixerTasks) {
    autoprefixerTasks[key] = function() {
        return gulp.src('./css/default.css')
            .pipe(plugins.autoprefixer({
                // [https://github.com/postcss/autoprefixer#options]
                env: '\' + autoprefixerTasks[key].options.env + \'',
                cascade: '\' + autoprefixerTasks[key].options.cascade + \'',
                remove: '\' + autoprefixerTasks[key].options.remove + \'',
                supports: '\' + autoprefixerTasks[key].options.supports + \'',
                flexbox: '\' + autoprefixerTasks[key].options.flexbox + \'',
                grid: '\' + autoprefixerTasks[key].options.grid + \'',
                //stats: '\' + autoprefixerTasks[key].options.stats + \'',
                //browsers: '\' + autoprefixerTasks[key].options.browsers + \'',
                ignoreUnknownVersions: '\' + autoprefixerTasks[key].options.ignoreUnknownVersions + \''
            }))
            .pipe(gulp.dest('./css'));
    };
};

let cssoTasks = require('./bass/csso.json');

//https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220
for (const key in cssoTasks) {
    cssoTasks[key] = function() {
        return gulp.src('./css/default.css')
            .pipe(plugins.csso({
                // [https://github.com/css/csso#usage-data]
                restructure: '\' + cssoTasks[key].options.restructure + \'',
                debug: '\' + cssoTasks[key].options.debug + \'',
                usage: '\' + cssoTasks[key].options.usage + \''
            }))
            .pipe(gulp.dest('./css'));
    };
};

exports.default = series(sassTasks.sass_default, autoprefixerTasks.autoprefixer_default, cssoTasks.csso_default);