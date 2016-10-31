'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.report = exports.default = undefined;

var _accesssniff = require('./accesssniff');

var _accesssniff2 = _interopRequireDefault(_accesssniff);

var _reports = require('./reports');

var _reports2 = _interopRequireDefault(_reports);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var start = function start(fileInput) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  var reportFiles = [];

  // Options verbose
  if (_commander2.default.verbose) {
    options.verbose = true;
  }

  if (typeof fileInput === 'string') {
    reportFiles.push(fileInput);
  }

  if (Array.isArray(fileInput)) {
    reportFiles = fileInput;
  }

  reportFiles = reportFiles.map(function (file) {
    return _glob2.default.hasMagic(file) ? _glob2.default.sync(file) : file;
  });

  var task = new _accesssniff2.default(options);

  return task.run(_underscore2.default.flatten(reportFiles));
};

exports.default = start;
exports.report = _reports2.default;