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
  report_JSON: test => {
    AccessSniff.default(['./test/examples/test.html'], {})
      .then(report => AccessSniff.report(report))
      .then(() => {
        var report = fs.readFileSync('./reports/report.json', 'utf8');
        var expected = fs.readFileSync('./test/expected/report.json', 'utf8');

        test.deepEqual(report, expected, 'Should write a json report for test.html');
        test.expect(1);
        test.done();

      });
  }
};
