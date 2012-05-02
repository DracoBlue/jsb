OffAllTest = function(dom_element, options)
{
    var that = this;
    this.dom_element = dom_element;
    var event_counter = 0;

    var offTestHandler1 = function() {
        event_counter++;
    };

    var offTestHandler2 = function() {
        offTestHandler1();
    };


    jsb.on('OFF_ALL_TEST', offTestHandler1);
    jsb.on('OFF_ALL_TEST', offTestHandler2);

    jsb.fireEvent('OFF_ALL_TEST');
    jsb.off('OFF_ALL_TEST');
    jsb.fireEvent('OFF_ALL_TEST');

    setTimeout(function()
    {
        if (event_counter === 2) {
            that.markAsSucceeded();
        }
    }, 10);
};

OffAllTest.prototype.markAsSucceeded = function()
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

jsb.registerHandler('off_all_test', OffAllTest);
