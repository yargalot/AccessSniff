import Accessibility from './app';
import reporter from './reports';
import program from 'commander';
import _ from 'underscore';
import glob from 'glob';
import rc from 'rc';

const start = (fileInput, options = {}) => {

  let reportFiles = [];

  // Options verbose
  if (program.verbose) {
    options.verbose = true;
  }

  if (typeof fileInput === 'string') {
    reportFiles.push(fileInput);
  }

  if (Array.isArray(fileInput)) {
    reportFiles = fileInput;
  }

  reportFiles = reportFiles.map(file =>
    glob.hasMagic(file) ? glob.sync(file) : file
  );

  // Check .accessibilityrc file
  const conf = rc('accessibility', options);

  // Run Task
  const task = new Accessibility(conf);

  return task.run(_.flatten(reportFiles));
};

export { start as default, reporter as report};
