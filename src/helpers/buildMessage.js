/* @flow */

import _ from 'underscore';
import getElementPosition from './getElementPosition';

type optionObject = {
  ignore: Array<string>,
  reportLevelsArray: Array<string>
}

const buildMessage = (msg: string, fileContents: string, options: optionObject) => {
  const msgSplit = msg.split('|');
  let message;

  // If the level type is ignored, then return null;
  if (_.contains(options.ignore, msgSplit[1])) {
    return message;
  }

  // Start the Logging if the the report level matches
  if (_.contains(options.reportLevelsArray, msgSplit[0])) {
    message = {
      heading: msgSplit[0],
      issue: msgSplit[1],
      description: msgSplit[2],
      position: getElementPosition(msgSplit[3], fileContents),
      element: {
        node: msgSplit[3],
        class: msgSplit[4],
        id: msgSplit[5]
      }
    };
  }

  // Return the message for reports
  return message;

};

export { buildMessage as default };
