/*
 * AccessSniff
 * https://yargalot@github.com/yargalot/AccessSniff
 *
 * Copyright (c) 2015 Steven John Miller
 * Licensed under the MIT license.
 */

var fs        = require('fs');
var path      = require('path');
var chalk     = require('chalk');
var Promise   = require('bluebird');
var _         = require('underscore');
var asset     = path.join.bind(null, __dirname, '..');
var logger    = require('./logger.js');
var reporter  = require('./reports.js');

var childProcess  = require('child_process');
var phantomPath   = require('phantomjs').path;

var _that;

function Accessibility(options) {

  this.options  = Accessibility.Defaults;
  this.basepath = process.cwd();
  this.failTask = false;

  this.log          = '';
  this.fileContents = '';

  this.messageLog   = [];

  if (this.options.accessibilityrc) {
    this.options.ignore = this.grunt.file.readJSON('.accessibilityrc').ignore;
  }

  // Extend options with input options
  _.extend(this.options, options);

  _that = this;

}

Accessibility.Defaults = {
  domElement: true,
  verbose: true,
  outputFormat: false,
  force: false,
  ignore: [],
  accessibilityrc: false,

  reportType: null,
  reportLocation : 'reports'
};


/**
* The Message Terminal, choo choo
*
*
*/

Accessibility.prototype.terminalLog = function(msg, trace) {

  var ignore   = false;
  var msgSplit = msg.split('|');
  var options = _that.options;

  // If ignore get the hell out
  _.each(options.ignore, function (value, key) {
    if (value === msgSplit[1]) {
      ignore = true;
    }
  });

  if (ignore) {
    return;
  }


  // Start the Logging
  if (msgSplit[0] === 'ERROR' || msgSplit[0] === 'NOTICE' || msgSplit[0] === 'WARNING') {

    var message = {
      heading:      msgSplit[0],
      issue:        msgSplit[1],
      element:      msgSplit[3],
      position:     this.getElementPosition(msgSplit[3]),
      description:  msgSplit[2],
    };

    this.messageLog.push(message);

    if (message.heading === 'ERROR') {
      _that.failTask = true;
    }

    if (options.verbose) {
      logger.generalMessage(message);
    }

  } else {

    //console.log(msg);

  }
};



/**
* Get Elements Line and Column Number
*
*
*/

Accessibility.prototype.getElementPosition = function(htmlString) {

  var position = {};
  var htmlArray = this.fileContents.split("\n");

  htmlArray.every(function(element, lineNumber) {
    if ( !element.match(htmlString) ) {
      return true;
    }

    var columnNumber = 0;
    var colIndex = 0;

    var pattern = /(\s|\t)/g;

    while (element.charAt(colIndex).match(pattern)) {
      columnNumber++;
      colIndex++;
    }

    position.lineNumber = lineNumber;
    position.columnNumber = columnNumber;

    return false;

  });

  return position;

};


Accessibility.prototype.parseOutput = function(file, deferred) {

  var test = file.split("\n");
  var _this = this;

  test.every(function(element, index, array) {

    var something = JSON.parse(element);

    if (something[0] === 'wcaglint.done') {
      return false;
    }

    _this.terminalLog(something[1]);
    return true;

  });

  if (this.options.reportType) {
    reporter.terminal(_this.messageLog, _this.options);
  }

  deferred.fulfill();
};


/**
* Run task
*
* @param {Object} grunt - grunt object
*
* @returns {Object} a promise that resolves with final html
*
*/

Accessibility.prototype.run = function(filesInput) {

  var files   = Promise.resolve(filesInput);
  var _this = this;

  var promiseMapOptions = {
    concurrency: 1
  };

  return files
    .bind(this)
    .map(function(file) {

      var deferredOutside = Promise.pending();
      var childArgs = [
        path.join(__dirname, './phantom.js'),
        file,
        {}
      ];

      logger.startMessage('Testing ' + childArgs[1]);

      childProcess.execFile(phantomPath, childArgs, function(err, stdout, stderr) {
        // handle results

        if (!err) {

          _this.parseOutput(stdout, deferredOutside);

          return;
        }

        deferredOutside.fulfill();
      });


      fs.readFile(file, 'utf8', function (err, data) {
        _this.fileContents = data.toString();
      });

      return deferredOutside.promise;

    }, promiseMapOptions)
    .catch(function(err) {

      console.error(err);

    })
    .finally();

};

Accessibility.start = function(files, options) {

  var task = new Accessibility(options);

  task.run(files);

};


module.exports = Accessibility;
