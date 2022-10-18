import {
    describe,
    it
} from 'mocha';
import {
    on,
    fireEvent,
    whenFired,
    fireStickyEvent
} from '../dist/jsb.es.js';

describe('events', () => {

    it('should fire and catch simple events', function(done) {
        let counter = 0;
        on('Event::SIMPLE', () => {
            counter++;
            if (counter == 2) {
                done();
            }
        });
        fireEvent('Event::SIMPLE');
        fireEvent('Event::SIMPLE');
    });

    it('should catch events of the past', function(done) {
        let counter = 0;
        fireEvent('Event::FROM_THE_PAST');
        whenFired('Event::FROM_THE_PAST', () => {
            counter++;
            if (counter == 2) {
                done();
            }
        });
        fireEvent('Event::FROM_THE_PAST');
    });

    it('should detach if off handler is called', function(done) {
        let counter = 0;
        this.timeout(1000);
        let offHandler = on('Event::WITH_OFFHANDLER', () => {
            counter++;
            if (counter == 1) {
                offHandler();
                setTimeout(() => {
                    if (counter == 1) {
                        done();
                    } else {
                        throw new Error('The handler should be unregistered, but calls again!');
                    }
                }, 200);
                fireEvent('Event::WITH_OFFHANDLER');
            }
        });
        fireEvent('Event::WITH_OFFHANDLER');
    });

    it('should catch sticky events only once', function(done) {
        let counter = 0;
        this.timeout(1000);
        fireStickyEvent('Event::STICKY_EVENT');
        whenFired('Event::STICKY_EVENT', () => {
            counter++;
        });

        setTimeout(() => {
            if (counter == 1) {
                done();
            } else {
                throw new Error(`The handler should be called only once, but calls ${counter} times!`);
            }
        }, 200);
    });

    it('should catch sticky events only once', function(done) {
        let counter_one = 0;
        let counter_two = 0;
        this.timeout(1000);

        fireStickyEvent('Event::STICKY_EVENT_WITH_VALUES', {
            'id': 'myid'
        });

        fireStickyEvent('Event::STICKY_EVENT_WITH_VALUES', {
            'id': 'otherid'
        });

        whenFired('Event::STICKY_EVENT_WITH_VALUES', () => {
            counter_one++;
        }, {
            'id': 'myid'
        });

        whenFired('Event::STICKY_EVENT_WITH_VALUES', () => {
            counter_two++;
        }, {
            'id': 'otherid'
        });

        setTimeout(() => {
            if (counter_one == 1 && counter_two == 1) {
                done();
            } else {
                throw new Error(`The handler should be called only once, but calls ${counter_one} times for myid and ${counter_two} times for otherid!`);
            }
        }, 200);
    });
});
