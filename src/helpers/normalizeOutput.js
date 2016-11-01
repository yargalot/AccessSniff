/* @flow */

const NormalizeOutput = (stringOutput: string): [] => {
  let fileMessages = stringOutput.split('\n');

  fileMessages = fileMessages.filter(message => message);
  fileMessages = fileMessages.map(message => JSON.parse(message));

  return fileMessages;
};

export { NormalizeOutput as default };
