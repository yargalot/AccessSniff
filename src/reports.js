/* eslint-disable no-console */
import _ from 'underscore';
import fs from 'fs';
import mkdirp from 'mkdirp';
import logger from './logger.js';

const defaultOptions = {
  fileName: 'report',
  reportType: 'json',
  location: 'reports'
};

export default (messageLog, options = defaultOptions) => {

  _.defaults(options, defaultOptions);

  let report = new reports(messageLog, options);

  if (options.location) {
    report.writeFile();
  }

  return report.getReport();
};

export class reports {

  constructor(messageLog, options) {

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

  reportJson(messageLog) {

    console.log('Writing JSON Report...');

    return JSON.stringify(messageLog);
  }

  reportTxt(reports) {

    let output = 'heading, issue, element, line, column, description \n';
    const seperator = '|';

    _.each(reports, (report) => report.forEach(message => {

      output += message.heading + seperator;
      output += message.issue + seperator;
      output += message.element.node + seperator;
      output += message.element.id + seperator;
      output += message.element.class + seperator;
      output += message.position.lineNumber + seperator;
      output += message.position.columnNumber + seperator;
      output += message.description + '\n';

    }));

    return output;

  }

  reportCsv(reports) {

    let output = 'heading, issue, element, line, column, description \n';
    const seperator = ',';

    _.each(reports, report => report.forEach(message => {

      output += message.heading + seperator;
      output += `"${message.issue}"` + seperator;
      output += message.element.node + seperator;
      output += message.element.id + seperator;
      output += message.element.class + seperator;
      output += message.position.lineNumber + seperator;
      output += message.position.columnNumber + seperator;
      output += message.description + '\n';

    }));

    return output;

  }

  writeFile() {
    const report = this.report;
    const fileName = `${report.name}.${report.type}`;
    const filePath = `${process.cwd()}/${report.location}/${fileName}`;

    mkdirp.sync(`${process.cwd()}/${report.location}`);

    fs.writeFileSync(filePath, report.output);

    logger.finishedMessage(filePath);

    return report.output;
  }

  getReport() {
    const newReport = this.report.output;
    return newReport;
  }
}
