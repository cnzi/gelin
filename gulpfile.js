"use strict";

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    i18n = require('gulp-html-i18n'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    htmlreplace = require('gulp-html-replace'),
    cssmin = require('gulp-cssmin');

gulp.task("concatScripts", ["js"], function () {
    return gulp.src([
        'assets/js/vendor/jquery-3.2.1.slim.min.js',
        'assets/js/vendor/popper.min.js',
        'assets/js/vendor/bootstrap.min.js',
        'assets/js/functions.js'
    ])
        .pipe(maps.init())
        .pipe(concat('main.js'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('static/assets/js'))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    return gulp.src("assets/js/page/*.js")
        .pipe(gulp.dest('static/assets/js/page/'));
});

gulp.task("minifyScripts", ["concatScripts"], function () {
    return gulp.src(["static/assets/js/*.js", "static/assets/js/page/*.js"])
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.extname = '.min.js';
        }))
        .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('compileSass', function () {
    return gulp.src(["assets/css/main.scss", "assets/css/page/*.scss"])
        .pipe(maps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(maps.write('./'))
        .pipe(gulp.dest('static/assets/css'))
        .pipe(browserSync.stream());
});

gulp.task("minifyCss", ["compileSass"], function () {
    return gulp.src("static/assets/css/*.css")
        .pipe(cssmin())
        .pipe(rename(function (path) {
            path.extname = '.min.css';
        }))
        .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('watchFiles', function () {
    gulp.watch('assets/css/**/*.scss', ['compileSass']);
    gulp.watch('assets/js/*.js', ['concatScripts']);
})

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('clean', function () {
    del(['dist', 'assets/css/main.css*', 'assets/js/main*.js*']);
});

gulp.task('renameSources', function () {
    return gulp.src('*.html')
        .pipe(htmlreplace({
            'js': 'assets/js/main.min.js',
            'css': 'assets/css/main.min.css'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('statics', function() {
    return gulp.src(['*.html', '*.php', 'favicon.ico',
        "assets/img/**", "assets/fonts/**"], { base: './' })
        .pipe(gulp.dest('static'));
});

gulp.task('build-img', function() {
    return gulp.src(['static/assets/img/*'])
        .pipe(gulp.dest('dist/assets/img'))
});

gulp.task("build", ['minifyScripts', 'minifyCss', 'localize', 'statics', 'build-img'], function () {
    return gulp.src(['static/*.html', 'static/favicon.ico'])
        .pipe(gulp.dest('dist/'));
});

gulp.task('localize', ['compileSass', 'concatScripts'], function () {
    return gulp.src('*.html')
        .pipe(i18n({
            langDir: './lang',
            trace: true,
            delimiters: ['__(',')__']
        }))
        .pipe(gulp.dest('static'));
});

gulp.task('serve', ["statics", 'watchFiles', "localize"], function () {
    browserSync.init({
        server: "./static/"
    });

    gulp.watch("assets/css/**/*.scss", ['watchFiles']);
    gulp.watch("*.html", ['statics']).on('change', browserSync.reload);
});

gulp.task("default", ["clean", 'build'], function () {
    gulp.start('renameSources');
});
