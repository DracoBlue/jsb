/*
 * JsBehaviourToolkit 1.2.0 - MooTools Version
 *
 * Released on 5th September 2011.
 *
 * This file is part of JsBehaviour.
 * Copyright (c) 2010-2011 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

JsBehaviourToolkit = {
    prefix: 'jsb_',
    prefix_regexp: /jsb_([^\s]+)/,

    handlers: {},

    setPrefix: function(prefix) {
        this.prefix = prefix + '_';
        this.prefix_regexp = new RegExp(this.prefix + '([^\s]+)');
    },
    
    registerHandler: function(key, handler_function) {
        this.handlers[key] = handler_function;
    },
    
    callHandler: function(key, dom_element) {
        if (typeof this.handlers[key] === 'undefined') {
            throw new Error('The handler ' + key + ' is not defined!');
        }

        var input_element;

        if (dom_element.get('tag') === 'input') {
            /*
             * The class is on the input dom element, let's fetch
             * it's parent
             */
            input_element = dom_element;
            dom_element = input_element.parentNode;
        } else {
            /*
             * The class is NOT on the input dom element, let's 
             * find it's first input!
             */
            input_element = dom_element.getFirst('input');
        }
        
        if (input_element) {
            var value_string = input_element.get('value'),
                value;
            if (value_string.substr(0, 1) == '{') {
                value = JSON.decode(value_string);
            } else {
                value = {};
                var parts = value_string.split("&");
                var parts_length = parts.length;
                for (var i = 0; i < parts_length; i++) {
                    var query_string_entry = parts[i].split("=");
                    var value_key = decodeURIComponent(query_string_entry[0]);
                    var value_content = decodeURIComponent(query_string_entry.slice(1).join("="));
                    value[value_key] = value_content;
                }         
            }
            new this.handlers[key](dom_element, value);
        } else {
            new this.handlers[key](dom_element);
        }
    },
    
    applyBehaviour: function(dom_element) {
        var dom_elements = $(dom_element).getElements('.' + this.prefix);
        var dom_elements_length = dom_elements.length;
        
        for (var i = 0; i < dom_elements_length; i++) {
            var dom_element = dom_elements[i];
            var key = dom_element.get('class').match(this.prefix_regexp)[1];
            this.callHandler(key, dom_element);
            dom_element.removeClass(this.prefix);
            dom_element.removeClass(this.prefix + '' + key);
        }
        
    }
};

$(window).addEvent('domready', function() {
    JsBehaviourToolkit.applyBehaviour(window.document);
});
