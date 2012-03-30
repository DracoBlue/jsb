Pong = function(dom_element, options) 
{
    jsb.on('PING', function() {
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
    });
};

jsb.registerHandler('pong', Pong);