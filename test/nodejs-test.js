var jsb = require('./../');

describe('events', function() {
    it('should fire and catch simple events', function(done) {
        var counter = 0;
        jsb.on('Event::SIMPLE', function() {
            counter++;
            if (counter == 2) {
                done();
            }
        });
        jsb.fireEvent('Event::SIMPLE');
        jsb.fireEvent('Event::SIMPLE');
    });

    it('should catch events of the past', function(done) {
        var counter = 0;
        jsb.fireEvent('Event::FROM_THE_PAST');
        jsb.whenFired('Event::FROM_THE_PAST', function() {
            counter++;
            if (counter == 2) {
                done();
            }
        });
        jsb.fireEvent('Event::FROM_THE_PAST');
    });

    it('should detach if off handler is called', function(done) {
        var counter = 0;
        this.timeout(1000);
        var offHandler = jsb.on('Event::WITH_OFFHANDLER', function() {
            counter++;
            if (counter == 1) {
                offHandler();
                setTimeout(function() {
                    if (counter == 1) {
                        done();
                    } else {
                        fail('The handler should be unregistered, but calls again!');
                    }
                }, 200);
                jsb.fireEvent('Event::WITH_OFFHANDLER');
            }
        });
        jsb.fireEvent('Event::WITH_OFFHANDLER');
    });
});