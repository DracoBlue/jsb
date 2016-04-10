define('MultipleHandlersTest', function() {
    'use strict';

    var MultipleHandlersTest = function(dom_element, options) {
        var timer = setInterval(function() {

            var classes = dom_element.className;

            if (classes.indexOf('addthis') > 0) {
                clearInterval(timer);

                dom_element.className = 'test_succeeded';
            }
        }, 100);
    };

    return MultipleHandlersTest;
});
