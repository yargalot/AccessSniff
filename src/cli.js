var program = require('commander');
var accessSniff = require('./accessSniff.js');
var packageInfo = require('../package.json');


var exports = {};

exports.setup = function(cliOptions) {

  var files = [];
  var options = {};

  program
    .version(packageInfo.version)
    .option('-r, --reportType [reportType]', 'Report type [json]', 'json')
    .option('-l, --reportLocation [reportLocation]', 'Report Location [reports]', 'reports')
    .option('-q, --quiet', 'No terminal output')
    .parse(cliOptions);


  // ADD IN REPORTS
  options.reportType = program.reportType;
  options.reportLocation = program.reportLocation;

  if (program.quiet) {
    options.quiet = program.quiet;
  }

  accessSniff.start(program.args, options);

};

module.exports = exports;
