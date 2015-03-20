var fs        = require('fs');
var mkdirp    = require('mkdirp');
var logger    = require('./logger.js');


var reports = {};

reports.terminal = function(messageLog, options, callback) {

  var reportOutput;

  switch(options.reportType) {

    case 'json':
      reportOutput = this.reportJson(messageLog);
      break;

    case 'csv':
      reportOutput = this.reportCsv(messageLog);
      break;


    default:
      console.log('Report type does not exist');
      return;

  }

  this.writeFile(reportOutput, options.fileName, options.reportType, options.reportLocation, callback);

};


// var message = {
//   heading:      msgSplit[0],
//   issue:        msgSplit[1],
//   element:      msgSplit[3],
//   position:     this.getElementPosition(msgSplit[3]),
//   description:  msgSplit[2],
// };

reports.reportJson = function(messageLog) {

  console.log('Writing JSON Report...');

  return JSON.stringify(messageLog);
};


reports.reportText = function() {



};


reports.reportCsv = function(messageLog) {

  var output = 'heading, issue, element, line, column, description \n';

  messageLog.forEach(function(message, index, array) {

    console.log(message);

    output += message.heading + ',';
    output += '"' + message.issue + '"' + ',';
    output += message.element + ',';
    output += message.position.lineNumber + ',';
    output += message.position.columnNumber + ',';
    output += message.description + '\n';

  });

  return output;


};

reports.writeFile = function(reportOutput, reportName, reportType, reportLocation, callback) {

  mkdirp(process.cwd() + '/' + reportLocation, function(err) {

    if (err) {
      console.error(err);
    }

    var filePath = '/'+ reportLocation + '/' + reportName + '.' + reportType;

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
