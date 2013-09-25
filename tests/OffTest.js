define('OffTest', [], function()
{
    var OffTest = function(dom_element, options)
    {
        var that = this;
        this.dom_element = dom_element;
        var event_counter = 0;

        var offTestHandler = function() {
            event_counter++;
        };

        jsb.on('OFF_TEST', offTestHandler);

        jsb.fireEvent('OFF_TEST');
        jsb.off('OFF_TEST', offTestHandler);
        jsb.fireEvent('OFF_TEST');

        setTimeout(function()
        {
            if (event_counter === 1) {
                that.markAsSucceeded();
            }
        }, 10);
    };

    OffTest.prototype.markAsSucceeded = function()
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

    OffTest.prototype.markAsFailed = function()
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

    return OffTest;
});

