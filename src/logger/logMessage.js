/* @flow */
/*eslint-disable no-console */
import chalk from 'chalk';

const log = (message: string): string => {
  console.log(message);

  return message;
};

export { log as default };
