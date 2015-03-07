"use strict";

var accessSniff = require("./accessSniff.js");

var exports = {
  run : function() {

  },

  setup: function(files) {

    console.log(files);

    accessSniff.start(files);

  }
};


module.exports = exports;
