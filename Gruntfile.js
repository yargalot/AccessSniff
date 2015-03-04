module.exports = function(grunt) {

  // Time Grunt
  require('time-grunt')(grunt);

  // Load Development scripts
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });

  // Load Grunt Accessibility
  grunt.loadTasks('tasks');


  grunt.initConfig({

    // Js Hint
    // ------------------------
    jshint: {
      all: [
        'tasks/*.js',
        'tasks/lib/*.js',
        '!tasks/lib/HTMLCS.min.js',
        '!tasks/lib/runner.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  /* Whenever the "test" task is run, first clean the "tmp" dir, then run this
   * plugin's task(s), then test the result.
   */
  grunt.registerTask('dev',   ['uglify:dev', 'watch']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint']);
};
