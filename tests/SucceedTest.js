define('SucceedTest', function() {
    'use strict';

    var SucceedTest = function(dom_element, options) {
        dom_element.className = 'test_succeeded';
    };

    return SucceedTest;
});
