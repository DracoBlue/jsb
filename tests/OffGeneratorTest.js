define("OffGeneratorTest", [], function()
{
    "use strict";

    var OffGeneratorTest = function(dom_element, options)
    {
        var that = this;
        this.dom_element = dom_element;
        var event_counter = 0;

        var offTestHandler = function() {
            event_counter++;
        };

        var off = jsb.on('OFF_GENERATOR_TEST', offTestHandler);

        jsb.fireEvent('OFF_GENERATOR_TEST');
        off();
        jsb.fireEvent('OFF_GENERATOR_TEST');

        setTimeout(function()
        {
            if (event_counter === 1) {
                that.markAsSucceeded();
            }
        }, 10);
    };

    OffGeneratorTest.prototype.markAsSucceeded = function()
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

    OffGeneratorTest.prototype.markAsFailed = function()
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

    return OffGeneratorTest;
});

