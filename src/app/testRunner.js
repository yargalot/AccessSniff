/* @flow */

import Promise from 'bluebird';
import logger from '../logger';
import ParseOutput from '../messages';
import SelectInstance from '../runners';
import { getFileContents, NormalizeOutput } from '../helpers';

const ErrorReporter = (file , error, deferredPromise) => {
  logger.generalError(`Testing ${file} failed`);
  logger.generalError(error);
  deferredPromise.reject(error);
};

type optionObject = {
  verbose: true
};

const TestRunner = (file:string , options:optionObject) => {
  const deferredOutside = Promise.pending();
  const { verbose } = options;
  let fileContents;

  if (verbose) {
    logger.startMessage(`Testing ${file}`);
  }

  // Get file contents
  getFileContents(file)
    .then(data => {
      fileContents = data;
      return SelectInstance(file, options);
    })
    .then(data => Array.isArray(data) ? data : NormalizeOutput(data))
    .then(data => ParseOutput(data, file, fileContents, options))
    .then(reportData => deferredOutside.resolve(reportData))
    .catch(error => ErrorReporter(file, error, deferredOutside));

  return deferredOutside.promise;
};

export { TestRunner as default };
