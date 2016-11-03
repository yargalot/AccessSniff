/* @flow */
/*eslint-disable no-console */
import chalk from 'chalk';

const lintFree = (fileAmount: number): string => {
  const fileString = fileAmount > 1 ? 'files' : 'file';
  const message = `${fileAmount} ${fileString} lint free!`;

  console.log(chalk.green(message));

  return message;
};

export { lintFree as default };
