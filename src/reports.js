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

  new reports(messageLog, options);
};

export class reports {

  constructor(messageLog, options) {

    let report = {
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

  reportJson(messageLog) {

    console.log('Writing JSON Report...');

    return JSON.stringify(messageLog);
  }

  reportTxt(reports) {

    let output = 'heading, issue, element, line, column, description \n';
    const seperator = '|';

    reports.forEach(report => report.forEach(message => {

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

    reports.forEach(report => report.forEach(message => {

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

  writeFile(report) {

    mkdirp(`${process.cwd()}/${report.location}`, (err) => {

      if (err) {
        console.error('MKDIRP', err);
      }

      const fileName = `${report.name}.${report.type}`;
      const filePath = `${process.cwd()}/${report.location}/${fileName}`;

      fs.writeFile(filePath, report.output, (err) => {
        if (err) {
          return console.error(err);
        }

        logger.finishedMessage(filePath);

        return report.output;
      });

    });

  }
}
