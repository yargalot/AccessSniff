'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Init Logger object
var logger = {};
/*eslint-disable no-console */


logger.generalMessage = function (message) {

  var heading = '';
  var lineMessage = 'Line:' + message.position.lineNumber + ' Col:' + message.position.columnNumber;

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
  if (message.position.lineNumber || message.position.columnNumber) {
    console.log(_chalk2.default.cyan(lineMessage));
  }
  console.log(_chalk2.default.grey(message.description));
  console.log(_chalk2.default.grey('--------------------'));
  console.log(_chalk2.default.grey(message.element.node), '\n');

  return [message.heading + ' ' + message.issue, lineMessage, message.description, message.element.node];
};

logger.startMessage = function (message) {

  console.log(_chalk2.default.white.underline(message), '\n');

  return message;
};

logger.finishedMessage = function (filePath) {

  var message = 'Report Finished';

  if (filePath) {
    message = 'File "' + filePath + '" created. ' + message;
  }

  console.log(_chalk2.default.cyan(message));

  return message;
};

logger.lintFree = function (message) {

  console.log(_chalk2.default.green(message));

  return message;
};

logger.errorMessage = function (errors) {
  var message = 'There were ' + errors + ' errors present';

  console.log(_chalk2.default.red(message));

  return message;
};

logger.generalError = function (error) {

  console.error(_chalk2.default.red(error));

  return _chalk2.default.red(error);
};

logger.log = function (message) {

  console.log(message);

  return message;
};

exports.default = logger;