import { ignoredCheck } from './buildMessage';

const Tests = {
  setUp: done => {
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

    checkedRule = ignoredCheck(ignored, undefined);
    test.ok(checkedRule === false);

    test.expect(4);
    test.done();
  }
};

export { Tests as default };
