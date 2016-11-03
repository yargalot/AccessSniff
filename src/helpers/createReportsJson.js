const CreateReportsJson = (reports) => {
  let reportLogs = {};
  let totalIssueCount = { error: 0, warning: 0, notice: 0 };
  let AllReportsLintFree;

  reports.forEach(report => {
    const { fileName, lintFree, messageLog, counters } = report;

    if (lintFree) {
      AllReportsLintFree = true;
    }

    totalIssueCount.error += counters.error;
    totalIssueCount.warning += counters.warning;
    totalIssueCount.notice += counters.notice;

    reportLogs[fileName] = { counters, messageLog };
  });

  return { reportLogs, totalIssueCount, AllReportsLintFree };
};

export { CreateReportsJson as default };
