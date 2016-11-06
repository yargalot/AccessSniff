/* @flow */
/*eslint-disable no-console */
import chalk from 'chalk';

const errorMessage = (errors: number): string => {
  const message = `There were ${errors} errors present`;

  console.log(chalk.red(message));

  return message;
};

export { errorMessage as default };
