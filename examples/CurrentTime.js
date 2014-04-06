CurrentTime = function(dom_element, options) {
    var that = this;
    options = options || {};
    options.interval = options.interval || 1000;
    
    this.dom_element = dom_element;
        
    setInterval(function () {
        that.refresh();
    }, options.interval);

    this.refresh();
};

CurrentTime.prototype.refresh = function() {
    if (typeof jQuery !== 'undefined') {
        jQuery(this.dom_element).html((new Date()).toString());
    } else if (typeof MooTools !== 'undefined') {
        this.dom_element.set('html', (new Date()).toString());
    } else {
        this.dom_element.textContent = (new Date()).toString();
    }
};

jsb.registerHandler('current_time', CurrentTime);
