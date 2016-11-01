/* global HTMLCS, document */
/* eslint-disable no-console */
/*eslint no-unused-vars: 0*/

function Runner() {

  this.run = function(standard) {
    var _this = this;
    var messages = ['derp'];

    // At the moment, it passes the whole DOM document.
    HTMLCS.process(standard, document, function() {
      var messages = HTMLCS.getMessages();

      messages = messages.map((message) => {
        message.elementString = message.element.outerHTML;
        return _this.output(message);
      });

      console.log('done');
    });

    return messages;
  };

  this.output = function(msg) {
    // Simple output for now.
    var typeName = 'UNKNOWN';

    switch (msg.type) {
      case HTMLCS.ERROR:
        typeName = 'ERROR';
        break;

      case HTMLCS.WARNING:
        typeName = 'WARNING';
        break;

      case HTMLCS.NOTICE:
        typeName = 'NOTICE';
        break;
    }

    var message =
      typeName + '|' +
      msg.code + '|' +
      msg.msg + '|' +
      msg.elementString + '|' +
      msg.element.className + '|' +
      msg.element.id;

    console.log(message);

    return message;

  };

}

var HTMLCS_RUNNER = new Runner();
