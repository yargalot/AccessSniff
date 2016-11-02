const defaultOptions = {
  ignore: [],
  verbose: true,
  force: false,
  browser: false,
  domElement: true,
  reportType: null,
  reportLevels: {
    notice: true,
    warning: true,
    error: true
  },
  reportLevelsArray: [],
  reportLocation : '',
  accessibilityrc: true,
  accessibilityLevel: 'WCAG2A',
  maxBuffer: 500*1024
};

export { defaultOptions as default };
