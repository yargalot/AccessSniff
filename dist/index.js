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

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _logger = require('./logger.js');

var _logger2 = _interopRequireDefault(_logger);

var _reports = require('./reports.js');

var _reports2 = _interopRequireDefault(_reports);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _phantomjs = require('phantomjs');

var _phantomjs2 = _interopRequireDefault(_phantomjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var phantomPath = _phantomjs2.default.path;
var asset = _path2.default.join.bind(null, __dirname, '..');

var Accessibility = (function () {
  function Accessibility(options) {
    _classCallCheck(this, Accessibility);

    this.basepath = process.cwd();
    this.failTask = 0;
    this.log = '';
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
      reportLocation: 'reports',
      accessibilityrc: false,
      accessibilityLevel: 'WCAG2A'
    };

    if (options.accessibilityrc) {

      var accessRcPath = process.cwd() + '/.accessibilityrc';
      var rcOptions = _fs2.default.readFileSync(accessRcPath, 'utf8', function (err, data) {
        return err ? console.error(err) : data;
      });

      options = _underscore2.default.extend(options, JSON.parse(rcOptions));
    }
    // Defaults options with input options
    _underscore2.default.defaults(options, Accessibility.Defaults);

    this.options = options;
  }

  /**
  * The Message Terminal, choo choo
  *
  *
  */

  _createClass(Accessibility, [{
    key: 'terminalLog',
    value: function terminalLog(msg, trace) {

      var options = this.options;
      var message = {};
      var msgSplit = msg.split('|');
      var reportLevels = [];

      // If ignore get the hell out
      if (_underscore2.default.contains(options.ignore, msgSplit[1])) {
        return;
      }

      // Report levels
      _underscore2.default.each(options.reportLevels, function (value, key, list) {
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

      test.every(function (element, index, array) {

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
    key: 'getContents',
    value: function getContents(file, callback) {

      var contents;
      var isUrl = _validator2.default.isURL(file);

      if (isUrl) {
        _http2.default.get(file, function (response) {

          response.setEncoding('utf8');

          response.on('data', function (data) {
            callback(data);
          });
        });
      } else {
        _fs2.default.readFile(file, 'utf8', function (err, data) {
          return callback(data.toString());
        });
      }
    }
  }, {
    key: 'run',
    value: function run(filesInput, callback) {

      var files = _bluebird2.default.resolve(filesInput);
      var _this = this;

      var promiseMapOptions = {
        concurrency: 1
      };

      return files.bind(this).map(function (file) {

        var deferredOutside = _bluebird2.default.pending();

        var childArgs = [_path2.default.join(__dirname, './phantom.js'), file, this.options.accessibilityLevel];

        this.options.fileName = _path2.default.basename(childArgs[1], '.html');

        _logger2.default.startMessage('Testing ' + childArgs[1]);

        // Get file contents
        this.getContents(file, function (contents) {
          _this.fileContents = contents;
        });

        // Call Phantom
        _child_process2.default.execFile(phantomPath, childArgs, function (err, stdout, stderr) {

          if (err) {
            deferredOutside.fulfill();
          }

          _this.parseOutput(stdout, deferredOutside);
        });

        return deferredOutside.promise;
      }, promiseMapOptions).then(function (messageLog, error) {

        if (typeof callback === 'function') {
          callback(messageLog, _this.failTask);
        }

        return true;
      }).catch(function (err) {

        console.error('There was an error');
        console.error(err);

        return err;
      });
    }
  }], [{
    key: 'start',
    value: function start(files, options, callback) {

      var task = new Accessibility(options);

      return task.run(files, callback);
    }
  }]);

  return Accessibility;
})();

exports.default = Accessibility;