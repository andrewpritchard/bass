// [https://nodejs.org/api/modules.html#modules_require_id]
const package = require('./package.json');

// [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys]
let dependencies = Object.keys(package.devDependencies);

// [https://coderwall.com/p/kvzbpa/don-t-use-array-foreach-use-for-instead]
for (i = 0,
    len = dependencies.length;
i < len;
i++) {
    if(dependencies[i] != 'node-sass') {
        // [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Using_an_inline_function_that_modifies_the_matched_characters]
        eval(dependencies[i].replace(/gulp-/g, '') + ' = require(\'' + dependencies[i] + '\')');
    };
};

//
const { series } = require('gulp');

//
sass.compiler = require('node-sass');

//
const sassConfiguration = {
  "task": "sass_default",
  "src": "./default.scss",
  "options": {
    "outputStyle": "nested",
    "precision": 5,
    "sourceComments": false
  },
  "dest": "./css"
};

// [https://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript/#answer-5905508] [https://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript/#answer-6247331]
eval(sassConfiguration.task + ' = function(cb) {' +
    'return gulp.src(\'' + sassConfiguration.src + '\')' +
        '.pipe(sass({' +
            // [https://github.com/sass/node-sass#outputstyle]
            'outputStyle: \'' + sassConfiguration.options.outputStyle + '\',' +
            'precision: ' + sassConfiguration.options.precision + ',' +
            'sourceComments: ' + sassConfiguration.options.sourceComments +
        '}).on(\'error\', sass.logError))' +
        '.pipe(gulp.dest(\'' + sassConfiguration.dest + '\'));' +
    'cb();' +
'};');

//
exports.default = sass_default;