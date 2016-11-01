import path from 'path';
import Promise from 'bluebird';
import childProcess from 'child_process';
import phantom from 'phantomjs-prebuilt';

const RunPhantomInstance = (file, accessibilityLevel, maxBuffer) => {

  return new Promise((resolve, reject) => {
    childProcess
      .execFile(phantom.path, [
        path.join(__dirname, '../phantom.js'),
        file,
        accessibilityLevel
      ], { maxBuffer }, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
  });
};

export { RunPhantomInstance as default };
