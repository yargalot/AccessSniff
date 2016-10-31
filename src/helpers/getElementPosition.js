/* @flow */

const startOfLineIndex = (lines, line) => {
  let x = lines.slice(0);

  x.splice(line - 1);

  return x.join('\n').length + (x.length > 0);
};

const getLineFromPos = (content, index) => {
  let lines = content.split('\n');
  let lineNumber = content.substr(0, index).split('\n').length;
  let columnNumber = index - startOfLineIndex(lines, lineNumber);

  if (columnNumber < 0) {
    columnNumber = 0;
  }

  return { lineNumber, columnNumber };
};

const getElementPosition = (htmlString: string, fileContents: string) => {
  const index:number = fileContents.indexOf(htmlString);
  const position = getLineFromPos(fileContents, index);

  return position;
};

export { getElementPosition as default };
