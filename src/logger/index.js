/* @flow */

import generalMessage from './generalMessage';
import startMessage from './startMessage';
import finishedMessage from './finishedMessage';
import lintFree from './lintMessage';
import errorMessage from './errorMessage';
import generalError from './generalErrorMessage';
import log from './logMessage';

let logger = { generalMessage, startMessage, finishedMessage, lintFree, errorMessage, generalError, log };

export { logger as default, generalMessage, startMessage, finishedMessage, lintFree, errorMessage, generalError, log };
