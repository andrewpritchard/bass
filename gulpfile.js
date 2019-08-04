// Helps stop sloppy code [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode]
'use strict';

const gulp = require('gulp');
const { series, watch } = require('gulp');
// All gulp plugins are attached to this constant [https://github.com/jackfranklin/gulp-load-plugins#usage]
const plugins = require('gulp-load-plugins')();

// The code below allows for external tasks in the 'bass' folder that are dynamically added to the gulpfile
let dependencies = require('./package.json');
// Grabs only the 'devDependencies' object & simplifies the array with only the property names [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys]
dependencies = Object.keys(dependencies.devDependencies);
// Excludes certain plugins that don't have any configuration files
let noTasks = [
    'gulp',
    'gulp-load-plugins',
    'node-sass',
    'gulp-ssh',
    'flat-map',
    'gulp-changed'
];
const bass = {};
// 'For...in' is not as quick as a normal 'for' loop but still faster than 'forEach' [https://coderwall.com/p/kvzbpa/don-t-use-array-foreach-use-for-instead]
for (const key in dependencies) {
    // Uses the above 'noTask' array & loops through the dependencies [https://stackoverflow.com/questions/18347033/how-to-shorten-my-conditional-statements/#18347047]
    if(!noTasks.includes(dependencies[key])) {
        // Looks for dependencies with the prefix of 'gulp-' or 'node-'
        const req = dependencies[key].replace(/gulp-|node-/g, '');
        let dependency = [];
        // Checks for a certain plugin name & renames it to a better namespace
        if (req == 'scale-images') {
            dependency = 'scaleImagesTasks';
        } else {
            dependency = req.concat('Tasks');
        }
        // Adds external task files to the 'bass' object & passes on the 'gulp' & 'plugins' constants
        bass[dependency] = require('./bass/' + req + '.js')(gulp, plugins);
    };
};

/*//////////////////////////////////////////////////////////////////////////////
// gulp tasks
//////////////////////////////////////////////////////////////////////////////*/

exports.default = series(bass.sassTasks.sass_default, bass.autoprefixerTasks.autoprefixer_default, bass.cssoTasks.csso_default, bass.notifierTasks.notifier_default);
exports.default.description = "The default task that is ran when gulp is initiated";

exports.test = series(bass.sshTasks.ssh_test, bass.notifierTasks.notifier_test);
exports.test.description = "Tests the SFTP connection by downloading the 'license.txt' file from the server directory defined in an external JSON array";

exports.watch = function() {
    watch('./wp-content/themes/Zephyr-child/scss/**/*.scss', {
        ignoreInitial: false
    }, series(bass.sassTasks.sass_default, bass.autoprefixerTasks.autoprefixer_default, bass.cssoTasks.csso_default, bass.sshTasks.ssh_default, bass.notifierTasks.notifier_watch));
};
exports.watch.description = "Watches for any changes to any SCSS file, builds the CSS & uploads the resulting file onto a server via SFTP, will override the existing CSS on the server - so use source control to log all changes";

exports.image = series(bass.scaleImagesTasks.scaleImages_default, bass.imageminTasks.imagemin_default);