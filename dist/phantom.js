'use strict';

/* eslint-disable no-console */
/* global HTMLCS_RUNNER, phantom */

var page = require('webpage').create();
var system = require('system');

var args = system.args;
var url = args[1];
var options = args[2];

var sendMessage = function sendMessage(arg) {
  var args = Array.isArray(arg) ? arg : [].slice.call(arguments);
  var channel = args[0];
  args[0] = channel;

  console.log(JSON.stringify(args));
};
// Create a new page.
// --------------------

// Relay console logging messages.
page.onConsoleMessage = function (message) {

  if (message === 'done') {
    sendMessage('wcaglint.done', options);
  } else {
    sendMessage('console', message);
  }
};

page.onError = function (msg, trace) {
  sendMessage('error', msg, trace);
};

page.onInitialized = function () {
  sendMessage('console', 'Page Loading...');
};

page.onLoadFinished = function () {
  sendMessage('console', 'Page Loaded. Starting Tests');
};

page.open(url, function () {

  page.injectJs('./HTMLCS.min.js');

  // Now Run. Note that page.evaluate() function is sanboxed to
  // the loaded page's context. We can't pass any variable to it.

  switch (options) {
    case 'WCAG2A':
      page.evaluate(function () {
        return HTMLCS_RUNNER.run('WCAG2A');
      });
      break;
    case 'WCAG2AA':
      page.evaluate(function () {
        return HTMLCS_RUNNER.run('WCAG2AA');
      });
      break;
    case 'WCAG2AAA':
      page.evaluate(function () {
        return HTMLCS_RUNNER.run('WCAG2AAA');
      });
      break;
    default:
      console.log('Unknown standard.');
  }

  phantom.exit();
});