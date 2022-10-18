import {
    registerHandler
} from '../dist/jsb.es.js'

class TimeDifference {

    constructor(dom_element, options = {}) {
        options.interval = options.interval || 1000;
        this.dom_element = dom_element;
        this.timestamp = new Date(options.timestamp);

        setInterval(() => this.refresh(), options.interval);
        this.refresh();
    };

    refresh() {
        const in_seconds = Math.floor((new Date().getTime() - this.timestamp.getTime()) / 1000);
        if (typeof jQuery !== 'undefined') {
            jQuery(this.dom_element).text(in_seconds + ' seconds ago.');
        } else if (typeof MooTools !== 'undefined') {
            this.dom_element.set('text', in_seconds + ' seconds ago.');
        } else {
            this.dom_element.textContent = in_seconds + ' seconds ago.';
        }
    }
}

registerHandler('time_difference', TimeDifference);
