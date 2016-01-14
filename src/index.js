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

  // if (!reportFiles.length) {}

  const task = new Accessibility(options);

  return task
    .run(reportFiles)
    .then(data => data);

};

export {reporter as report};
