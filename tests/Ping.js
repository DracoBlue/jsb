define('Ping', [
    'jsb'
], function(jsb) {
    'use strict';

    var Ping = function(dom_element, options) {
        jsb.fireEvent('PING');
    };

    return Ping;
});
