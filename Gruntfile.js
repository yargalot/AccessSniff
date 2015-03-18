module.exports = function(grunt) {

  // Time Grunt
  require('time-grunt')(grunt);

  // Load Development scripts
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });

  grunt.initConfig({

    // Js Hint
    // ------------------------
    jshint: {
      all: ['src/*.js'],
      options: {
        jshintrc: '.jshintrc'
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
        tasks: ['jshint']
      }
    }

  });

  /* Whenever the "test" task is run, first clean the "tmp" dir, then run this
   * plugin's task(s), then test the result.
   */
  grunt.registerTask('test',  ['jshint']);
  
  grunt.registerTask('dev',   ['jshint', 'uglify:dev', 'watch']);


  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint']);
};
