import program from 'commander';
import logger from '../logger';
import accessSniff from '../app';
import report from '../reports';
import packageInfo from '../../package.json';

var exports = {};

exports.setup = function(cliOptions) {

  var options = {};

  program
    .version(packageInfo.version)
    .option('-r, --reportType [reportType]', 'Report type [json]', 'json')
    .option('-l, --reportLocation [reportLocation]', 'Report Location [reports]', 'reports')
    .option('-q, --quiet', 'No terminal output')
    .parse(cliOptions);

  if (!program.args.length) {
    logger.generalError('Please provide a filepath, url or string to check');
    return false;
  }

  // ADD IN REPORTS
  options.reportType = program.reportType;
  options.reportLocation = program.reportLocation;

  if (program.quiet) {
    options.verbose = false;
  }

  new accessSniff(options)
    .run(program.args)
    .then(reportData => {
      if (options.reportType || options.reportLocation) {
        return report(reportData, options);
      }
    });

};

module.exports = exports;
