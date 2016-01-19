var AccessSniff = require('../dist');
var fs = require('fs');
/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.accessibilityTests = {
  setUp: done => {
    // setup here if necessary
    done();
  },
  overall_testFile: test => {
    var target = './test/examples/test.html';
    var expected = fs.readFileSync('./test/expected/test.json', 'utf8');

    AccessSniff.default(target)
      .then(report => {
        test.deepEqual(report[target], JSON.parse(expected), 'Should produce a json report for test.html');
        test.expect(1);
        test.done();
      });

  },
  overall_testUrl: test => {
    var target = 'http://getbootstrap.com/';

    AccessSniff.default([target], {})
      .then(report => {
        test.ok(report[target], 'Should produce a json report from boostrap');
        test.expect(1);
        test.done();
      });
  },
  overall_testString: test => {
    var testString = '<html><body><h1>helloworld<h1></body></html>';

    AccessSniff.default([testString], {})
      .then(report => {
        test.ok(report[testString], 'Should produce a json report for html string');
        test.expect(1);
        test.done();
      });
  }
};
