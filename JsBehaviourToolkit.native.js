/*
 * JsBehaviourToolkit 1.2.0 - Native Version
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
            input_element = document.getElementsByTagName('input')[0] || null;
        }
        
        if (input_element) {
            var value_string = input_element.value;
            if (value_string.substr(0, 1) == '{') {
                value = JSON.parse(value_string);
            } else {
                var value = {};
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
            this.callHandler(key, dom_element);
            this.removeClassFromElement(dom_element, this.prefix);
            this.removeClassFromElement(dom_element, this.prefix + key);
        }
    }
};

window.addEventListener("DOMContentLoaded", function() {
    JsBehaviourToolkit.applyBehaviour(window.document);
}, true);