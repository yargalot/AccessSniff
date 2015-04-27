var program = require('commander');
var logger    = require('./logger.js');
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

  if (!program.args.length) {
    console.error('Please provide a filepath to check');
    return false;
  }

  // ADD IN REPORTS
  options.reportType = program.reportType;
  options.reportLocation = program.reportLocation;

  if (program.quiet) {
    options.verbose = false;
  }

  accessSniff.start(program.args, options, function(messageLog, errors) {
    if (errors) {
      logger.errorMessage(errors);
    }
  });

};

module.exports = exports;
