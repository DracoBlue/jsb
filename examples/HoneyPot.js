HoneyPot = function(dom_element, options) {
    var that = this;
    this.dom_element = dom_element;
    this.initializeListener();
};

HoneyPot.prototype.initializeListener = function() {
    var that = this;
    if (typeof jQuery !== 'undefined') {
        jQuery(this.dom_element).bind('click', function() {
            that.onClick();
        });
    } else if (typeof MooTools !== 'undefined') {
        this.dom_element.addEvent('click', function() {
            that.onClick();
        });
    } else {
        this.dom_element.addEventListener('click', function() {
            that.onClick();
        }, true);
    }
};

HoneyPot.prototype.onClick = function() {
    jsb.fireEvent('HoneyPot::CLICKED', {
        'date': new Date().toString()
    });
};

jsb.registerHandler('honey_pot', HoneyPot);
