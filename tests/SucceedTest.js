define('SucceedTest', [
    'BaseTest'
], function(BaseTest) {
    'use strict';

    class SucceedTest extends BaseTest {
        constructor(dom_element) {
            super(dom_element);
            this.markAsSucceeded()
        }
    }

    return SucceedTest;
});
