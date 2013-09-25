define("Ping", [], function()
{
    "use strict";

    var Ping = function(dom_element, options)
    {
        jsb.fireEvent('PING');
    };

    jsb.registerHandler('Ping', Ping);

    return Ping;
});

