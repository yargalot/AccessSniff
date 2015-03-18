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
    break;
  }

  heading += ' ' + message.issue;

  console.log(heading);
  console.log(chalk.cyan('Line ' + message.position.lineNumber + ' col '  + message.position.columnNumber));
  console.log(chalk.grey(message.description));
  console.log(chalk.grey('--------------------'));
  console.log(chalk.grey(message.element));
  console.log('');

  return;

};



module.exports = logger;
