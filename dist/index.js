'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _accesssniff = require('./accesssniff');

var _accesssniff2 = _interopRequireDefault(_accesssniff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (files) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var callback = arguments[2];

  var task = new _accesssniff2.default(options || {});

  return task.run(files).then(function (data) {
    return callback && callback(data);
  });
};