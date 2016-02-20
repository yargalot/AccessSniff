'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.report = undefined;

var _accesssniff = require('./accesssniff');

var _accesssniff2 = _interopRequireDefault(_accesssniff);

var _reports = require('./reports');

var _reports2 = _interopRequireDefault(_reports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint-disable no-console */

exports.default = function (fileInput) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


  var reportFiles = [];

  if (typeof fileInput === 'string') {
    reportFiles.push(fileInput);
  }

  if (Array.isArray(fileInput)) {
    reportFiles = fileInput;
  }

  var task = new _accesssniff2.default(options);

  return task.run(reportFiles);
};

exports.report = _reports2.default;