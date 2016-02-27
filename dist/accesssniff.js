'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * AccessSniff
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * https://yargalot@github.com/yargalot/AccessSniff
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright (c) 2015 Steven John Miller
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under the MIT license.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _phantomjsPrebuilt = require('phantomjs-prebuilt');

var _phantomjsPrebuilt2 = _interopRequireDefault(_phantomjsPrebuilt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Accessibility = function () {
  function Accessibility(options) {
    _classCallCheck(this, Accessibility);

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
      verbose: false,
      force: false,
      domElement: true,
      reportType: null,
      reportLevels: {
        notice: true,
        warning: true,
        error: true
      },
      reportLevelsArray: [],
      reportLocation: '',
      accessibilityrc: true,
      accessibilityLevel: 'WCAG2A',
      maxBuffer: 500 * 1024
    };

    // Defaults options with input options
    _underscore2.default.defaults(options, this.defaults);

    // Find the accessibilityRc file
    var accessRcPath = this.basepath + '/.accessibilityrc';

    if (_fs2.default.exists(accessRcPath) && options.accessibilityrc) {
      var rcOptions = _fs2.default.readFileSync(accessRcPath, 'utf8');

      if (rcOptions) {
        options = _underscore2.default.extend(options, JSON.parse(rcOptions));
      }
    }

    // We need to convert the report levels to uppercase
    _underscore2.default.each(options.reportLevels, function (value, key) {
      if (value) {
        options.reportLevelsArray.push(key.toUpperCase());
      }
    });

    // Assign options to this
    this.options = options;
  }

  _createClass(Accessibility, [{
    key: 'terminalLog',
    value: function terminalLog(msg) {
      var msgSplit = msg.split('|');
      var message = {};

      // If the level type is ignored, then return null;
      if (_underscore2.default.contains(this.options.ignore, msgSplit[1])) {
        return null;
      }

      // Start the Logging if the the report level matches
      if (_underscore2.default.contains(this.options.reportLevelsArray, msgSplit[0])) {
        message = {
          heading: msgSplit[0],
          issue: msgSplit[1],
          element: {
            node: msgSplit[3],
            class: msgSplit[4],
            id: msgSplit[5]
          },
          position: this.getElementPosition(msgSplit[3]),
          description: msgSplit[2]
        };
      } else {
        message = null;
      }

      // If there is an error +1 the error stuff
      if (message && message.heading === 'ERROR') {
        this.errorCount += 1;
      }

      // If there is an error +1 the error stuff
      if (message && message.heading === 'NOTICE') {
        this.noticeCount += 1;
      }

      // If there is an error +1 the error stuff
      if (message && message.heading === 'WARNING') {
        this.warningCount += 1;
      }

      // Return the message for reports
      return message;
    }
  }, {
    key: 'getElementPosition',
    value: function getElementPosition(htmlString) {
      var position = {
        lineNumber: 0,
        columnNumber: 0
      };

      var indexAt = this.fileContents.indexOf(htmlString);
      var before = this.fileContents.slice(0, indexAt);
      var stringArray = before.split(/\r\n|\r|\n/);

      if (indexAt === -1) {
        return position;
      }

      position.lineNumber = stringArray.length;
      position.columnNumber = stringArray[position.lineNumber - 1].length;

      return position;
    }
  }, {
    key: 'parseOutput',
    value: function parseOutput(file, deferred) {
      var _this = this;

      // We need to split the input via newline to get message entries
      var fileMessages = file.split('\n');
      var messageLog = [];

      // Run the messages through the parser
      fileMessages.every(function (messageString) {
        // Each message will return as an array, [messageType, messagePipe]
        // Message Pipe needs to be sent through to the terminal for parsing
        var message = JSON.parse(messageString);
        var messageType = message[0];
        var messagePipe = message[1];

        // If the type is wcaglint done hop out of the loop
        if (messageType === 'wcaglint.done') {
          return false;
        }

        // Check to see if the message is an array, and then send it
        //through to the terminal
        var messageOuput = Array.isArray(message) && _this.terminalLog(messagePipe);

        // Push the returned message to the messageLog
        // Message output could be null so we dont need to push that
        if (messageOuput) {
          messageLog.push(messageOuput);
        }

        return true;
      });

      // If verbose is true then push the output through to the terminal
      var showMessage = this.errorCount || this.noticeCount || this.warningCount;

      if (showMessage && messageLog.length || this.options.verbose) {
        _logger2.default.startMessage('Tested ' + this.options.filePath);
        messageLog.forEach(function (message) {
          return _logger2.default.generalMessage(message);
        });
        this.lintFree = false;
      }

      // Fullfill the passed promise
      deferred.resolve(messageLog);
    }
  }, {
    key: 'getUrlContents',
    value: function getUrlContents(url) {
      return new _bluebird2.default(function (resolve, reject) {
        _axios2.default.get(url).then(function (response) {
          return resolve(response);
        }).catch(function (response) {
          return reject(response);
        });
      });
    }
  }, {
    key: 'getFileContents',
    value: function getFileContents(file) {
      return _fs2.default.readFileSync(file, 'utf8');
    }
  }, {
    key: 'fileResolver',
    value: function fileResolver(file) {
      var _this2 = this;

      var deferredOutside = _bluebird2.default.pending();

      // Set the filename for later
      this.options.filePath = file;
      this.options.fileName = _path2.default.basename(file, '.html');

      if (this.options.verbose) {
        _logger2.default.startMessage('Testing ' + this.options.filePath);
      }

      // Get file contents
      if (_validator2.default.isURL(file)) {
        this.getUrlContents(file).then(function (data) {
          return _this2.fileContents = data.data;
        });
      } else if (_fs2.default.existsSync(file)) {
        this.fileContents = this.getFileContents(file);
      } else {
        this.fileContents = file;
      }

      // Call Phantom
      _child_process2.default.execFile(_phantomjsPrebuilt2.default.path, [_path2.default.join(__dirname, './phantom.js'), file, this.options.accessibilityLevel], { maxBuffer: this.options.maxBuffer }, function (error, stdout) {
        if (error) {
          _logger2.default.generalError('Testing ' + _this2.options.filePath + ' failed');
          _logger2.default.generalError(error);
          deferredOutside.reject(error);
        }

        _this2.parseOutput(stdout, deferredOutside);
      });

      return deferredOutside.promise;
    }
  }, {
    key: 'run',
    value: function run(filesInput) {
      var _this3 = this;

      var files = _bluebird2.default.resolve(filesInput);

      if (this.options.verbose) {
        _logger2.default.startMessage('Starting Accessibility tests');
      }

      return files.bind(this).map(this.fileResolver, { concurrency: 1 }).then(function (messageLog) {
        var logs = {};

        filesInput.forEach(function (fileName, index) {
          return logs[fileName] = messageLog[index];
        });

        if (_this3.lintFree) {
          var fileString = filesInput.length > 1 ? 'files' : 'file';
          _logger2.default.lintFree(filesInput.length + ' ' + fileString + ' lint free!');
        }

        return logs;
      }).then(function (data) {
        if (!_this3.options.force && _this3.errorCount) {
          var errorMessage = 'There was ' + _this3.errorCount + ' error';

          if (_this3.errorCount > 1) {
            errorMessage = 'There was ' + _this3.errorCount + ' errors';
          }

          _logger2.default.generalError(errorMessage);

          return _bluebird2.default.reject(errorMessage);
        }

        return data;
      });
    }
  }]);

  return Accessibility;
}();

exports.default = Accessibility;