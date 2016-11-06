import path from 'path';
import Promise from 'bluebird';
import childProcess from 'child_process';
import phantom from 'phantomjs-prebuilt';

const phantomExecPath = path.join(__dirname, './phantomExec.js');

const RunPhantomInstance = (file, accessibilityLevel, maxBuffer) => {
  return new Promise((resolve, reject) => {
    childProcess
      .execFile(phantom.path, [
        phantomExecPath,
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
