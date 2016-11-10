"use strict";
var gulp = require("gulp");  
var del = require("del");  
var sourcemaps = require('gulp-sourcemaps');
var tsc = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');

/**
 * Remove build directory.
 */
gulp.task('clean', function (cb) {  
    return del(["build"], cb);
});

/**
 * Compile TypeScript sources and create sourcemaps in build directory.
 */
gulp.task("compile", () => {
    var tsResult = gulp.src("client/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsc(tscConfig));
    return tsResult.js
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build/client"));
});
/**
 * Copy all resources that are not TypeScript files into build directory.
 */
gulp.task("resources", ["server", "app", "assets", "express", "compile"], function () {  
    console.log("Building resources...");
});
/* copy the app core files to the build folder */
gulp.task("app", ['index'], function(){  
    return gulp.src(["client/**", "!client/**/*.ts"])
        .pipe(gulp.dest("build/client"));
});
/* get the index file to the root of the build */
gulp.task("index", function(){  
    return gulp.src(["favicon.ico", "systemjs.config.js"])
        .pipe(gulp.dest("build"));
});
/* copy node server to build folder */
gulp.task("server", function () {  
    // return gulp.src(["server.js", "package.json"], { cwd: "server/**" })
    //     .pipe(gulp.dest("build"));
    return gulp.src(["server/**"])
        .pipe(gulp.dest("build/server"));
});
/* copy node server to build folder */
gulp.task("express", function () {  
    return gulp.src(["server.js", "package.json", "web.config"])
        .pipe(gulp.dest("build"));
});
/* styles and other assets */
gulp.task("assets", function(){  
    return gulp.src(["styles.css"])
        .pipe(gulp.dest("build"));
});
/**
 * Copy all required libraries into build directory.
 */
gulp.task("libs", () => {  
    console.log('Copy libs.');
    return gulp.src([
        //'es6-shim/es6-shim.min.js',
        'systemjs/dist/system-polyfills.js',
        'core-js/client/shim.min.js ',
        'zone.js/dist/zone.js',
        'systemjs/dist/system.src.js',
        'reflect-metadata/Reflect.js ',
        'rxjs/**/*.js',
        //'@angular/bundles/angular2-polyfills.js',
        //'@angular/es6/dev/src/testing/shims_for_IE.js',
        '@angular/core/bundles/core.umd.js',
        '@angular/common/bundles/common.umd.js',
        '@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',   
        '@angular/platform-browser/bundles/platform-browser.umd.js',     
        '@angular/forms/bundles/forms.umd.js',
        '@angular/compiler/bundles/compiler.umd.js',
        '@angular/bundles/router.dev.js',
        //server
        'express/**',
        'compression/**',
        'path/**',
        'morgan/**',
        'cookie-parser/**',
        'express-session/**',
        'connect-mongo/**'
    ], { cwd: "node_modules/**" }) /* Glob required here. */
        .pipe(gulp.dest("build/node_modules"));
});
/**
 * Build the project.
 */
gulp.task("build", ['resources', 'libs'], () => {  
    console.log("Building the project ...");
});

gulp.task("default", ['resources', 'libs'], () => {  
    console.log("Building the project ...");
});