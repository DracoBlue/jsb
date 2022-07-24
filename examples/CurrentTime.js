import {
    registerHandler
} from '../jsb.js';

class CurrentTime {

    constructor(dom_element, options = {}) {
        options.interval = options.interval || 1000;
        this.dom_element = dom_element;
        setInterval(() => this.refresh(), options.interval);
        this.refresh();
    }

    refresh() {
        if (typeof jQuery !== 'undefined') {
            jQuery(this.dom_element).html((new Date()).toString());
        } else if (typeof MooTools !== 'undefined') {
            this.dom_element.set('html', (new Date()).toString());
        } else {
            this.dom_element.textContent = (new Date()).toString();
        }
    }
};

registerHandler('current_time', CurrentTime);

export default CurrentTime;
