// [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode]
'use strict';

const gulp = require('gulp');
const { series } = require('gulp');
// [https://github.com/jackfranklin/gulp-load-plugins#usage]
const plugins = require('gulp-load-plugins')();
// [https://github.com/dlmanning/gulp-sass#basic-usage]
plugins.sass.compiler = require('node-sass');

// [https://nodejs.org/api/modules.html#modules_require_id]
let dependencies = require('./package.json');
// [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys]
dependencies = Object.keys(dependencies.devDependencies);

let noTasks = [
    'gulp',
    'gulp-load-plugins',
    'gulp-notify',
    'gulp-ssh',
    'node-sass'
];
const bass = {};

// [https://coderwall.com/p/kvzbpa/don-t-use-array-foreach-use-for-instead]
for (const key in dependencies) {
    // [https://stackoverflow.com/questions/18347033/how-to-shorten-my-conditional-statements/#18347047]
    if(!noTasks.includes(dependencies[key])) {
        const req = dependencies[key].replace(/gulp-/g, '');

        bass[req.concat('Tasks')] = require('./bass/' + req + '.js')(gulp, plugins);
    };
};

exports.default = series(bass.sassTasks.sass_default, bass.autoprefixerTasks.autoprefixer_default, bass.cssoTasks.csso_default);