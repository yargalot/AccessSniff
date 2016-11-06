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

const testOptions = {
  force: true,
  verbose: false,
  template: true
};

exports.jsDOMTests = {
  setUp: done => {
    // setup here if necessary
    done();
  },
  overall_testFileString: test => {
    var target = './test/examples/test.html';

    AccessSniff.default(target, testOptions)
      .then(report => {
        test.ok(Object.keys(report).length === 1, 'There should be 1 report from an string input');
        test.expect(1);
        test.done();
      });

  },
  overall_testGlobString: test => {
    AccessSniff
      .default('./test/examples/**/*.html', {
        force: true,
        ignore: [
          'WCAG2A.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl',
          'WCAG2A.Principle3.Guideline3_1.3_1_1.H57.2'
        ]
      })
      .then(report => {
        test.ok(Object.keys(report).length === 4, 'There should be 5 reports from an string input');
        test.expect(1);
        test.done();
      });
  },
  overall_testGlobArray: test => {
    AccessSniff
      .default(['./test/examples/**/*.html'], {
        force: true,
        ignore: [
          'WCAG2A.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl',
          'WCAG2A.Principle3.Guideline3_1.3_1_1.H57.2'
        ]
      })
      .then(report => {
        test.ok(Object.keys(report).length === 4, 'There should be 5 reports from an array input');
        test.expect(1);
        test.done();
      });
  },
  overall_testString: test => {
    var testString = '<h1>Hello World!</h1>';

    AccessSniff
      .default([testString], {
        force: true,
        ignore: [
          'WCAG2A.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl',
          'WCAG2A.Principle3.Guideline3_1.3_1_1.H57.2'
        ]
      })
      .then(report => {
        test.ok(report[testString], 'Should produce a json report for html string');
        test.expect(1);
        test.done();
      });
  }
};
