define('WhenFiredTest', [
    'jsb',
    'BaseTest'
], function(jsb, BaseTest) {
    'use strict';

    class WhenFiredTest extends BaseTest {
        constructor(dom_element) {
            super(dom_element);

            let event_counter = 0;

            /*
            * Register on the event with a normal handler to count how often it got
            * called
            */
            jsb.on('WHEN_FIRED_TEST', () => {
                event_counter++;
                if (event_counter > 1) {
                    this.markAsFailed();
                }
            });

            /*
            * Fire the event, it should raise the `event_counter` to 1 now
            */
            jsb.fireEvent('WHEN_FIRED_TEST', {
                'key': 'value'
            });

            setTimeout(() => {
                /*
                * Register on the event, but use whenFired, thus the event handler
                * should be called immediately and the `event_counter` should be still
                * 1.
                */
                jsb.whenFired('WHEN_FIRED_TEST', (values) => {
                    if (event_counter === 1 && values.key == 'value') {
                        /*
                        * Now test the same with an regular expression and a filter
                        */
                        jsb.whenFired(/^WHEN_FIRED_TEST$/, {
                            'key': 'value'
                        }, (values) => {
                            if (event_counter === 1 && values.key == 'value') {
                                this.markAsSucceeded();
                                /*
                                * We whould not get that event, if the filter is wrong!
                                */
                                jsb.whenFired(/^WHEN_FIRED_TEST$/, {
                                    'key': 'wrong_value'
                                }, (values) => {
                                    this.markAsFailed();
                                });
                            }
                        });
                    }
                });
            }, 10);
        }
    }

    return WhenFiredTest;
});
