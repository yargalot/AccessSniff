"use strict";

var accessSniff = require('./accessSniff.js');
var packageInfo = require('../package.json');
var program = require('commander');


var exports = {

  setup: function(options) {

    var files = [];
    //var options = {};

    program
      .version(packageInfo.version)
      .option('-p, --peppers', 'Add peppers')
      .option('-P, --pineapple', 'Add pineapple')
      .option('-b, --bbq', 'Add bbq sauce')
      .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
      .parse(options);

    // console.log(program);

    accessSniff.start(program.args, options);

  }

};


module.exports = exports;
