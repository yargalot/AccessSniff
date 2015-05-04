module.exports.tasks = {

  // Clean
  // ------------------------
  clean: {
    tests: ['reports']
  },

  // Babel
  // ------------------------
  babel: {
      options: {
          sourceMap: true
      },
      dist: {
          files: {
              'dist/app.js': 'src/app.js'
          }
      }
  },

  // Uglify
  // ------------------------
  uglify: {
    dev: {
      options: {
        beautify : true,
        mangle: false
      },
      files: {
        'libs/dist/HTMLCS.min.js': [
          'libs/HTML_CodeSniffer/Standards/**/*.js',
          'libs/HTML_CodeSniffer/HTMLCS.js',
          'src/runner.js'
        ]
      }
    },
    dist: {
      files: '<%= uglify.dev.files %>'
    }
  },

  // Watch
  // ------------------------
  watch: {
    jshint: {
      files: 'src/**/*.js',
      tasks: ['jshint', 'exec']
    },
  }

};
