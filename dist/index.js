'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.report = undefined;

var _accesssniff = require('./accesssniff');

var _accesssniff2 = _interopRequireDefault(_accesssniff);

var _reports = require('./reports');

var _reports2 = _interopRequireDefault(_reports);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fileInput) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


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

  var task = new _accesssniff2.default(options);

  return task.run(reportFiles);
}; /*eslint-disable no-console */


exports.report = _reports2.default;