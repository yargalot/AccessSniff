'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /* eslint-disable no-console */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reports = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _logger = require('./logger.js');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mkdirp = require('mkdirp');

var defaultOptions = {
  fileName: 'report',
  reportType: 'json',
  location: 'reports'
};

exports.default = function (messageLog) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? defaultOptions : arguments[1];

  new reports(messageLog, options);
};

var reports = exports.reports = (function () {
  function reports(messageLog, options) {
    _classCallCheck(this, reports);

    var report = {
      name: options.fileName,
      type: options.reportType,
      location: options.location,
      output: ''
    };

    switch (options.reportType) {

      case 'json':
        report.output = this.reportJson(messageLog);
        break;

      case 'csv':
        report.output = this.reportCsv(messageLog);
        break;

      case 'txt':
        report.output = this.reportTxt(messageLog);
        break;

    }

    return this.writeFile(report);
  }

  _createClass(reports, [{
    key: 'reportJson',
    value: function reportJson(messageLog) {

      console.log('Writing JSON Report...');

      return JSON.stringify(messageLog);
    }
  }, {
    key: 'reportTxt',
    value: function reportTxt(messageLog) {

      var output = 'heading, issue, element, line, column, description \n';
      var seperator = '|';

      messageLog.forEach(function (message) {

        output += message.heading + seperator;
        output += message.issue + seperator;
        output += message.element.node + seperator;
        output += message.element.id + seperator;
        output += message.element.class + seperator;
        output += message.position.lineNumber + seperator;
        output += message.position.columnNumber + seperator;
        output += message.description + '\n';
      });

      return output;
    }
  }, {
    key: 'reportCsv',
    value: function reportCsv(messageLog) {

      var output = 'heading, issue, element, line, column, description \n';
      var seperator = ',';

      messageLog.forEach(function (message) {

        output += message.heading + seperator;
        output += '"' + message.issue + '"' + seperator;
        output += message.element.node + seperator;
        output += message.element.id + seperator;
        output += message.element.class + seperator;
        output += message.position.lineNumber + seperator;
        output += message.position.columnNumber + seperator;
        output += message.description + '\n';
      });

      return output;
    }
  }, {
    key: 'writeFile',
    value: function writeFile(report) {

      mkdirp(process.cwd() + '/' + report.location, function (err) {

        if (err) {
          console.error(err);
        }

        var fileName = report.name + '.' + report.type;
        var filePath = process.cwd() + '/' + report.location + '/' + fileName;

        _fs2.default.writeFile(filePath, report.output, function (err) {
          if (err) {
            return console.log(err);
          }

          _logger2.default.finishedMessage(filePath);
          return report.output;
        });
      });
    }
  }]);

  return reports;
})();