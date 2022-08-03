define('WhenFiredRaceConditionTest', [
    'jsb',
    'BaseTest'
], function(jsb, BaseTest) {
    'use strict';

    class WhenFiredRaceConditionTest extends BaseTest {
        constructor(dom_element) {
            super(dom_element);

            /*
            * Fire the event, it should be catched with the next whenFired
            */
            jsb.fireEvent('WHEN_FIRED_RACE_CONDITION_TEST', {
                'id': 1
            });

            jsb.whenFired('WHEN_FIRED_RACE_CONDITION_TEST', {
                'id': 1
            }, (values) => {
                /* This happend up to jsb 2.0.0, to be values.id == 2, because the next event is already the last event */
                if (values.id == 1) {
                    this.markAsSucceeded();
                } else {
                    this.markAsFailed();
                }
            });

            jsb.fireEvent('WHEN_FIRED_RACE_CONDITION_TEST', {
                'id': 2
            });
        }
    }

    return WhenFiredRaceConditionTest;
});
