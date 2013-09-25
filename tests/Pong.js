define("Pong", [], function()
{
    "use strict";

    var Pong = function(dom_element, options)
    {
        jsb.on('PING', function(values, name) {
            if (name !== 'PING')
            {
                console.error('Event name ' + name + ' was not PING!');
                return;
            }

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

    jsb.registerHandler('Pong', Pong);

    return Pong;
});
