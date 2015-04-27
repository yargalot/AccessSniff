var chalk  = require('chalk');
var logger = {};

logger.generalMessage =  function(message) {

  var heading;

  switch (message.heading) {
    case 'ERROR':
      heading = chalk.red.bold(message.heading);
      break;
    case 'NOTICE':
      heading = chalk.blue.bold(message.heading);
      break;
    default:
      heading = chalk.yellow.bold(message.heading);
  }

  heading += ' ' + message.issue;

  console.log(heading);
  console.log(chalk.cyan('Line ' + message.position.lineNumber + ' col '  + message.position.columnNumber));
  console.log(chalk.grey(message.description));
  console.log(chalk.grey('--------------------'));
  console.log(chalk.grey(message.element.node));
  console.log('');

  return;

};

logger.startMessage = function(message) {

  console.log(chalk.white.underline(message));
  console.log('');

};

logger.finishedMessage = function(filePath) {

  console.log(chalk.cyan('File "' + filePath + '" created.'));
  console.log(chalk.cyan('Report Finished'));

};

logger.errorMessage = function(errors) {

  console.log(chalk.red('There were ' + errors + ' errors present'));

};

module.exports = logger;
