var accessSniff = require('./accessSniff.js');
var packageInfo = require('../package.json');
var program = require('commander');


var exports = {};

exports.setup = function(cliOptions) {

  var files = [];
  var options = {};

  program
    .version(packageInfo.version)
    .option('-r, --reportType [reportType]', 'Report type [json]', 'json')
    .option('-r, --reportLocation [reportLocation]', 'Report Location [reports]', 'reports')
    .option('-v, --verbose', 'Log output')
    .parse(cliOptions);


  // ADD IN REPORTS
  options.reportType = program.reportType;
  options.reportLocation = program.reportLocation;

  accessSniff.start(program.args, options);

};

module.exports = exports;
