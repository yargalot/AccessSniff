module.exports = function(grunt) {

  var configs = require('load-grunt-configs')(grunt);

  // Time Grunt
  require('time-grunt')(grunt);
  // Just in time
  require('jit-grunt')(grunt);

  // Load tasks
  grunt.initConfig(configs);

  // Grunt tasks
  grunt.registerTask('dev',     ['jshint', 'uglify:dev', 'watch']);
  grunt.registerTask('test',    ['clean:tests', 'uglify:dev', 'exec', 'nodeunit', 'jshint', 'jscs']);
  grunt.registerTask('default', ['clean:tests', 'exec', 'jshint', 'nodeunit', 'watch']);
};
