var reports = {};

reports.terminal = function(messageLog, options) {
  console.log(options);

};


reports.reportJson = function() {
  var currentLog  = [];

  currentLog.push({
    type: msgSplit[0],
    msg: msgSplit[2],
    sc: msgSplit[1].split('.')[3],
    technique: msgSplit[1].split('.')[4]
  });

  if (options.domElement) {
    currentLog[currentLog.length - 1].element = {
      nodeName: msgSplit[3],
      className: msgSplit[4],
      id: msgSplit[5]
    };
  }

  return currentLog;
};


reports.reportText = function() {


};


reports.reportCsv = function() {


};

reports.writeFile = function() {

  var options = _that.options;


  // Write messages to console
  function logFinishedMesage() {
    console.log(chalk.cyan('Report Finished'));
    grunt.log.writeln('File "' + options.filedest +
      (options.outputFormat ? '.' + options.outputFormat : '') + '" created.');
  }

  // Write the files
  switch (options.outputFormat) {
    case 'json':
      grunt.file.write(options.filedest + '.json', JSON.stringify(_that.logJSON[options.file]));
      logFinishedMesage();
    break;

    case 'txt':
      grunt.file.write(options.filedest + '.txt' , _that.log);
      logFinishedMesage();
    break;
  }


  if (_that.failTask && !options.force) {
    console.log('Task failed');
  }

};

module.exports = reports;
