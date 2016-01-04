/*
 * AccessSniff
 * https://yargalot@github.com/yargalot/AccessSniff
 *
 * Copyright (c) 2015 Steven John Miller
 * Licensed under the MIT license.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import Promise from 'bluebird';
import validator from 'validator';
import _ from 'underscore';
import logger from './logger';
import reporter from './reports';
import childProcess from 'child_process';
import phantom from 'phantomjs';

const phantomPath = phantom.path;
const asset = path.join.bind(null, __dirname, '..');

export default class Accessibility {
  constructor(options) {
    this.basepath = process.cwd();
    this.failTask = 0;
    this.log          = '';
    this.fileContents = '';

    this.Defaults = {
      ignore: [],
      verbose: true,
      force: false,
      domElement: true,
      reportType: null,
      reportLevels: {
        notice: true,
        warning: true,
        error: true
      },
      reportLocation : 'reports',
      accessibilityrc: false,
      accessibilityLevel: 'WCAG2A'
    };

    if (options.accessibilityrc) {

      const accessRcPath = `${process.cwd()}/.accessibilityrc`;
      const rcOptions = fs.readFileSync(
        accessRcPath,
        'utf8',
        (err, data) => err ? console.error(err) : data
      );

      options = _.extend(options, JSON.parse(rcOptions));

    }
    // Defaults options with input options
    _.defaults(options, Accessibility.Defaults);

    this.options = options;
  }

  /**
  * The Message Terminal, choo choo
  *
  *
  */
  terminalLog(msg, trace) {

    var options = this.options;
    var message = {};
    var msgSplit = msg.split('|');
    var reportLevels = [];

    // If ignore get the hell out
    if (_.contains(options.ignore, msgSplit[1])) {
      return;
    }

    // Report levels
    _.each(options.reportLevels, function(value, key, list) {
      if (value) {
        reportLevels.push(key.toUpperCase());
      }
    });

    // Start the Logging
    if (_.contains(reportLevels, msgSplit[0])) {

      var element = {
        node:   msgSplit[3],
        class:  msgSplit[4],
        id:     msgSplit[5]
      };

      message = {
        heading:      msgSplit[0],
        issue:        msgSplit[1],
        element:      element,
        position:     this.getElementPosition(msgSplit[3]),
        description:  msgSplit[2],
      };

      if (message.heading === 'ERROR') {
        this.failTask += 1;
      }

      if (options.verbose) {
        logger.generalMessage(message);
      }

    } else {

      message = null;

    }

    return message;

  }

  getElementPosition(htmlString) {

    var position = {};
    var htmlArray = this.fileContents.split('\n');

    htmlArray.every(function(element, lineNumber) {
      if (!element.match(htmlString)) {
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

  }

  parseOutput(file, deferred) {

    var test = file.split('\n');
    var _this = this;
    var messageLog = [];

    test.every(function(element, index, array) {

      var something = JSON.parse(element);

      if (something[0] === 'wcaglint.done') {
        return false;
      }

      var message = _this.terminalLog(something[1]);

      if (message) {
        messageLog.push(message);
      }

      return true;

    });

    if (this.options.reportType) {
      reporter.terminal(messageLog, _this.options, function() {
        deferred.fulfill(messageLog);
      });
    } else {
      deferred.fulfill(messageLog);
    }

  }

  getContents(file, callback) {

    var contents;
    var isUrl = validator.isURL(file);

    if (isUrl) {
      http.get(file, function(response) {

        response.setEncoding('utf8');

        response.on('data', function(data) {
          callback(data);
        });

      });
    } else {
      fs.readFile(file, 'utf8', (err, data) => callback(data.toString()));
    }

  }

  run(filesInput, callback) {

    var files = Promise.resolve(filesInput);
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
          this.options.accessibilityLevel
        ];

        this.options.fileName = path.basename(childArgs[1], '.html');

        logger.startMessage('Testing ' + childArgs[1]);

        // Get file contents
        this.getContents(file, function(contents) {
          _this.fileContents = contents;
        });

        // Call Phantom
        childProcess.execFile(phantomPath, childArgs, function(err, stdout, stderr) {

          if (err) {
            deferredOutside.fulfill();
          }

          _this.parseOutput(stdout, deferredOutside);

        });

        return deferredOutside.promise;

      }, promiseMapOptions)
      .then(function(messageLog, error) {

        if (typeof callback === 'function') {
          callback(messageLog, _this.failTask);
        }

        return true;

      })
      .catch(function(err) {

        console.error('There was an error');
        console.error(err);

        return err;

      });
  }

}
