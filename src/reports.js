/* eslint-disable no-console */
import fs from 'fs';
var mkdirp    = require('mkdirp');
var logger    = require('./logger.js');

var reports = {};

reports.terminal = function(messageLog, options) {

  if (!options.reportType) {
    return messageLog;
  }

  let report = {
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

reports.reportJson = function(messageLog) {

  console.log('Writing JSON Report...');

  return JSON.stringify(messageLog);
};

reports.reportTxt = function(messageLog) {

  let output = 'heading, issue, element, line, column, description \n';
  const seperator = '|';

  messageLog.forEach(message => {

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

  let output = 'heading, issue, element, line, column, description \n';
  const seperator = ',';

  messageLog.forEach(message => {

    output += message.heading + seperator;
    output += `"${message.issue}"` + seperator;
    output += message.element.node + seperator;
    output += message.element.id + seperator;
    output += message.element.class + seperator;
    output += message.position.lineNumber + seperator;
    output += message.position.columnNumber + seperator;
    output += message.description + '\n';

  });

  return output;

};

reports.writeFile = function(report) {

  mkdirp(`${process.cwd()}/${report.location}`, (err) => {

    if (err) {
      console.error(err);
    }

    const fileName = `${report.name}.${report.type}`;
    const filePath = `${process.cwd()}/${report.location}/${fileName}`;

    fs.writeFile(filePath, report.output, (err) => {
      if (err) {
        return console.log(err);
      }

      logger.finishedMessage(filePath);
      return report.output;
    });

  });

};

module.exports = reports;
