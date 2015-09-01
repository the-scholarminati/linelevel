'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    HTML = require('gulp-minify-html'),
    CSS = require('gulp-minify-css');

var paths = {
  scripts: ['./client/*.js'],
  controllers: ['./client/app/**/*.js'],
  tests: [],
  styles: ['client/css/styles.css'],
  index: ['client/index.html'],
  partials: ['client/app/**/*.html'],
  dest: ['public']
};

gulp.task('lint',function(){
  gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));

  gulp.src(paths.controllers)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch',['lint','HTML','CSS','scripts'],function(){
  gulp.watch(paths.scripts,['lint','scripts','watch']);
  gulp.watch(paths.controllers,['lint','scripts','watch']);
  gulp.watch(paths.index,['HTML','watch']);
  gulp.watch(paths.styles,['CSS','watch']);
  gulp.watch(paths.partials,['HTML','watch']);
});

gulp.task('HTML',function(){
  gulp.src(paths.partials)
    .pipe(HTML())
    .pipe(gulp.dest('public/app'));

  gulp.src(paths.index)
    .pipe(HTML())
    .pipe(gulp.dest('public'));
});

gulp.task('CSS', function(){
  gulp.src(paths.styles)
    .pipe(CSS())
    .pipe(gulp.dest('public/css'));
});

gulp.task('scripts', function(){
  gulp.src(paths.scripts)
    .pipe(uglify({
      mangle:false
    }))
    .pipe(gulp.dest('public'));

  gulp.src(paths.controllers)
    .pipe(uglify({
      mangle:false
    }))
    .pipe(gulp.dest('public/app'))
});

gulp.task('others', function(){
  gulp.src('client/lib/*.js')
    .pipe(gulp.dest('public/lib'));
});

gulp.task('build',['lint','HTML','CSS','scripts','others']);
gulp.task('default',['build','watch']);

