'use strict';

var grunt = require('grunt');

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
  matchReports: function(test) {

    var actual;
    var expected;

    test.expect(6);


    //
    // Test txt reports
    // ----------------------
    actual = grunt.file.read('reports/test.txt');
    expected = grunt.file.read('test/expected/test.txt');
    test.equal(actual, expected, 'Should produce a text report for test.html');

    actual = grunt.file.read('reports/two.txt');
    expected = grunt.file.read('test/expected/two.txt');
    test.equal(actual, expected, 'Should produce a text report for two.html');


    //
    // Test csv reports
    // ----------------------
    actual = grunt.file.read('reports/test.csv');
    expected = grunt.file.read('test/expected/test.csv');
    test.equal(actual, expected, 'Should produce a csv report for test.html');

    actual = grunt.file.read('reports/two.csv');
    expected = grunt.file.read('test/expected/two.csv');
    test.equal(actual, expected, 'Should produce a csv report for two.html');


    //
    // Test json reports
    // ----------------------
    actual = grunt.file.read('reports/test.json');
    expected = grunt.file.read('test/expected/test.json');
    test.equal(actual, expected, 'Should produce a json report for test.html');

    actual = grunt.file.read('reports/two.json');
    expected = grunt.file.read('test/expected/two.json');
    test.equal(actual, expected, 'Should produce a json report for two.html');


    test.done();
  }
};
