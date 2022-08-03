define('ChangeClass', function() {
    'use strict';

    class ChangeClass {
        constructor(dom_element, options = {}){
            options.remove_class = options.remove_class || '';
            options.add_class = options.add_class || '';

            if (options.remove_class) {
                dom_element.classList.remove(options.remove_class);
            }

            if (options.add_class) {
                dom_element.classList.add(options.add_class);
            }
        }
    }

    return ChangeClass;
});
