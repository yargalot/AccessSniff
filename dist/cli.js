'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _accessSniff = require('./accessSniff');

var _accessSniff2 = _interopRequireDefault(_accessSniff);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _exports = {};

_exports.setup = function (cliOptions) {

  var options = {};

  _commander2.default.version(_package2.default.version).option('-r, --reportType [reportType]', 'Report type [json]', 'json').option('-l, --reportLocation [reportLocation]', 'Report Location [reports]', 'reports').option('-q, --quiet', 'No terminal output').parse(cliOptions);

  if (!_commander2.default.args.length) {
    _logger2.default.generalError('Please provide a filepath to check');
    return false;
  }

  // ADD IN REPORTS
  options.reportType = _commander2.default.reportType;
  options.reportLocation = _commander2.default.reportLocation;

  if (_commander2.default.quiet) {
    options.verbose = false;
  }

  _accessSniff2.default.start(_commander2.default.args, options, function (messageLog, errors) {
    if (errors) {
      _logger2.default.errorMessage(errors);
    }
  });
};

module.exports = _exports;