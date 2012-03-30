HoneyPotDisplay = function(dom_element, options) {
    var that = this;
    this.dom_element = dom_element;
    this.hit_count = 0;
    this.setHitCount(0);
    this.initializeListener();
};

HoneyPotDisplay.prototype.initializeListener = function() {
    var that = this;
    
    jsb.on(/^HoneyPot/, function() {
        that.setHitCount(that.hit_count + 1);
    });
};

HoneyPotDisplay.prototype.setHitCount = function(count) {
    var text = 'Hits: ' + count;
    this.hit_count = count;
    if (typeof jQuery !== 'undefined') {
        jQuery(this.dom_element).text(text);
    } else if (typeof MooTools !== 'undefined') {
        this.dom_element.set('text', text);
    } else {
        this.dom_element.textContent = text;
    }
};

JsBehaviourToolkit.registerHandler('honey_pot_display', HoneyPotDisplay);
