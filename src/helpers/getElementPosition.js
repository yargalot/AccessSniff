/* @flow */

const getElementPosition = (htmlString: string, fileContents: string) => {
  let position = {
    lineNumber: 0,
    columnNumber: 0
  };

  const indexAt = fileContents.indexOf(htmlString);
  const before = fileContents.slice(0, indexAt);
  const stringArray = before.split(/\r\n|\r|\n/);

  if (indexAt === -1) {
    return position;
  }

  position.lineNumber = stringArray.length;
  position.columnNumber = stringArray[position.lineNumber - 1].length;

  return position;
};


export { getElementPosition as default };
