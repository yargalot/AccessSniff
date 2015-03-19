var fs        = require('fs');
var mkdirp    = require('mkdirp');
var logger    = require('./logger.js');


var reports = {};

reports.terminal = function(messageLog, options) {

  var reportOutput;

  switch(options.reportType) {

    case 'json':
      reportOutput = this.reportJson(messageLog);
      break;

    default:
      console.log('Report type does not exist');
      return;

  }

  this.writeFile(reportOutput, options.reportType, options.reportLocation);

};


// var message = {
//   heading:      msgSplit[0],
//   issue:        msgSplit[1],
//   element:      msgSplit[3],
//   position:     this.getElementPosition(msgSplit[3]),
//   description:  msgSplit[2],
// };

reports.reportJson = function(messageLog) {

  console.log('Writing JSON Report');

  return JSON.stringify(messageLog);
};


reports.reportText = function() {


};


reports.reportCsv = function() {


};

reports.writeFile = function(reportOutput, reportType, reportLocation) {

  console.log(reportLocation);

  mkdirp(process.cwd() + '/' + reportLocation, function(err) {

    if (err) {
      console.error(err);
    }

    fs.writeFile(process.cwd() + '/'+ reportLocation + '/test.' + reportType, reportOutput, function(err) {
      if (err) {
        return console.log(err);
      }

      logger.finishedMessage();
    });

  });


};

module.exports = reports;
