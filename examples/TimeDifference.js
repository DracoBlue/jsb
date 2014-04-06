TimeDifference = function(dom_element, options) {
    var that = this;
    options = options || {};
    options.interval = options.interval || 1000;

    this.dom_element = dom_element;
    
    this.timestamp = new Date(options.timestamp);

    setInterval(function () {
        that.refresh();
    }, options.interval);

    this.refresh();
};

TimeDifference.prototype.refresh = function() {
    var in_seconds = Math.floor((new Date().getTime() - this.timestamp.getTime()) / 1000);
    if (typeof jQuery !== 'undefined') {
        jQuery(this.dom_element).html(in_seconds + ' seconds ago.');
    } else if (typeof MooTools !== 'undefined') {
        this.dom_element.set('html', in_seconds + ' seconds ago.');
    } else {
        this.dom_element.textContent = in_seconds + ' seconds ago.';
    }
};

jsb.registerHandler('time_difference', TimeDifference);
