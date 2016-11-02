import rc from 'rc';
import _ from 'underscore';
import Promise from 'bluebird';
import logger from './logger';

import { buildMessage, getFileContents, NormalizeOutput } from './helpers';
import SelectInstance from './runners';

export default class Accessibility {
  constructor(options) {
    this.basepath = process.cwd();

    // Count the errors and stuff
    this.errorCount = 0;
    this.noticeCount = 0;
    this.warningCount = 0;

    // Mark for if all the tests were lint free
    this.lintFree = true;

    this.log = '';

    this.defaults = {
      ignore: [],
      verbose: true,
      force: false,
      browser: false,
      domElement: true,
      reportType: null,
      reportLevels: {
        notice: true,
        warning: true,
        error: true
      },
      reportLevelsArray: [],
      reportLocation : '',
      accessibilityrc: true,
      accessibilityLevel: 'WCAG2A',
      maxBuffer: 500*1024
    };

    _.defaults(options, this.defaults);

    // Check .accessibilityrc file
    const conf = rc('accessibility', options);

    // We need to convert the report levels to uppercase
    _.each(conf.reportLevels, (value, key) => {
      if (value) {
        conf.reportLevelsArray.push(key.toUpperCase());
      }
    });

    // Assign options to this
    this.options = conf;
  }

  parseOutput(outputMessages, fileName, fileContents) {
    // Run the messages through the parser
    let messageLog = outputMessages.map(message => {

      // Each message will return as an array, [messageType, messagePipe]
      const messageType = message[0];
      const messagePipe = message[1];

      // If the type is wcaglint done hop out of the loop
      if (messageType === 'wcaglint.done') {
        return;
      }

      return buildMessage(messagePipe, fileContents, this.options);
    });

    // Filter out no messages
    messageLog = messageLog.filter(message => message);

    // If verbose is true then push the output through to the terminal

    let counters = {
      error: 0,
      notice: 0,
      warning: 0
    };

    const updateCounter = heading => counters[heading.toLowerCase()] ++;

    messageLog.forEach(message => {

      if (this.options.verbose) {
        logger.generalMessage(message);
      }

      updateCounter(message.heading);
    });

    // If there are messages then the files are not lint free
    const lintFree = (this.errorCount || this.noticeCount || this.warningCount) ? true : false;

    return { fileName, lintFree, counters, messageLog };
  }

  fileResolver(file) {
    const deferredOutside = Promise.pending();
    const { verbose } = this.options;

    if (verbose) {
      logger.startMessage(`Testing ${file}`);
    }

    let fileContents;

    // Get file contents
    getFileContents(file)
      .then(data => {
        fileContents = data;
        return SelectInstance(file, this.options);
      })
      .then(data => Array.isArray(data) ? data : NormalizeOutput(data))
      .then(data => this.parseOutput(data, file, fileContents))
      .then(reportData => deferredOutside.resolve(reportData))
      .catch(error => {
        logger.generalError(`Testing ${file} failed`);
        logger.generalError(error);
        deferredOutside.reject(error);
      });

    return deferredOutside.promise;
  }

  run(filesInput) {
    const files = Promise.resolve(filesInput);
    const { verbose } = this.options;

    if (this.options.verbose) {
      logger.startMessage('Starting Accessibility tests');
    }

    return files
      .bind(this)
      .map(this.fileResolver, { concurrency: 1 })
      .then((reports) => {
        let reportLogs = {};
        let totalIssueCount = { error: 0, warning: 0, notice: 0 };
        let AllReportsLintFree;

        reports.forEach(report => {
          const { fileName, lintFree, messageLog, counters } = report;

          if (lintFree) {
            AllReportsLintFree = true;
          }

          totalIssueCount.error += counters.error;
          totalIssueCount.warning += counters.warning;
          totalIssueCount.notice += counters.notice;

          reportLogs[fileName] = messageLog;
        });

        return { reportLogs, totalIssueCount, AllReportsLintFree };
      })
      .then(({ reportLogs, totalIssueCount, AllReportsLintFree }) => {

        if (AllReportsLintFree) {
          logger.lintFree(filesInput.length);
        }

        let errorString = totalIssueCount.error > 1 ? 'errors' : 'error';
        let errorMessage = `There was ${totalIssueCount.error} ${errorString}`;

        if (totalIssueCount.error && verbose) {
          logger.generalError(errorMessage);
        }

        if (!this.options.force && totalIssueCount.error) {
          return Promise.reject(errorMessage);
        }

        return reportLogs;
      });
  }

}
