/* global HTMLCS, document */
/* eslint-disable no-console */
/*eslint no-unused-vars: 0*/

const output = (msg) => {
  let typeName = 'UNKNOWN';

  switch (msg.type) {
    case HTMLCS.ERROR: {
      typeName = 'ERROR';
      break;
    }
    case HTMLCS.WARNING: {
      typeName = 'WARNING';
      break;
    }

    case HTMLCS.NOTICE: {
      typeName = 'NOTICE';
      break;
    }
  }

  const element = msg.element;
  const message = [
    typeName, msg.code, msg.msg, element.outerHTML, element.className, element.id
  ].join('|');

  console.log(message);

  return message;
};

class Runner {
  constructor(options) {}

  run(standard) {
    let messages = [];

    // At the moment, it passes the whole DOM document.
    HTMLCS.process(standard, document, () => {
      messages = HTMLCS.getMessages();
      messages = messages.map((message) => output(message), this);
      console.log('done');
    });

    return messages;
  }
}

var HTMLCS_RUNNER = new Runner();
