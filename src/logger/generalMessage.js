/* @flow */
/*eslint-disable no-console */
import chalk from 'chalk';

type MessageObject = {
  heading: string,
  issue: string,
  description: string,
  element: {
    node: string
  },
  position: {
    lineNumber: number,
    columnNumber:  number
  }
};

type PositionObject = {
  lineNumber: number,
  columnNumber:  number
};

const generalMessage = (message: MessageObject): [string, string, string, string] => {
  let heading: string = '';
  const position: PositionObject = message.position;
  const lineMessage: string = `Line:${position.lineNumber} Col:${position.columnNumber}`;

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

  heading += ` ${message.issue}`;

  console.log(heading);
  if (message.position.lineNumber || message.position.columnNumber) {
    console.log(chalk.cyan(lineMessage));
  }
  console.log(chalk.grey(message.description));
  console.log(chalk.grey('--------------------'));
  console.log(chalk.grey(message.element.node), '\n');

  return [`${message.heading} ${message.issue}`, lineMessage, message.description, message.element.node];

};

export { generalMessage as default };
