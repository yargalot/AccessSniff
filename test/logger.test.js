var logger = require('../dist/logger').default;
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
  logger_GeneralMessage: test => {
    const input = {
      heading: 'ERROR',
      issue: 'WCAG2A.Principle2.Guideline2_4.2_4_4.H77,H78,H79,H80,H81',
      description: 'Check that the link text combined with programmatically determined link context identifies the purpose of the link.',
      element: {
        node: '<a href="test" class="herp">Test</a>'
      },
      position: {
        lineNumber: 9,
        columnNumber:  4
      }
    };
    const message = logger.generalMessage(input);

    test.deepEqual(message, [
      'ERROR WCAG2A.Principle2.Guideline2_4.2_4_4.H77,H78,H79,H80,H81',
      'Line:9 Col:4',
      'Check that the link text combined with programmatically determined link context identifies the purpose of the link.',
      '<a href="test" class="herp">Test</a>'
    ]);
    test.expect(1);
    test.done();
  },
  logger_StartMessage: test => {
    const input = 'Start the running thing';
    const message = logger.startMessage(input);

    test.equal(message, input);
    test.expect(1);
    test.done();
  },
  logger_FinishedMessage: test => {
    const normalMessage = logger.finishedMessage();
    test.equal(normalMessage, 'Report Finished');

    const fileMessage = logger.finishedMessage('/test.html');
    test.equal(fileMessage, 'File "/test.html" created. Report Finished');

    test.expect(2);
    test.done();
  },
  logger_ErrorMessage: test => {
    const message = logger.errorMessage(5);
    test.equal(message, 'There were 5 errors present');

    test.expect(1);
    test.done();
  },
  logger_GerneralErrorMessage: test => {
    const message = logger.generalError('Error message');
    test.equal(message, '\u001b[31mError message\u001b[39m');

    test.expect(1);
    test.done();
  }
};
