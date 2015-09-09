// Karma configuration
// Generated on Thu Aug 27 2015 11:12:23 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-ui-router/build/angular-ui-router.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/firebase/lib/firebase-web.js',
      'node_modules/angularfire/dist/angularfire.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-animate.js',
      'client/**/*.js',
      'client/**/*.html',
      // not sure if we need to specify the folders inside of client
      // listing them just in case
      // may take them out later if unnecessary
      'client/app/createEvent/**/*.js',
      'client/app/createEvent/**/*.html',
      'client/app/event/**/*.js',
      'client/app/event/**/*.html',
      'client/app/home/**/*.js',
      'client/app/home/**/*.html',
      'client/app/authentication/**/*.js',
      'client/app/authentication/**/*.html',
      'client/app/userProfile/**/*.js',
      'client/app/userProfile/**/*.html',
      // test files
      'specs/client/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'client/**/*.html': ['ng-html2js'],
      'client/**/!(*.mock|*.spec).js': ['coverage']
    },


    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-ng-html2js-preprocessor'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
