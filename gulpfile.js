// Helps stop sloppy code [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode]
'use strict';

const gulp = require('gulp');
const { parallel, watch, series } = require('gulp');
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
    'flat-map',
    'gulp-changed',
    'readable-stream'
];
const bass = {};
// 'For...in' is not as quick as a normal 'for' loop but still faster than 'forEach' [https://coderwall.com/p/kvzbpa/don-t-use-array-foreach-use-for-instead]
for (const key in dependencies) {
    // Uses the above 'noTask' array & loops through the dependencies [https://stackoverflow.com/questions/18347033/how-to-shorten-my-conditional-statements/#18347047]
    if(!noTasks.includes(dependencies[key])) {
        // Looks for dependencies with the prefix of 'gulp-' or 'node-'
        const req = dependencies[key].replace(/gulp-|node-/g, '');
        let dependency = [];
        // Checks for a certain plugin names & renames them to a better namespace
        if (req == 'scale-images') {
            dependency = 'scaleImagesTasks';
        } else if (req == 'browser-sync') {
            dependency = 'browserSyncTasks';
        } else {
            dependency = req.concat('Tasks');
        };
        // Adds external task files to the 'bass' object & passes on the 'gulp' & 'plugins' constants
        bass[dependency] = require('./bass/' + req + '.js')(gulp, plugins);
    };
};
// Small helper function to allow a single task to be referred to by the preferred shortcut & take a single line
function exports_single(shortcut, task) {
    exports[shortcut] = task;
    exports[shortcut].displayName = shortcut;
};

/*//////////////////////////////////////////////////////////////////////////////
// gulp tasks
//////////////////////////////////////////////////////////////////////////////*/

exports.default = parallel(
    // Starts listening
    bass.browserSyncTasks.browserSync_default,
    // SCSS
    function() {
        watch('./wp-content/themes/Zephyr-child/scss/**/*.scss', {
            ignoreInitial: false
        }, series(bass.sassTasks.sass_default, bass.autoprefixerTasks.autoprefixer_default, bass.cssoTasks.csso_default, bass.sshTasks.ssh_default, bass.browserSyncTasks.browserSync_default.reload, bass.notifierTasks.notifier_watch));
    },
    // JavaScript
    function() {
        watch('./wp-content/themes/Zephyr-child/js/**/*.js', {
            ignoreInitial: false
        }, series(bass.concatTasks.concat_default, bass.uglifyTasks.uglify_default, bass.notifierTasks.notifier_default, bass.sshTasks.ssh_alt, bass.browserSyncTasks.browserSync_default.reload, bass.notifierTasks.notifier_watch));
    }
);
exports.default.description = 'Watches in parallel for any changes to any SCSS or JS file, then builds & uploads the resulting file(s) onto a server via SFTP & refreshes the browser (if the outputted script is installed on the site). Will override the existing CSS/ JS on the server - so use source control to log all changes';

exports.styles = series(bass.sassTasks.sass_default, bass.autoprefixerTasks.autoprefixer_default, bass.cssoTasks.csso_default, bass.notifierTasks.notifier_default);
exports.styles.description = 'Compiles all the SCSS files into a single CSS, adds browser vendor prefixes & optimises the contents';

exports.test = series(bass.sshTasks.ssh_test, bass.notifierTasks.notifier_test);
exports.test.description = 'Tests the SFTP connection by downloading the \'license.txt\' file from the server directory defined in an external JSON array';

exports.resize = series(bass.scaleImagesTasks.scaleImages_default, bass.scaleImagesTasks.scaleImages_slider);
exports.resize.description = 'Looks in the default WordPress uploads directory for the \'resize\' folder & if images are found under the child folder, \'source\' - the images are all resized based on the task settings';

exports_single('compress', bass.imageminTasks.imagemin_default);
exports.compress.description = 'Looks in the default WordPress uploads directory for the \'compress\' folder & if images are found under the child folder, \'source\' - the images are all compressed based on the task settings';

exports.scripts = series(bass.concatTasks.concat_default, bass.uglifyTasks.uglify_default, bass.notifierTasks.notifier_default);
exports.scripts.description = 'Combines JavaScript into a single file & compresses the contents';