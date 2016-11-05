/* @flow */

import _ from 'underscore';

type reportLevelsObject = {
  error: boolean,
  warning: boolean,
  notice: boolean
}

const generateReportLevels = (reportLevels: reportLevelsObject) => {
  let reportLevelsArray = [];

  // We need to convert the report levels to uppercase
  _.each(reportLevels, (value, key) => {
    if (value) {
      reportLevelsArray.push(key.toUpperCase());
    }
  });

  return reportLevelsArray;
};

export { generateReportLevels as default };
