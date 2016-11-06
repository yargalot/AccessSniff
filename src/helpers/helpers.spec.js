import GenerateReportLevels from './generateReportLevels';

const Tests = {
  setUp: done => {
    done();
  },
  ReportLevels: test => {
    let levels = {
      error: true,
      warning: true,
      notice: true
    };

    let reportLevels;

    reportLevels = GenerateReportLevels(levels);
    test.deepEqual(reportLevels, ['ERROR', 'WARNING', 'NOTICE'], 'Should have all report levels');

    levels = {
     error: true,
     warning: false,
     notice: false
   };
    reportLevels = GenerateReportLevels(levels);
    test.deepEqual(reportLevels, ['ERROR'], 'Should have the error report level');

    test.expect(2);
    test.done();
  }
};

export { Tests as default };
