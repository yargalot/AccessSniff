var AccessSniff = require('../dist').default;
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
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  testFileOutput: function(test) {
    var expected = fs.readFileSync('./test/expected/test.json', 'utf8');

    AccessSniff(['./test/examples/test.html'], {}, function(report) {
      test.deepEqual(report[0], JSON.parse(expected), 'Should produce a json report for test.html');
      test.expect(1);
      test.done();
    });

  },
  urlFileOutput: function(test) {
    var expected = fs.readFileSync('./test/expected/test.json', 'utf8');

    AccessSniff(['http://getbootstrap.com/'], {}, function(report) {
      test.deepEqual(report[0], JSON.parse(expected), 'Should produce a json report for test.html');
      test.expect(1);
      test.done();
    });

  }
};
