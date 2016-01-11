import Accessibility from './accesssniff';
import reporter from './reports';

export default (files, options = {}) => {

  let reportFiles = [];

  if (typeof files === 'string') {
    reportFiles.push(files);
  }

  if (Array.isArray(files)) {
    reportFiles = files;
  }

  const task = new Accessibility(options);

  return task
    .run(reportFiles)
    .then(data => reporter.terminal(data, options, data => data));

};
