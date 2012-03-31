WhenFiredTest = function(dom_element, options)
{
    var that = this;
    this.dom_element = dom_element;
    var event_counter = 0;

    /*
     * Register on the event with a normal handler to count how often it got
     * called
     */
    jsb.on('WHEN_FIRED_TEST', function()
    {
        event_counter++;
        if (event_counter > 1)
        {
            that.markAsFailed();
        }
    });

    /*
     * Fire the event, it should raise the `event_counter` to 1 now
     */
    jsb.fireEvent('WHEN_FIRED_TEST', {
        "key": "value"
    });

    setTimeout(function()
    {
        /*
         * Register on the event, but use whenFired, thus the event handler
         * should be called immediately and the `event_counter` should be still
         * 1.
         */
        jsb.whenFired('WHEN_FIRED_TEST', function(values)
        {
            if (event_counter === 1 && values.key == 'value')
            {
                /*
                 * Now test the same with an regular expression and a filter
                 */
                jsb.whenFired(/^WHEN_FIRED_TEST$/, {"key": "value"}, function(values)
                {
                    if (event_counter === 1 && values.key == 'value')
                    {
                        that.markAsSucceeded();
                        /*
                         * We whould not get that event, if the filter is wrong!
                         */
                        jsb.whenFired(/^WHEN_FIRED_TEST$/, {'key' : 'wrong_value'}, function(values)
                        {
                            that.markAsFailed();
                        });
                    }
                });
            }
        });
    }, 10);
};

WhenFiredTest.prototype.markAsSucceeded = function()
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

WhenFiredTest.prototype.markAsFailed = function()
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

jsb.registerHandler('when_fired_test', WhenFiredTest);