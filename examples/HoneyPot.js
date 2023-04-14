import {
    fireEvent,
    registerHandler
} from '../dist/jsb.es.js';

class HoneyPot {

    constructor(dom_element) {
        this.dom_element = dom_element;
        this.initializeListener();
    };

    initializeListener() {
        if (typeof jQuery !== 'undefined') {
            jQuery(this.dom_element).on('click', () => this.onClick());
        } else if (typeof MooTools !== 'undefined') {
            this.dom_element.addEvent('click', () => this.onClick());
        } else {
            this.dom_element.addEventListener('click', () => this.onClick(), true);
        }
    };

    onClick() {
        fireEvent('HoneyPot::CLICKED', {
            'date': new Date().toString()
        });
    };
}

registerHandler('honey_pot', HoneyPot);

export default HoneyPot;
