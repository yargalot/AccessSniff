import buildMessage from './buildMessage';
import logger from '../logger.js';

const ParseOutput = (outputMessages, fileName, fileContents, options) => {
  // Run the messages through the parser
  let messageLog = outputMessages.map(message => {

    // Each message will return as an array, [messageType, messagePipe]
    const messageType = message[0];
    const messagePipe = message[1];

    // If the type is wcaglint done hop out of the loop
    if (messageType === 'wcaglint.done') {
      return;
    }

    return buildMessage(messagePipe, fileContents, options);
  });

  // Filter out no messages
  messageLog = messageLog.filter(message => message);

  // If verbose is true then push the output through to the terminal
  let counters = {
    error: 0,
    notice: 0,
    warning: 0
  };

  const updateCounter = heading => counters[heading.toLowerCase()] ++;

  messageLog.forEach(message => {

    if (options.verbose) {
      logger.generalMessage(message);
    }

    updateCounter(message.heading);
  });

  // If there are messages then the files are not lint free
  const lintFree = (counters.error || counters.warning || counters.notice) ? false : true;

  return { fileName, lintFree, counters, messageLog };
};

export { ParseOutput as default };
