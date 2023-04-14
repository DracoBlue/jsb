define('Pong', [
    'jsb',
    'BaseTest'
], function(jsb, BaseTest) {
    'use strict';

    class Pong extends BaseTest {
        constructor(dom_element) {
            super(dom_element);
            jsb.on('PING', (values, name) => {
                if (name !== 'PING') {
                    console.error('Event name ' + name + ' was not PING!');
                    return;
                }

                this.markAsSucceeded()
            });
        }
    }

    return Pong;
});
