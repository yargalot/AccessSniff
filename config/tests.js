module.exports.tasks = {

  // Watch
  // ------------------------
  watch: {
    jshint: {
      files: ['src/**/*.js', 'config/*.js', 'Gruntfile.js'],
      tasks: ['jshint', 'jscs', 'babel']
    },
  },

  // Js Hint
  // ------------------------
  jshint: {
    all: ['src/*.js'],
    options: {
      jshintrc: '.jshintrc'
    }
  },

  // JSCS
  // ------------------------
  jscs: {
    main: ['src/*.js', 'config/*.js', 'Gruntfile.js']
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
  }

};
