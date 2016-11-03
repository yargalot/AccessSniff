import _ from 'underscore';

const GenerateReport = (reports, seperator) => {

  let output = '';

  _.each(reports, (report, fileName) => {
    const headings = ['heading', 'issue', 'element', 'id', 'class', 'line', 'column', 'description'].join(seperator);

    output += `${fileName}\n`;
    output += `${headings}\n`;

    report.messageLog.forEach((message) => {
      output += message.heading + seperator;
      output += message.issue + seperator;
      output += message.element.node + seperator;
      output += message.element.id + seperator;
      output += message.element.class + seperator;
      output += message.position.lineNumber + seperator;
      output += message.position.columnNumber + seperator;
      output += message.description + '\n';
    });
  });

  return output;

};


export { GenerateReport as default };
