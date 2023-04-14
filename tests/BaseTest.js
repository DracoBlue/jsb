define('BaseTest', function() {
    'use strict';

    class BaseTest {

        constructor(dom_element) {
            this.dom_element = dom_element;
        }

        markAsSucceeded() {
            this.dom_element.className = 'test_succeeded';
        }

        markAsFailed() {
            this.dom_element.className = 'test_failed';
        }
    }

    return BaseTest;
});
