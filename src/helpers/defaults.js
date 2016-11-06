const defaultOptions = {
  ignore: [],
  verbose: true,
  force: false,
  browser: false,
  domElement: true,
  reportLevels: {
    notice: true,
    warning: true,
    error: true
  },
  reportLocation : '',
  accessibilityLevel: 'WCAG2A',
  maxBuffer: 500*1024
};

export { defaultOptions as default };
