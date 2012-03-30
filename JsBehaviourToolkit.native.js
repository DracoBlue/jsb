/*
 * JsBehaviourToolkit 1.3.1 - Native Version
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
        var value_string = null;
        
        if (dom_element.getAttribute('data-jsb')) {
            /*
             * Nice, we have a data-jsb attribute -> let's use that one!
             */
            value_string = dom_element.getAttribute('data-jsb');
        } else {
            if (dom_element.nodeName.toLowerCase() === 'input') {
                /*
                 * The class is on the input dom element, let's fetch
                 * it's parent
                 */
                input_element = dom_element;
                dom_element = input_element.parentNode;
                value_string = input_element.value;
            } else {
                /*
                 * The class is NOT on the input dom element, let's 
                 * find it's first input!
                 */
                input_element = dom_element.getElementsByTagName('input')[0] || null;
                if (input_element) {
                    value_string = input_element.value;
                }
            }
        }

        
        if (value_string !== null) {
            var value;
            
            if (value_string.substr(0, 1) == '{') {
                value = JSON.parse(value_string);
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

    removeClassFromElement: function(dom_element, class_name) {
        var element_class_name = dom_element.className;
        element_class_name = element_class_name.replace(new RegExp('(^|[\\s]+)' + class_name + '($|[\\s]+)'), '$1$2');
        dom_element.className = element_class_name;
    },
    
    applyBehaviour: function(dom_element) {
        var dom_elements = [];
        /*
         * We need to use concat, because otherwise the returned array would
         * change as soon as we remove the element's className.
         */
        var raw_dom_elements = null;
        if (dom_element.getElementsByClassName) {
            raw_dom_elements = dom_element.getElementsByClassName(this.prefix);
        } else {
            raw_dom_elements = dom_element.querySelectorAll('.' + this.prefix);
        }
        var raw_dom_elements_length = raw_dom_elements.length;
        for (var r = 0; r < raw_dom_elements_length; r++) {
            dom_elements.push(raw_dom_elements[r]);
        }
        
        var dom_elements_length = dom_elements.length;
        
        for (var i = 0; i < dom_elements_length; i++) {
            var dom_element = dom_elements[i];
            var key = dom_element.className.match(this.prefix_regexp)[1];
            if (key) {
                this.callHandler(key, dom_element);
                this.removeClassFromElement(dom_element, this.prefix);
                this.removeClassFromElement(dom_element, this.prefix + key);
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

window.addEventListener("DOMContentLoaded", function() {
    JsBehaviourToolkit.applyBehaviour(window.document);
}, true);
