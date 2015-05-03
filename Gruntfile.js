module.exports = function(grunt) {

  // Time Grunt
  require('time-grunt')(grunt);

  // Load Development scripts
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });

  grunt.initConfig({


    // Clean
    // ------------------------
    clean: {
      tests: ['reports']
    },


    // Js Hint
    // ------------------------
    jshint: {
      all: ['src/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    jscs: {
      main: [ "src/*.js" ]
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


    // Executables
    // ------------------------
    exec: {
      testJson: {
        cmd: 'sniff test/**/*.html -r json -l reports'
      },
      testCsv: {
        cmd: 'sniff test/**/*.html -r csv -l reports'
      },
      testTxt: {
        cmd: 'sniff test/**/*.html -r txt -l reports'
      },
      testUrl: {
        cmd: 'sniff http://statamic.com/ -r json -l reports'
      }
    },


    // Unit tests
    // ------------------------
    nodeunit: {
      tests: ['test/*.js']
    },


    // Watch
    // ------------------------
    watch: {
      jshint: {
        files: 'src/**/*.js',
        tasks: ['jshint', 'exec']
      },
    }

  });


  grunt.registerTask('dev',   ['jshint', 'uglify:dev', 'watch']);

  grunt.registerTask('test',  ['clean:tests', 'uglify:dev', 'exec', 'nodeunit', 'jshint', 'jscs']);


  // By default, lint and run all tests.
  grunt.registerTask('default', ['clean:tests', 'exec', 'jshint', 'nodeunit', 'watch']);
};
