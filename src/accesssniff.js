/*
 * AccessSniff
 * https://yargalot@github.com/yargalot/AccessSniff
 *
 * Copyright (c) 2015 Steven John Miller
 * Licensed under the MIT license.
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import Promise from 'bluebird';
import validator from 'validator';
import _ from 'underscore';
import logger from './logger';
import childProcess from 'child_process';
import phantom from 'phantomjs';

const phantomPath = phantom.path;

export default class Accessibility {
  constructor(options) {
    this.basepath = process.cwd();
    this.failTask = 0;
    this.log          = '';
    this.fileContents = '';

    this.defaults = {
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

    // Defaults options with input options
    _.defaults(options, this.defaults);

    if (options && options.accessibilityrc) {

      const accessRcPath = `${process.cwd()}/.accessibilityrc`;
      const rcOptions = fs.readFileSync(accessRcPath, 'utf8');

      options = _.extend(options, JSON.parse(rcOptions));

    }

    this.options = options;
  }

  /**
  * The Message Terminal, choo choo
  *
  *
  */
  terminalLog(msg) {

    const msgSplit = msg.split('|');
    let message = {};
    let reportLevels = [];

    // If ignore get the hell out
    if (_.contains(this.options.ignore, msgSplit[1])) {
      return;
    }

    // Report levels
    _.each(this.options.reportLevels, (value, key) => {
      if (value) {
        reportLevels.push(key.toUpperCase());
      }
    });

    // Start the Logging
    if (_.contains(reportLevels, msgSplit[0])) {

      const element = {
        node:   msgSplit[3],
        class:  msgSplit[4],
        id:     msgSplit[5]
      };

      message = {
        heading:      msgSplit[0],
        issue:        msgSplit[1],
        element:      element,
        position:     this.getElementPosition(msgSplit[3]),
        description:  msgSplit[2]
      };

      if (message.heading === 'ERROR') {
        this.failTask += 1;
      }

      if (this.options.verbose) {
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

    htmlArray.every((element, lineNumber) => {
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
    var messageLog = [];

    test.every(element => {

      var something = JSON.parse(element);

      if (something[0] === 'wcaglint.done') {
        return false;
      }

      var message = this.terminalLog(something[1]);

      if (message) {
        messageLog.push(message);
      }

      return true;

    });

    deferred.fulfill(messageLog);
  }

  getUrlContents(url) {
    return new Promise(function(resolve, reject) {
      axios
        .get(url)
        .then(response => resolve(response))
        .catch(response => reject(response));
    });
  }

  getFileContents(file) {
    return fs.readFileSync(file, 'utf8');
  }

  fileResolver(file) {

    const deferredOutside = Promise.pending();
    const isUrl = validator.isURL(file);
    const childArgs = [
      path.join(__dirname, './phantom.js'),
      file,
      this.options.accessibilityLevel
    ];

    this.options.fileName = path.basename(childArgs[1], '.html');

    logger.startMessage('Testing ' + childArgs[1]);

    // Get file contents
    if (isUrl) {
      this.getUrlContents(file)
        .then(data => this.fileContents = data.data)
        .bind(this);
    } else {
      this.fileContents = this.getFileContents(file);
    }

    // Call Phantom
    childProcess
      .execFile(phantomPath, childArgs, (err, stdout) => {
        if (err) {
          deferredOutside.fulfill();
        }

        this.parseOutput(stdout, deferredOutside);
      });

    return deferredOutside.promise;

  }

  run(filesInput) {
    const files = Promise.resolve(filesInput);

    return files
      .bind(this)
      .map(this.fileResolver, { concurrency: 1 })
      .then(messageLog =>  messageLog)
      .catch(err => {
        logger.generalError('There was an error', err);
        return err;
      });
  }

}
