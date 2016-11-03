/* @flow */
/*eslint-disable no-console */
import chalk from 'chalk';

const generalError = (error: string): string => {

  console.error(chalk.red(error));

  return error;
};

export { generalError as default };
