/* @flow */
/*eslint-disable no-console */
import chalk from 'chalk';
import unixify from 'unixify';

const finishedMessage = (filePath: string): string => {

  let message = 'Report Finished';

  if (filePath) {
    let normalisedFilepath = unixify(filePath);
    message = `File "${normalisedFilepath}" created. ${message}`;
  }

  console.log(chalk.cyan(message));

  return message;

};

export { finishedMessage as default };
