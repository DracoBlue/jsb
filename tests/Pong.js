define('Pong', function() {
    'use strict';

    var Pong = function(dom_element, options) {
        jsb.on('PING', function(values, name) {
            if (name !== 'PING') {
                console.error('Event name ' + name + ' was not PING!');
                return;
            }

            dom_element.className = 'test_succeeded';
        });
    };

    return Pong;
});
