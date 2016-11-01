import rc from 'rc';
import path from 'path';
import Promise from 'bluebird';
import _ from 'underscore';
import logger from './logger';

import { buildMessage, getFileContents, NormalizeOutput } from './helpers';
import { RunPhantomInstance, RunJsDomInstance } from './runners';

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

    _.defaults(options, this.defaults);

    // Check .accessibilityrc file
    const conf = rc('accessibility', options);

    // We need to convert the report levels to uppercase
    _.each(conf.reportLevels, (value, key) => {
      if (value) {
        conf.reportLevelsArray.push(key.toUpperCase());
      }
    });

    // Assign options to this
    this.options = conf;
  }

  parseOutput(outputMessages, deferred) {
    // We need to split the input via newline to get message entries
    let messageLog = [];

    // Run the messages through the parser
    outputMessages.every(message => {

      // Each message will return as an array, [messageType, messagePipe]
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

  fileResolver(file) {
    const deferredOutside = Promise.pending();
    const { accessibilityLevel, maxBuffer, verbose } = this.options;

    // Set the filename for later
    this.options.filePath = file;
    this.options.fileName = path.basename(file, '.html');

    if (verbose) {
      logger.startMessage(`Testing ${file}`);
    }

    // Get file contents
    getFileContents(file)
      .then(data => {
        this.fileContents = data;

        if (this.options.template) {
          return RunJsDomInstance(file, accessibilityLevel);
        } else {
          return RunPhantomInstance(file, accessibilityLevel, maxBuffer);
        }
      })
      .then(data => Array.isArray(data) ? data : NormalizeOutput(data))
      .then(data => this.parseOutput(data, deferredOutside))
      .catch(error => {
        logger.generalError(`Testing ${file} failed`);
        logger.generalError(error);
        deferredOutside.reject(error);
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
          logger.lintFree(filesInput.length);
        }

        return logs;
      })
      .then(data => {
        if (!this.options.force && this.errorCount) {
          let errorString = this.errorCount > 1 ? 'errors' : 'error';
          let errorMessage = `There was ${this.errorCount} ${errorString}`;
          logger.generalError(errorMessage);

          return Promise.reject(errorMessage);
        }

        return data;
      });
  }

}
