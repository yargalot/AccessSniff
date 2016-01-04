import Accessibility from './accesssniff';

export default (files, options, callback) => {

  const task = new Accessibility(options);

  return task.run(files, callback);

};
