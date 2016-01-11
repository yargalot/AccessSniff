import Accessibility from './accesssniff';
import reporter from './reports';

export default (files, options = {}) => {

  const task = new Accessibility(options);

  return task.run(files).then(data => {
    return reporter.terminal(data, options, data => data);
  });

};
