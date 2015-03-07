"use strict";

var accessSniff = require('./accessSniff.js');
var packageInfo = require('../package.json');
var program = require('commander');


var exports = {
  run : function() {

  },

  setup: function(options) {

    program
      .version(packageInfo.version)
      .option('-p, --peppers', 'Add peppers')
      .option('-P, --pineapple', 'Add pineapple')
      .option('-b, --bbq', 'Add bbq sauce')
      .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
      .parse(options);


    accessSniff.start(options);

  }
};


module.exports = exports;
