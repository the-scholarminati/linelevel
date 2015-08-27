'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint');

var paths = {
  scripts: ['./client/*.js','./client/app/*.js', './client/app/**/*.js','./server/*.js', './server/**/*.js'],
  tests: [],
  styles: [],
  index: [],
  partials: []
};

gulp.task('lint',function(){
  gulp.src(paths.scripts)
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('watch',['lint','message'],function(){
  gulp.watch(paths.scripts,['lint','message']);
});

gulp.task('default',['watch']);