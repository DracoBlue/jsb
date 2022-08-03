define('OffTest', [
    'jsb',
    'BaseTest'
], function(jsb, BaseTest) {
    'use strict';

    class OffTest extends BaseTest {
        constructor(dom_element) {
            super(dom_element);

            let event_counter = 0;

            const offTestHandler = function() {
                event_counter++;
            };

            jsb.on('OFF_TEST', offTestHandler);

            jsb.fireEvent('OFF_TEST');
            jsb.off('OFF_TEST', offTestHandler);
            jsb.fireEvent('OFF_TEST');

            setTimeout(() => {
                if (event_counter === 1) {
                    this.markAsSucceeded();
                }
            }, 10);
        };
    }

    return OffTest;
});
