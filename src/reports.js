var fs        = require('fs');
var mkdirp    = require('mkdirp');
var logger    = require('./logger.js');

var reports = {};

reports.terminal = function(messageLog, options, callback) {

  var reportOutput;

  switch (options.reportType) {

    case 'json':
      reportOutput = this.reportJson(messageLog);
      break;

    case 'csv':
      reportOutput = this.reportCsv(messageLog);
      break;

    case 'txt':
      reportOutput = this.reportTxt(messageLog);
      break;

    default:
      console.log('Report type does not exist');
      return;

  }

  this.writeFile(reportOutput, options.fileName, options.reportType, options.reportLocation, callback);

};

reports.reportJson = function(messageLog) {

  console.log('Writing JSON Report...');

  return JSON.stringify(messageLog);
};

reports.reportTxt = function(messageLog) {

  var output = 'heading, issue, element, line, column, description \n';
  var seperator = '|';

  messageLog.forEach(function(message, index, array) {

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

reports.reportCsv = function(messageLog) {

  var output = 'heading, issue, element, line, column, description \n';
  var seperator = ',';

  messageLog.forEach(function(message, index, array) {

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

reports.writeFile = function(reportOutput, reportName, reportType, reportLocation, callback) {

  mkdirp(process.cwd() + '/' + reportLocation, function(err) {

    if (err) {
      console.error(err);
    }

    var filePath = '/' + reportLocation + '/' + reportName + '.' + reportType;

    fs.writeFile(process.cwd() + filePath, reportOutput, function(err) {
      if (err) {
        return console.log(err);
      }

      logger.finishedMessage(filePath);
      callback();
    });

  });

};

module.exports = reports;
