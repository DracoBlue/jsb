define('MultipleHandlersTest', [
    'BaseTest'
], function(BaseTest) {
    'use strict';

    class MultipleHandlersTest extends BaseTest {
        constructor(dom_element) {
            super(dom_element);
            const timer = setInterval(() => {
                if (dom_element.classList.contains('addthis')) {
                    clearInterval(timer);

                    this.markAsSucceeded();
                }
            }, 100);
        }
    }

    return MultipleHandlersTest;
});
