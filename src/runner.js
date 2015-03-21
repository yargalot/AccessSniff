function Runner() {

  this.run = function(standard) {
    var self = this;

    // At the moment, it passes the whole DOM document.
    HTMLCS.process(standard, document, function() {
      var messages = HTMLCS.getMessages();
      var length   = messages.length;

      for (var i = 0; i < length; i++) {

        var htmlString = messages[i].element.outerHTML;

        // Print out actual element to string
        messages[i].elementString = htmlString;

        // Output to messages
        self.output(messages[i]);
      }

      console.log('done');
    });
  };

  this.output = function(msg) {
    // Simple output for now.
    var typeName = 'UNKNOWN';

    console.log(msg);

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

    console.log(
      typeName + '|' +
      msg.code + '|' +
      msg.msg + '|' +
      msg.elementString + '|' +
      msg.element.className + '|' +
      msg.element.id
    );

  };

}

var HTMLCS_RUNNER = new Runner();
