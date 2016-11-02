import rc from 'rc';
import _ from 'underscore';
import Promise from 'bluebird';
import logger from './logger';

import { getFileContents, NormalizeOutput } from './helpers';
import ParseOutput from './messages';
import SelectInstance from './runners';

import defaults from './helpers/defaults';

export default class Accessibility {
  constructor(options) {

    // Merge defaults with options
    _.defaults(options, defaults);

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
      .then(data => ParseOutput(data, file, fileContents, this.options))
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

          reportLogs[fileName] = { counters, messageLog };
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
