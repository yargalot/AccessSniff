'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mkdirp = require('mkdirp'); /* eslint-disable no-console */

var logger = require('./logger.js');

var reports = {};

reports.terminal = function (messageLog, options) {

  if (!options.reportType) {
    return messageLog;
  }

  var report = {
    name: options.fileName,
    type: options.reportType,
    location: options.fileName,
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
};

reports.reportJson = function (messageLog) {

  console.log('Writing JSON Report...');

  return JSON.stringify(messageLog);
};

reports.reportTxt = function (messageLog) {

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
};

reports.reportCsv = function (messageLog) {

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
};

reports.writeFile = function (report) {

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

      logger.finishedMessage(filePath);
      return report.output;
    });
  });
};

module.exports = reports;