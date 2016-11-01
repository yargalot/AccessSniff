import fs from 'fs';
import path from 'path';
import jsdom from 'jsdom';
import Promise from 'bluebird';
import validator from 'validator';

const scriptPath = path.join(__dirname, '../HTMLCS.min.js');

var vConsole = jsdom.createVirtualConsole();

const RunJsDomInstance = (file, accessibilityLevel) => {
  return new Promise((resolve, reject) => {
    let messages = [];
    const jsDomOptions = {
      scripts: [scriptPath],
      virtualConsole: vConsole,
      done: (err, window) => {
        if (err) {
          reject(err);
        }

        window.HTMLCS_RUNNER.run(accessibilityLevel);
      }
    };

    if (validator.isURL(file)) {
      reject('Cannot render urls');
    } else if (fs.existsSync(file)) {
      jsDomOptions.file = file;
    } else {
      jsDomOptions.html = file;
    }

    vConsole.on('log', (message) => {
      if (message === 'done') {
        resolve(messages);
      } else {
        messages.push([accessibilityLevel, message]);
      }
    });

    jsdom.env(jsDomOptions);
  });
};

export { RunJsDomInstance as default };
