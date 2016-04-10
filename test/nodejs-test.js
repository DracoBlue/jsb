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
                        throw new Error('The handler should be unregistered, but calls again!');
                    }
                }, 200);
                jsb.fireEvent('Event::WITH_OFFHANDLER');
            }
        });
        jsb.fireEvent('Event::WITH_OFFHANDLER');
    });

    it('should catch sticky events only once', function(done) {
        var counter = 0;
        this.timeout(1000);
        jsb.fireStickyEvent('Event::STICKY_EVENT');
        jsb.whenFired('Event::STICKY_EVENT', function() {
            counter++;
        });

        setTimeout(function() {
            if (counter == 1) {
                done();
            } else {
                throw new Error('The handler should be called only once, but calls ' + counter + ' times!');
            }
        }, 200);
    });

    it('should catch sticky events only once', function(done) {
        var counter_one = 0;
        var counter_two = 0;
        this.timeout(1000);

        jsb.fireStickyEvent('Event::STICKY_EVENT_WITH_VALUES', {
            'id': 'myid'
        });

        jsb.fireStickyEvent('Event::STICKY_EVENT_WITH_VALUES', {
            'id': 'otherid'
        });

        jsb.whenFired('Event::STICKY_EVENT_WITH_VALUES', {
            'id': 'myid'
        }, function() {
            counter_one++;
        });

        jsb.whenFired('Event::STICKY_EVENT_WITH_VALUES', {
            'id': 'otherid'
        }, function() {
            counter_two++;
        });

        setTimeout(function() {
            if (counter_one == 1 && counter_two == 1) {
                done();
            } else {
                throw new Error('The handler should be called only once, but calls ' + counter_one + ' times for myid and ' + counter_two +' times for otherid!');
            }
        }, 200);
    });
});
