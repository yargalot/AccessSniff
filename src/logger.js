/* @flow */
/*eslint-disable no-console */
import chalk from 'chalk';

// Init Logger object
let logger = {};

logger.generalMessage = (message: {
  heading: string,
  issue: string,
  description: string,
  element: {
    node: string
  },
  position: {
    lineNumber: number,
    columnNumber:  number
  },
}) => {

  let heading: string = '';

  switch (message.heading) {
    case 'ERROR':
      heading = chalk.red.bold(message.heading);
      break;
    case 'NOTICE':
      heading = chalk.blue.bold(message.heading);
      break;
    default:
      heading = chalk.yellow.bold(message.heading);
  }

  heading += ' ' + message.issue;

  console.log(heading);
  console.log(chalk.cyan('Line ' + message.position.lineNumber + ' col '  + message.position.columnNumber));
  console.log(chalk.grey(message.description));
  console.log(chalk.grey('--------------------'));
  console.log(chalk.grey(message.element.node));
  console.log('');

  return;

};

logger.startMessage = (message: string) => {

  console.log(chalk.white.underline(message));
  console.log('');

};

logger.finishedMessage = (filePath: string) => {

  if (filePath) {
    console.log(chalk.cyan(`File "${filePath}" created.`));
  }

  console.log(chalk.cyan('Report Finished'));
};

logger.errorMessage = (errors: number) => {
  console.log(chalk.red(`There were ${errors} errors present`));
};

logger.generalError = (error: string) => {
  console.error(error);
};

module.exports = logger;
