import {
    on,
    registerHandler
} from '../dist/jsb.es.js';

class HoneyPotDisplay {

    constructor(dom_element) {
        this.dom_element = dom_element;
        this.hit_count = 0;
        this.setHitCount(0);
        this.initializeListener();
    };

    initializeListener() {
        on(/^HoneyPot/, () => this.setHitCount(this.hit_count + 1));
    }

    setHitCount(count) {
        const text = 'Hits: ' + count;
        this.hit_count = count;
        if (typeof jQuery !== 'undefined') {
            jQuery(this.dom_element).text(text);
        } else if (typeof MooTools !== 'undefined') {
            this.dom_element.set('text', text);
        } else {
            this.dom_element.textContent = text;
        }
    }
};

registerHandler('honey_pot_display', HoneyPotDisplay);
