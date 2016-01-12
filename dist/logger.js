'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Init Logger object
var logger = {};
/*eslint-disable no-console */

logger.generalMessage = function (message) {

  var heading = '';

  switch (message.heading) {
    case 'ERROR':
      heading = _chalk2.default.red.bold(message.heading);
      break;
    case 'NOTICE':
      heading = _chalk2.default.blue.bold(message.heading);
      break;
    default:
      heading = _chalk2.default.yellow.bold(message.heading);
  }

  heading += ' ' + message.issue;

  console.log(heading);
  console.log(_chalk2.default.cyan('Line ' + message.position.lineNumber + ' col ' + message.position.columnNumber));
  console.log(_chalk2.default.grey(message.description));
  console.log(_chalk2.default.grey('--------------------'));
  console.log(_chalk2.default.grey(message.element.node));
  console.log('');

  return;
};

logger.startMessage = function (message) {

  console.log(_chalk2.default.white.underline(message));
  console.log('');
};

logger.finishedMessage = function (filePath) {

  if (filePath) {
    console.log(_chalk2.default.cyan('File "' + filePath + '" created.'));
  }

  console.log(_chalk2.default.cyan('Report Finished'));
};

logger.errorMessage = function (errors) {
  console.log(_chalk2.default.red('There were ' + errors + ' errors present'));
};

logger.generalError = function (error) {
  console.error(error);
};

module.exports = logger;