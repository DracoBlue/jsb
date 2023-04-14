define('Ping', [
    'jsb'
], function(jsb) {
    'use strict';

    class Ping {
        constructor() {
            jsb.fireEvent('PING');
        }
    }

    return Ping;
});
