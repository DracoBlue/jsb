/*
 * JsBehaviourToolkit 1.3.1 - jQuery Version
 *
 * Released on 30th January 2012.
 *
 * This file is part of JsBehaviour.
 * Copyright (c) 2010-2012 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

JsBehaviourToolkit = {
    prefix: 'jsb_',
    prefix_regexp: /jsb_([^\s]+)/,

    handlers: {},
    listeners: [],
    
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

        if (dom_element.nodeName.toLowerCase() === 'input') {
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
            input_element = jQuery(dom_element).find('input')[0] || null;
        }
        
        if (input_element) {
            var value_string = input_element.value,
                value;
            if (value_string.substr(0, 1) == '{') {
                value = jQuery.parseJSON(value_string);
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
        var dom_elements = jQuery(dom_element).find('.' + this.prefix);
        var dom_elements_length = dom_elements.length;
        
        for (var i = 0; i < dom_elements_length; i++) {
            var dom_element = dom_elements[i];
            var key = dom_element.className.match(this.prefix_regexp)[1];
            if (key) {
                this.callHandler(key, dom_element);
                jQuery(dom_element).removeClass(this.prefix, this.prefix + key);
            }
        }
        
    },
    
    fireEvent: function(name, values) {
        values = values || {};
        var listeners = this.listeners;
        var listeners_length = listeners.length;
        for (var i = 0; i < listeners_length; i++) {
            var listener = listeners[i];
            var is_regexp_match = (listener[1] instanceof RegExp && name.match(listener[1]));
            
            if (is_regexp_match || listener[1] === name) {
                var filter = listener[2];
                var is_match = true;
                if (filter) {
                    for (var filter_key in filter) {
                        if (filter.hasOwnProperty(filter_key)) {
                            is_match = is_match && (typeof values[filter_key] !== 'undefined' && filter[filter_key] === values[filter_key]);
                        }
                    }
                }
                
                if (is_match) {
                    listener[0](values);
                }
            }
        }
    },
    
    on: function(name_or_regexp, filter_or_cb, cb) {
        var filter = filter_or_cb;
        
        if (!cb) {
            filter = null;
            cb = filter_or_cb;
        }
        
        this.listeners.push([cb, name_or_regexp, filter || null]);
    }
};

jsb = JsBehaviourToolkit;

jQuery(window.document).ready(function() {
    JsBehaviourToolkit.applyBehaviour(window.document);
});
