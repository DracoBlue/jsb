define('AddClass', function() {
    'use strict';

    class ChangeClass {
        constructor(dom_element, options) {
            options = options || {};
            options.add_class = options.add_class || '';

            if (options.add_class) {
                dom_element.className = dom_element.className + ' ' + options.add_class;
            }
        }
    }

    return ChangeClass;
});
