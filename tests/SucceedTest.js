SucceedTest = function(dom_element, options) 
{
    /*
     * jQuery/Mootools
     */
    if (typeof $ !== 'undefined')
    {
        $(dom_element).addClass('test_succeeded');
        $(dom_element).removeClass('test_failed');
    }
    else
    {
        /*
         * Native
         */
        dom_element['className'] = 'test_succeeded';
    }
};

jsb.registerHandler('succeed_test', SucceedTest);