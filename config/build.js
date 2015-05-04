module.exports.tasks = {

  // Watch
  // ------------------------
  watch: {
    babel: {
      files: ['src/**/*.js'],
      tasks: ['jshint', 'jscs', 'babel']
    },
  },

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
          'dist/accessSniff.js': 'src/accessSniff.js'
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

};
