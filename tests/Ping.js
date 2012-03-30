Ping = function(dom_element, options) 
{
    jsb.fireEvent('PING');
};

jsb.registerHandler('ping', Ping);