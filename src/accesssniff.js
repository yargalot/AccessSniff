import fs from 'fs';
import path from 'path';
import axios from 'axios';
import Promise from 'bluebird';
import validator from 'validator';
import _ from 'underscore';
import logger from './logger';
import childProcess from 'child_process';
import phantom from 'phantomjs-prebuilt';

import { buildMessage } from './helpers';

export default class Accessibility {
  constructor(options) {
    this.basepath = process.cwd();

    // Count the errors and stuff
    this.errorCount = 0;
    this.noticeCount = 0;
    this.warningCount = 0;

    // Mark for if all the tests were lint free
    this.lintFree = true;

    this.log = '';
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
      reportLevelsArray: [],
      reportLocation : '',
      accessibilityrc: true,
      accessibilityLevel: 'WCAG2A',
      maxBuffer: 500*1024
    };

    // Defaults options with input options
    _.defaults(options, this.defaults);

    // Find the accessibilityRc file
    const accessRcPath = `${this.basepath}/.accessibilityrc`;

    if (fs.existsSync(accessRcPath) && options.accessibilityrc) {
      const rcOptions = fs.readFileSync(accessRcPath, 'utf8');

      if (rcOptions) {
        options = _.extend(options, JSON.parse(rcOptions));
      }
    }

    // We need to convert the report levels to uppercase
    _.each(options.reportLevels, (value, key) => {
      if (value) {
        options.reportLevelsArray.push(key.toUpperCase());
      }
    });

    // Assign options to this
    this.options = options;
  }

  parseOutput(file, deferred) {
    // We need to split the input via newline to get message entries
    const fileMessages = file.split('\n');
    let messageLog = [];

    // Run the messages through the parser
    fileMessages.every(messageString => {
      // Each message will return as an array, [messageType, messagePipe]
      // Message Pipe needs to be sent through to the terminal for parsing
      const message = JSON.parse(messageString);
      const messageType = message[0];
      const messagePipe = message[1];

      // If the type is wcaglint done hop out of the loop
      if (messageType === 'wcaglint.done') {
        return false;
      }

      // Check to see if the message is an array, and then send it
      //through to the terminal
      let messageOuput;
      if (Array.isArray(message)) {
        messageOuput = buildMessage(messagePipe, this.fileContents, this.options);
      }

      // Push the returned message to the messageLog
      // Message output could be null so we dont need to push that
      if (messageOuput) {
        messageLog.push(messageOuput);

        // If there is an error +1 the error stuff
        if (messageOuput.heading === 'ERROR') {
          this.errorCount += 1;
        }

        // If there is an error +1 the error stuff
        if (messageOuput.heading === 'NOTICE') {
          this.noticeCount += 1;
        }

        // If there is an error +1 the error stuff
        if (messageOuput.heading === 'WARNING') {
          this.warningCount += 1;
        }
      }

      return true;

    });

    // If there are messages then the files are not lint free
    this.lintFree = this.errorCount ||  this.noticeCount || this.warningCount ? true : false;

    // If verbose is true then push the output through to the terminal
    if (this.lintFree && this.options.verbose) {
      logger.startMessage(`Tested ${this.options.filePath}`);
      messageLog.forEach(message => logger.generalMessage(message));
    }

    // Fullfill the passed promise
    deferred.resolve(messageLog);
  }

  getUrlContents(url) {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(response => resolve(response))
        .catch(response => reject(response));
    });
  }

  fileResolver(file) {
    const deferredOutside = Promise.pending();

    // Set the filename for later
    this.options.filePath = file;
    this.options.fileName = path.basename(file, '.html');

    if (this.options.verbose) {
      logger.startMessage(`Testing ${this.options.filePath}`);
    }

    // Get file contents
    if (validator.isURL(file)) {
      this.getUrlContents(file).then(data => this.fileContents = data.data);
    } else if (fs.existsSync(file)) {
      this.fileContents = fs.readFileSync(file, 'utf8');
    } else {
      this.fileContents = file;
    }

    // Call Phantom
    childProcess
      .execFile(phantom.path, [
        path.join(__dirname, './phantom.js'),
        file,
        this.options.accessibilityLevel
      ], {maxBuffer: this.options.maxBuffer}, (error, stdout) => {
        if (error) {
          logger.generalError(`Testing ${this.options.filePath} failed`);
          logger.generalError(error);
          deferredOutside.reject(error);
        }

        this.parseOutput(stdout, deferredOutside);
      });

    return deferredOutside.promise;
  }

  run(filesInput) {
    const files = Promise.resolve(filesInput);

    if (this.options.verbose) {
      logger.startMessage('Starting Accessibility tests');
    }

    return files
      .bind(this)
      .map(this.fileResolver, { concurrency: 1 })
      .then(messageLog => {
        let logs = {};

        filesInput.forEach((fileName, index) => logs[fileName] = messageLog[index]);

        if (this.lintFree) {
          const fileString = filesInput.length > 1 ? 'files' : 'file';
          logger.lintFree(`${filesInput.length} ${fileString} lint free!`);
        }

        return logs;
      })
      .then(data => {
        if (!this.options.force && this.errorCount) {
          let errorMessage = `There was ${this.errorCount} error`;

          if (this.errorCount > 1) {
            errorMessage = `There was ${this.errorCount} errors`;
          }

          logger.generalError(errorMessage);

          return Promise.reject(errorMessage);
        }

        return data;
      });
  }

}
