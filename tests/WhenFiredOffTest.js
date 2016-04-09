define('WhenFiredOffTest', function() {
    'use strict';

    var WhenFiredOffTest = function(dom_element, options) {
        var that = this;
        this.dom_element = dom_element;
        var event_counter = 0;

        /*
         * Register on the event with a normal handler to count how often it got
         * called
         */
        jsb.on('WHEN_FIRED_OFF_TEST', function() {
            event_counter++;
            if (event_counter > 1) {
                that.markAsFailed();
            }
        });

        /*
         * Fire the event, it should raise the `event_counter` to 1 now
         */
        jsb.fireEvent('WHEN_FIRED_OFF_TEST', {
            'key': 'value'
        });

        setTimeout(function() {
            /*
             * Register on the event, but use whenFired, thus the event handler
             * should be called immediately and the `event_counter` should be still
             * 1.
             */
            var off = jsb.whenFired('WHEN_FIRED_OFF_TEST', function(values) {
                if (event_counter === 1 && values.key == 'value') {
                    /* off should not be undefined now! */
                    if (typeof off === 'undefined') {
                        that.markAsFailed();
                    }
                    else {
                        off();
                        that.markAsSucceeded();
                    }
                }
            });
        }, 10);
    };

    WhenFiredOffTest.prototype.markAsSucceeded = function() {
        this.dom_element.className = 'test_succeeded';
    };

    WhenFiredOffTest.prototype.markAsFailed = function() {
        this.dom_element.className = 'test_failed';
    };

    return WhenFiredOffTest;
});
