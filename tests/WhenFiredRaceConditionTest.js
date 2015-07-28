define("WhenFiredRaceConditionTest", [], function()
{
    "use strict";

    var WhenFiredRaceConditionTest = function(dom_element, options)
    {
        var that = this;
        this.dom_element = dom_element;


        /*
         * Fire the event, it should be catched with the next whenFired
         */
        jsb.fireEvent('WHEN_FIRED_RACE_CONDITION_TEST', {
            "id": 1
        });

        jsb.whenFired('WHEN_FIRED_RACE_CONDITION_TEST', {"id": 1}, function(values)
        {
            /* This happend up to jsb 2.0.0, to be values.id == 2, because the next event is already the last event */
            if (values.id == 1) {
                that.markAsSucceeded();
            } else {
                that.markAsFailed();
            }
        });

        jsb.fireEvent('WHEN_FIRED_RACE_CONDITION_TEST', {
            "id": 2
        });
    };

    WhenFiredRaceConditionTest.prototype.markAsSucceeded = function()
    {
        /*
         * jQuery/Mootools
         */
        if (typeof $ !== 'undefined')
        {
            $(this.dom_element).addClass('test_succeeded');
            $(this.dom_element).removeClass('test_failed');
        }
        else
        {
            /*
             * Native
             */
            this.dom_element['className'] = 'test_succeeded';
        }
    };

    WhenFiredRaceConditionTest.prototype.markAsFailed = function()
    {
        /*
         * jQuery/Mootools
         */
        if (typeof $ !== 'undefined')
        {
            $(this.dom_element).addClass('test_failed');
            $(this.dom_element).removeClass('test_succeeded');
        }
        else
        {
            /*
             * Native
             */
            this.dom_element['className'] = 'test_failed';
        }
    };

    return WhenFiredRaceConditionTest;
});