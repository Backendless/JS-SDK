module.exports = function(config) {
  config.set({
    files: [
      //Emulate a full ES2015 environment
      'node_modules/babel-polyfill/dist/polyfill.js',
      'test/e2e/specs/**/*.js'
    ],

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [/*', Chrome'*/],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 5,

    preprocessors: {
      'test/e2e/**/*.js': ['browserify']
    },

    browserify: {
      debug    : true,
      transform: [
        ['babelify']
      ]
    },

    babelPreprocessor: {
      options: {
        sourceMap: 'inline'
      },
      sourceFileName: function(file) {
        return file.originalPath
      }
    },

    basePath: '../../',

    frameworks: ['browserify', 'mocha']
  })
}