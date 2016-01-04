'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _accesssniff = require('./accesssniff');

var _accesssniff2 = _interopRequireDefault(_accesssniff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (files, options, callback) {

  var task = new _accesssniff2.default(options);

  return task.run(files, callback);
};