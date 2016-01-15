'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * AccessSniff
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * https://yargalot@github.com/yargalot/AccessSniff
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright (c) 2015 Steven John Miller
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under the MIT license.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _phantomjs = require('phantomjs');

var _phantomjs2 = _interopRequireDefault(_phantomjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Accessibility = function () {
  function Accessibility(options) {
    _classCallCheck(this, Accessibility);

    this.basepath = process.cwd();
    this.failTask = 0;
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
      reportLocation: 'reports',
      accessibilityrc: true,
      accessibilityLevel: 'WCAG2A'
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
        this.failTask += 1;
      }

      // If verbose is true then push the output through to the terminal
      if (message && this.options.verbose) {
        _logger2.default.generalMessage(message);
      }

      // Return the message for reports
      return message;
    }
  }, {
    key: 'getElementPosition',
    value: function getElementPosition(htmlString) {
      var position = {};
      var htmlArray = this.fileContents.split('\n');

      htmlArray.every(function (element, lineNumber) {
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
  }, {
    key: 'parseOutput',
    value: function parseOutput(file, deferred) {
      var _this = this;

      // We need to split the input via newline to get message entries
      var fileMessages = file.split('\n');
      var messageLog = [];

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

      // Fullfill the passed promise
      deferred.fulfill(messageLog);
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
      this.options.fileName = _path2.default.basename(file, '.html');

      // Start Message
      _logger2.default.startMessage('Testing ' + file);

      // Get file contents
      if (_validator2.default.isURL(file)) {
        this.getUrlContents(file).then(function (data) {
          return _this2.fileContents = data.data;
        });
      } else {
        this.fileContents = this.getFileContents(file);
      }

      // Call Phantom
      _child_process2.default.execFile(_phantomjs2.default.path, [_path2.default.join(__dirname, './phantom.js'), file, this.options.accessibilityLevel], function (error, stdout) {
        if (error) {
          _logger2.default.generError(error);
          deferredOutside.fulfill(error);
        }

        _this2.parseOutput(stdout, deferredOutside);
      });

      return deferredOutside.promise;
    }
  }, {
    key: 'run',
    value: function run(filesInput) {
      var files = _bluebird2.default.resolve(filesInput);

      return files.bind(this).map(this.fileResolver, { concurrency: 1 }).then(function (messageLog) {
        return messageLog;
      }).catch(function (err) {
        _logger2.default.generalError('There was an error', err);
        return err;
      });
    }
  }]);

  return Accessibility;
}();

exports.default = Accessibility;