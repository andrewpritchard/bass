/*//////////////////////////////////////////////////////////////////////////////
// Browsersync setup
//////////////////////////////////////////////////////////////////////////////*/

'use strict';

// Pattern for getting arguments from the gulpfile into an external file [https://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module/#13163075]
module.exports = function(gulp, plugins) {
    // Loads the plugin following the scheme of other setup files, needed since the prefix is ignored by 'gulp-load-plugins' & creates a Browsersync instance [https://github.com/gulpjs/gulp/blob/master/docs/recipes/minimal-browsersync-setup-with-gulp4.md#step-4-bring-it-all-together]
    plugins.browserSync = require('browser-sync').create();
    // Gets the user home directory [https://nodejs.org/api/os.html#os_os_homedir]
    plugins.homeDir = require('os').homedir();
    // Helper function to check if the home directory is needed
    function home_dir(path, use) {
        if(use) {
            return plugins.homeDir + path;
        } else {
            return path;
        }
    }
    // Loads a file from the this folder with an array of configs
    let browserSyncTasks = require('./browser-sync.json');
    // Loops the plugin task objects, allows a developer to quickly add new tasks from the config file [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
    for (const key in browserSyncTasks) {
        // Stores this iteration's options
        let config = browserSyncTasks[key];

        // Attaches each task to its title [https://stackoverflow.com/questions/29885220/using-objects-in-for-of-loops/#29885220]
        module[key] = function(cb) {
            plugins.browserSync.init({
                    // List of options [https://www.browsersync.io/docs/options], how to use a URL instead of a proxy [https://stackoverflow.com/questions/27755206/using-the-original-url-not-proxy-with-browser-sync/32037122/#answer-35822444] & using/ creating a self-signed certificate [https://blogjunkie.net/2017/04/enable-https-localhost-browsersync/]
                    ui: config.options.ui,
                    files: config.options.files,
                    watchEvents: config.options.watchEvents,
                    watch: config.options.watch,
                    ignore: config.options.ignore,
                    single: config.options.single,
                    watchOptions: config.options.watchOptions,
                    server: config.options.server,
                    proxy: config.options.proxy,
                    port: config.options.port,
                    middleware: config.options.middleware,
                    serveStatic: config.options.serveStatic,
                    serveStaticOptions: config.options.serveStaticOptions,
                    https: {
                        key: home_dir(config.options.https.key, config.options.https.useHomeDirectory),
                        cert: home_dir(config.options.https.cert, config.options.https.useHomeDirectory)
                    },
                    httpModule: config.options.httpModule,
                    cwd: config.options.cwd,
                    callbacks: config.options.callbacks,
                    ghostMode: config.options.ghostMode,
                    logLevel: config.options.logLevel,
                    logPrefix: config.options.logPrefix,
                    logConnections: config.options.logConnections,
                    logFileChanges: config.options.logFileChanges,
                    logSnippet: config.options.logSnippet,
                    snippetOptions: config.options.snippetOptions,
                    rewriteRules: config.options.rewriteRules,
                    tunnel: config.options.tunnel,
                    online: config.options.online,
                    open: config.options.open,
                    browser: config.options.browser,
                    cors: config.options.cors,
                    xip: config.options.xip,
                    reloadOnRestart: config.options.reloadOnRestart,
                    notify: config.options.notify,
                    scrollProportionally: config.options.scrollProportionally,
                    scrollThrottle: config.options.scrollThrottle,
                    scrollRestoreTechnique: config.options.scrollRestoreTechnique,
                    scrollElements: config.options.scrollElements,
                    scrollElementMapping: config.options.scrollElementMapping,
                    reloadDelay: config.options.reloadDelay,
                    reloadDebounce: config.options.reloadDebounce,
                    reloadThrottle: config.options.reloadThrottle,
                    plugins: config.options.plugins,
                    injectChanges: config.options.injectChanges,
                    startPath: config.options.startPath,
                    minify: config.options.minify,
                    host: config.options.host,
                    localOnly: config.options.localOnly,
                    codeSync: config.options.codeSync,
                    timestamps: config.options.timestamps,
                    scriptPath: config.options.scriptPath,
                    socket: config.options.socket,
                    script: config.options.script
                });
            // Tells gulp it's done
            return cb();
        };
        // Stops the task functions being named '<anonymous>' in Node [https://medium.com/shopback-engineering/https-medium-com-shopback-engineering-construct-gulp-series-tasks-dynamically-db744b923229]
        module[key].displayName = key;

        // Creates a subtask that allows the browser to be reloaded when called
        module[key].reload = function(cb) {
            plugins.browserSync.reload();
            return cb();
        };
        module[key].reload.displayName = key;
    };
    // Sends each looped task to the gulpfile
    return module;
};