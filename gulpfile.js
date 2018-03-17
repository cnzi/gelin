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
    replace = require('gulp-replace'),
    cssmin = require('gulp-cssmin'),
    htmlPartial = require('gulp-html-partial');

gulp.task("concatScripts", ["js"], function () {
    return gulp.src([
        'assets/js/vendor/jquery-3.3.1.min.js',
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
        .pipe(gulp.dest('static/assets/js/'));
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
    return gulp.src(["assets/css/*.css", "assets/css/main.scss", "assets/css/page/*.scss"])
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
    del(['dist']);
});

// 修改引用的js和css路径为压缩文件
gulp.task('renameSources', function () {
    return gulp.src('static/*.html')
        .pipe(replace(/\/?assets\/css\/(.*)\.css/g, '/assets/css/$1.min.css'))
        .pipe(replace(/\/?assets\/js\/(.*)\.js/g, '/assets/js/$1.min.js'))
        .pipe(gulp.dest('dist/'));
});

// 相关静态文件移动到static文件夹
gulp.task('statics', function() {
    return gulp.src(['favicon.ico',
        "assets/img/*", "assets/img/**/*", "assets/fonts/**"], { base: './' })
        .pipe(gulp.dest('static/'));
});

// 压缩图标到dist，todo: 压缩插件还没配置
gulp.task('build-img', function() {
    return gulp.src(['static/assets/img/*', 'static/assets/img/logo/*'])
        .pipe(gulp.dest('dist/assets/img/'))
});

gulp.task("build", ['minifyScripts', 'minifyCss', 'localize', 'statics', 'build-img'], function () {
    return gulp.src(['static/*.html', 'static/favicon.ico'])
        .pipe(gulp.dest('dist/'));
});

// 国际化生成不同语言html
gulp.task('localize', ['compileSass', 'concatScripts'], function () {
    return gulp.src('*.html')
        .pipe(htmlPartial({
            basePath: 'parts/'
        }))
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
    gulp.watch("*.html", ['statics', 'localize']);
    gulp.watch("static/*.html").on('change', browserSync.reload);
});

gulp.task("default", ['build'], function () {
    gulp.start('renameSources');
});
