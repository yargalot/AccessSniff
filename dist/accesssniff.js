'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /*
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

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _reports = require('./reports');

var _reports2 = _interopRequireDefault(_reports);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _phantomjs = require('phantomjs');

var _phantomjs2 = _interopRequireDefault(_phantomjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var phantomPath = _phantomjs2.default.path;

var Accessibility = (function () {
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
      reportLocation: 'reports',
      accessibilityrc: false,
      accessibilityLevel: 'WCAG2A'
    };

    // Defaults options with input options
    _underscore2.default.defaults(options, this.defaults);

    if (options && options.accessibilityrc) {

      var accessRcPath = process.cwd() + '/.accessibilityrc';
      var rcOptions = _fs2.default.readFileSync(accessRcPath, 'utf8');

      options = _underscore2.default.extend(options, JSON.parse(rcOptions));
    }

    this.options = options;
  }

  /**
  * The Message Terminal, choo choo
  *
  *
  */

  _createClass(Accessibility, [{
    key: 'terminalLog',
    value: function terminalLog(msg) {

      var options = this.options;
      var message = {};
      var msgSplit = msg.split('|');
      var reportLevels = [];

      // If ignore get the hell out
      if (_underscore2.default.contains(options.ignore, msgSplit[1])) {
        return;
      }

      // Report levels
      _underscore2.default.each(options.reportLevels, function (value, key) {
        if (value) {
          reportLevels.push(key.toUpperCase());
        }
      });

      // Start the Logging
      if (_underscore2.default.contains(reportLevels, msgSplit[0])) {

        var element = {
          node: msgSplit[3],
          class: msgSplit[4],
          id: msgSplit[5]
        };

        message = {
          heading: msgSplit[0],
          issue: msgSplit[1],
          element: element,
          position: this.getElementPosition(msgSplit[3]),
          description: msgSplit[2]
        };

        if (message.heading === 'ERROR') {
          this.failTask += 1;
        }

        if (options.verbose) {
          _logger2.default.generalMessage(message);
        }
      } else {

        message = null;
      }

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
      var test = file.split('\n');
      var _this = this;
      var messageLog = [];

      test.every(function (element) {

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
        _reports2.default.terminal(messageLog, _this.options, function () {
          deferred.fulfill(messageLog);
        });
      } else {
        deferred.fulfill(messageLog);
      }
    }
  }, {
    key: 'getUrlContents',
    value: function getUrlContents(url, callback) {
      _http2.default.get(url, function (response) {

        response.setEncoding('utf8');
        response.on('data', function (data) {
          return callback(data);
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
      var isUrl = _validator2.default.isURL(file);
      var childArgs = [_path2.default.join(__dirname, './phantom.js'), file, this.options.accessibilityLevel];

      this.options.fileName = _path2.default.basename(childArgs[1], '.html');

      _logger2.default.startMessage('Testing ' + childArgs[1]);

      // Get file contents
      this.fileContents = isUrl ? this.getUrlContents(file) : this.getFileContents(file);

      // Call Phantom
      _child_process2.default.execFile(phantomPath, childArgs, function (err, stdout) {
        if (err) {
          deferredOutside.fulfill();
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
})();

exports.default = Accessibility;