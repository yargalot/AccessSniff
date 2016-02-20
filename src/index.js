/*eslint-disable no-console */
import Accessibility from './accesssniff';
import reporter from './reports';

export default (fileInput, options = {}) => {

  let reportFiles = [];

  if (typeof fileInput === 'string') {
    reportFiles.push(fileInput);
  }

  if (Array.isArray(fileInput)) {
    reportFiles = fileInput;
  }

  const task = new Accessibility(options);

  return task
    .run(reportFiles);
};

export {reporter as report};
