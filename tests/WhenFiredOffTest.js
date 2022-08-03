define('WhenFiredOffTest', [
    'jsb',
    'BaseTest'
], function(jsb, BaseTest) {
    'use strict';

    class WhenFiredOffTest extends BaseTest {
        constructor(dom_element, options) {
            super(dom_element);

            let event_counter = 0;

            /*
            * Register on the event with a normal handler to count how often it got
            * called
            */
            jsb.on('WHEN_FIRED_OFF_TEST', () => {
                event_counter++;
                if (event_counter > 1) {
                    this.markAsFailed();
                }
            });

            /*
            * Fire the event, it should raise the `event_counter` to 1 now
            */
            jsb.fireEvent('WHEN_FIRED_OFF_TEST', {
                'key': 'value'
            });

            setTimeout(() => {
                /*
                * Register on the event, but use whenFired, thus the event handler
                * should be called immediately and the `event_counter` should be still
                * 1.
                */
                const off = jsb.whenFired('WHEN_FIRED_OFF_TEST', (values) => {
                    if (event_counter === 1 && values.key == 'value') {
                        /* off should not be undefined now! */
                        if (typeof off === 'undefined') {
                            this.markAsFailed();
                        }
                        else {
                            off();
                            this.markAsSucceeded();
                        }
                    }
                });
            }, 10);
        }
    }

    return WhenFiredOffTest;
});
