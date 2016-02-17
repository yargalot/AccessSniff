'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reports = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-console */


var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _logger = require('./logger.js');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
  fileName: 'report',
  reportType: 'json',
  location: ''
};

exports.default = function (messageLog) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? defaultOptions : arguments[1];


  _underscore2.default.defaults(options, defaultOptions);

  var report = new reports(messageLog, options);

  if (options.location) {
    report.writeFile();
  }

  return report.getReport();
};

var reports = exports.reports = function () {
  function reports(messageLog, options) {
    _classCallCheck(this, reports);

    this.report = {
      name: options.fileName,
      type: options.reportType,
      location: options.location,
      output: ''
    };

    switch (options.reportType) {

      case 'json':
        this.report.output = this.reportJson(messageLog);
        break;

      case 'csv':
        this.report.output = this.reportCsv(messageLog);
        break;

      case 'txt':
        this.report.output = this.reportTxt(messageLog);
        break;

    }
  }

  _createClass(reports, [{
    key: 'reportJson',
    value: function reportJson(messageLog) {

      console.log('Writing JSON Report...');

      return JSON.stringify(messageLog);
    }
  }, {
    key: 'reportTxt',
    value: function reportTxt(reports) {

      var output = 'heading, issue, element, line, column, description \n';
      var seperator = '|';

      _underscore2.default.each(reports, function (report) {
        return report.forEach(function (message) {

          output += message.heading + seperator;
          output += message.issue + seperator;
          output += message.element.node + seperator;
          output += message.element.id + seperator;
          output += message.element.class + seperator;
          output += message.position.lineNumber + seperator;
          output += message.position.columnNumber + seperator;
          output += message.description + '\n';
        });
      });

      return output;
    }
  }, {
    key: 'reportCsv',
    value: function reportCsv(reports) {

      var output = 'heading, issue, element, line, column, description \n';
      var seperator = ',';

      _underscore2.default.each(reports, function (report) {
        return report.forEach(function (message) {

          output += message.heading + seperator;
          output += '"' + message.issue + '"' + seperator;
          output += message.element.node + seperator;
          output += message.element.id + seperator;
          output += message.element.class + seperator;
          output += message.position.lineNumber + seperator;
          output += message.position.columnNumber + seperator;
          output += message.description + '\n';
        });
      });

      return output;
    }
  }, {
    key: 'writeFile',
    value: function writeFile() {
      var report = this.report;
      var fileName = report.name + '.' + report.type;
      var filePath = process.cwd() + '/' + report.location + '/' + fileName;

      _mkdirp2.default.sync(process.cwd() + '/' + report.location);

      _fs2.default.writeFileSync(filePath, report.output);

      _logger2.default.finishedMessage(filePath);

      return report.output;
    }
  }, {
    key: 'getReport',
    value: function getReport() {
      var newReport = this.report.output;
      return newReport;
    }
  }]);

  return reports;
}();