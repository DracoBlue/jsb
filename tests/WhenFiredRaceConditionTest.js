define('WhenFiredRaceConditionTest', [
    'jsb'
], function(jsb) {
    'use strict';

    var WhenFiredRaceConditionTest = function(dom_element, options) {
        var that = this;
        this.dom_element = dom_element;

        /*
         * Fire the event, it should be catched with the next whenFired
         */
        jsb.fireEvent('WHEN_FIRED_RACE_CONDITION_TEST', {
            'id': 1
        });

        jsb.whenFired('WHEN_FIRED_RACE_CONDITION_TEST', {
            'id': 1
        }, function(values) {
            /* This happend up to jsb 2.0.0, to be values.id == 2, because the next event is already the last event */
            if (values.id == 1) {
                that.markAsSucceeded();
            } else {
                that.markAsFailed();
            }
        });

        jsb.fireEvent('WHEN_FIRED_RACE_CONDITION_TEST', {
            'id': 2
        });
    };

    WhenFiredRaceConditionTest.prototype.markAsSucceeded = function() {
        this.dom_element.className = 'test_succeeded';
    };

    WhenFiredRaceConditionTest.prototype.markAsFailed = function() {
        this.dom_element.className = 'test_failed';
    };

    return WhenFiredRaceConditionTest;
});
