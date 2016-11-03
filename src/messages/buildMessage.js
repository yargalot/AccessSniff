/* @flow */
import _ from 'underscore';
import getElementPosition from '../helpers/getElementPosition';

type optionObject = {
  ignore: Array<string>,
  reportLevelsArray: Array<string>
}

const ignoredCheck = (ignoredRules: [], error: string) => {
  return _.some(ignoredRules, rule => error.startsWith(rule));
};

const buildMessage = (msg: string, fileContents: string, {ignore, reportLevelsArray}: optionObject) => {
  const msgSplit = msg.split('|');
  let message;

  const ignored = ignoredCheck(ignore, msgSplit[1]);

  if (ignored) {
    return message;
  }

  // Start the Logging if the the report level matches
  if (_.contains(reportLevelsArray, msgSplit[0])) {
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

export { buildMessage as default, ignoredCheck };
