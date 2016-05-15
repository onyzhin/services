'use strict';

var gulp = require('gulp'),
    updateJson = require('update-json'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var config = {
    server: {
        baseDir: "./" 
    },
    tunnel: false,
    host: 'localhost',
    port: 9080,
    logPrefix: "angular"
};

gulp.task('webserver', function () {
    browserSync(config);
});


gulp.task('default', ['webserver']);