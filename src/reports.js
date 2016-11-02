/* eslint-disable no-console */
import _ from 'underscore';
import fs from 'fs';
import mkdirp from 'mkdirp';
import logger from './logger.js';

const defaultOptions = {
  fileName: 'report',
  reportType: 'json',
  location: ''
};

const generateReport = (reports, seperator) => {

  let output = '';

  _.each(reports, (report, fileName) =>
    report.messageLog.forEach((message) => {
      const headings = ['heading', 'issue', 'element', 'id', 'class', 'line', 'column', 'description'].join(seperator);

      output += `${fileName}\n`;
      output += `${headings}\n`;
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

};

export default (reports, options = defaultOptions) => {

  _.defaults(options, defaultOptions);

  let report = new ReportsGenerator(reports, options);

  if (options.location) {
    report.writeFile();
  }

  return report.getReport();
};


class ReportsGenerator {

  constructor(reports, options) {

    this.report = {
      name: options.fileName,
      type: options.reportType,
      location: options.location,
      output: ''
    };

    switch (options.reportType) {

      case 'json':
        this.report.output = this.reportJson(reports);
        break;

      case 'csv':
        this.report.output = this.reportCsv(reports);
        break;

      case 'txt':
        this.report.output = this.reportTxt(reports);
        break;

    }

  }

  reportJson(reports) {
    return JSON.stringify(reports);
  }

  reportTxt(reports) {
    return generateReport(reports, '|');
  }

  reportCsv(reports) {
    return generateReport(reports, ',');
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
