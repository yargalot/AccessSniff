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
    var expected = fs.readFileSync('./test/expected/test.json', 'utf8');

    AccessSniff.default('./test/examples/test.html')
      .then(report => {
        test.deepEqual(report[0], JSON.parse(expected), 'Should produce a json report for test.html');
        test.expect(1);
        test.done();
      });

  },
  overall_testUrl: test => {
    AccessSniff.default(['http://getbootstrap.com/'], {})
      .then(report => {
        test.ok(report[0], 'Should produce a json report from boostrap');
        test.expect(1);
        test.done();
      });
  },
  report_JSON: test => {
    AccessSniff.default(['./test/examples/test.html'], {})
      .then(report => AccessSniff.report(report))
      .then(() => {
        test.done();
      });
  }
};
