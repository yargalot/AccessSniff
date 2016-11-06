/* @flow */
/*eslint-disable no-console */
import chalk from 'chalk';

const startMessage = (message: string): string => {
  console.log(chalk.white.underline(message), '\n');

  return message;
};

export { startMessage as default };
