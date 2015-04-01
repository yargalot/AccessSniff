# AccessSniff
[![Build Status](https://travis-ci.org/yargalot/AccessSniff.svg?branch=master)](https://travis-ci.org/yargalot/AccessSniff)

A CLI and Phantom.js library for HTML_CodeSniffer

![Example Image](img/example.png)

NOTE: This is in beta, please leave feedback. Would love it :)

## Getting Started
Install this plugin with `npm install access-sniff` then use it in your project with

```javascript
var accessSniff  = require('access-sniff');
var files = ['**/*.html'];

accessSniff.start(files, options);
```

## CLI
You can use the CLI component by installing it globally with `npm install -g access-sniff`

```cmd
sniff test/**/*.html -r json -l reports
sniff test/**/*.html -r csv -l reports
sniff test/**/*.html -r txt -l reports
```


### Options

#### Report Type
`-r` or `-reportType`

txt, csv, json.

#### Report Location
`-r` or `-reportLocation`

#### Quiet
`-q` or `-quiet`
