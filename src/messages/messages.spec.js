
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

import { ignoredCheck } from './buildMessage';


const Tests = {
  setUp: done => {
    // setup here if necessary
    done();
  },
  isRuleIgnored: test => {
    const ignored = [
      'WCAG2AA.Principle4.Guideline4_1.4_1_1.F77',
      'WCAG2AA.Principle1.Guideline1_4.1_4_3.G145.Fail',
      'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18'
    ];

    let checkedRule;

    checkedRule= ignoredCheck(ignored, 'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18');
    test.ok(checkedRule === true);

    checkedRule = ignoredCheck(ignored, 'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.BgImage');
    test.ok(checkedRule === true);

    checkedRule = ignoredCheck(ignored, 'WCAG2A.Principle1.Guideline1_1.1_1_1.H2.EG3');
    test.ok(checkedRule === false);

    test.expect(3);
    test.done();
  }
};

export { Tests as default };
