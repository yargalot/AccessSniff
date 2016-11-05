import rc from 'rc';
import _ from 'underscore';
import Promise from 'bluebird';
import logger from '../logger';

import TestRunner from './testRunner';
import { CreateReportsJson } from '../helpers';

import defaults from '../helpers/defaults';

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

  run(filesInput) {
    const files = Promise.resolve(filesInput);
    const { verbose } = this.options;

    if (this.options.verbose) {
      logger.startMessage('Starting Accessibility tests');
    }

    return files
      .bind(this)
      .map((file) => TestRunner(file, this.options), { concurrency: 1 })
      .then(reports => CreateReportsJson(reports))
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
