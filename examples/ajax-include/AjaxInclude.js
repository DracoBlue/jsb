(function()
{
    var AjaxInclude = function(dom_element, options)
    {
        this.dom_element = jQuery(dom_element);
        this.options = options || {};
        this.options.method = this.options.method || 'replace';
        this.loadNow();
    };

    jsb.registerHandler('ajax_include', AjaxInclude);

    AjaxInclude.prototype.loadNow = function()
    {
        var that = this;
        var request_options = this.options.options || {};
        request_options.url = this.options.url;

        $.ajax(request_options).done(function(data)
        {
            var method_name = that.options.method;
            if (method_name === 'replace') {
                var parent = that.dom_element.parent();
                that.dom_element.replaceWith(data);
                /*
                 * Execute all behaviours on it's parent, because
                 * we just replaced the dom_element.
                 */
                jsb.applyBehaviour(parent);
            } else {
                that.dom_element[method_name](data);
                /*
                 * Execute all behaviours on this part now!
                 */
                jsb.applyBehaviour(parent);
            }
        });
    };

})();