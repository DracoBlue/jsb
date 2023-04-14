define('OffGeneratorTest', [
    'jsb',
    'BaseTest'
], function(jsb, BaseTest) {
    'use strict';

    class OffGeneratorTest extends BaseTest {
        constructor(dom_element) {
            super(dom_element);

            let event_counter = 0;

            const offTestHandler = function() {
                event_counter++;
            };

            const off = jsb.on('OFF_GENERATOR_TEST', offTestHandler);

            jsb.fireEvent('OFF_GENERATOR_TEST');
            off();
            jsb.fireEvent('OFF_GENERATOR_TEST');

            setTimeout(() => {
                if (event_counter === 1) {
                    this.markAsSucceeded();
                }
            }, 10);
        }
    }

    return OffGeneratorTest;
});
