var page = require('webpage').create();
var url = 'http://example.com';

page.open(url, function (status) {

    page.injectJs('../dist/HTMLCS.min.js');

    // Now Run. Note that page.evaluate() function is sanboxed to
    // the loaded page's context. We can't pass any variable to it.

    switch (options.accessibilityLevel) {
        case 'WCAG2A':
            page.evaluate(function() {
                HTMLCS_RUNNER.run('WCAG2A');
            });
        break;
        case 'WCAG2AA':
            page.evaluate(function() {
                HTMLCS_RUNNER.run('WCAG2AA');
            });
        break;
        case 'WCAG2AAA':
            page.evaluate(function() {
                HTMLCS_RUNNER.run('WCAG2AAA');
            });
        break;
        default:
            sendMessage('console', 'Unknown standard.');
        break;
    }

    phantom.exit();
});
