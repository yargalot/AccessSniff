module.exports.tasks = {

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
