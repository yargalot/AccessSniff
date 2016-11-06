/* @flow */
import fs from 'fs';
import axios from 'axios';
import Promise from 'bluebird';
import validator from 'validator';

const getUrlContents = (url: string) =>
  axios
    .get(url)
    .then(response => response.data)
    .catch(response => response);

const getFileContents = (file: string) => {
  return new Promise((resolve) => {
    if (validator.isURL(file)) {
      getUrlContents(file).then(data => resolve(data));
    } else if (fs.existsSync(file)) {
      let fileContents = fs.readFileSync(file, 'utf8');
      resolve(fileContents);
    } else {
      resolve(file);
    }
  });
};

export { getFileContents as default };
