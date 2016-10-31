import Accessibility from './accesssniff';
import reporter from './reports';
import program from 'commander';
import glob from 'glob';
import _ from 'underscore';

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

  const task = new Accessibility(options);

  return task.run(_.flatten(reportFiles));
};

export { start as default, reporter as report};
