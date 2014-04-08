/*
 * jsb 2.0.0
 *
 * This file is part of jsb (Javascript Behaviour Toolkit).
 * Copyright (c) 2010-2014 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

jsb = {
    prefix: 'jsb_',
    prefix_regexp: /jsb_([^\s]+)/,

    handlers: {},
    listeners: [],
    last_event_values: {},
    
    /**
     * Set the prefix for the jsb toolkit.
     * 
     * @param {String} prefix
     */
    setPrefix: function(prefix) {
        this.prefix = prefix + '_';
        this.prefix_regexp = new RegExp(this.prefix + '([^\s]+)');
    },
    
    /**
     * Register a new handler with the given constructor function
     * 
     * @param {String} key
     * @param {Function} handler_function
     */
    registerHandler: function(key, handler_function) {
        this.handlers[key] = handler_function;
    },
    
    /**
     * Apply all behaviours on a given dom_element and it's children.
     * 
     * @param {HTMLElement} dom_element
     */
    applyBehaviour: function(parent_dom_element) {
        var dom_elements = this.getJsbElementsInDomElement(parent_dom_element);
        var dom_elements_length = dom_elements.length;
        var dom_element = null;
        var key = null;
        var key_match = null;

        for (var i = 0; i < dom_elements_length; i++) {
            dom_element = dom_elements[i];
            this.removeClassFromElement(dom_element, this.prefix);

            do {
                key_match = dom_element.className.match(this.prefix_regexp);
                if (key_match) {
                    key = key_match[1];
                    this.callHandler(key, dom_element);
                    this.removeClassFromElement(dom_element, this.prefix + key);
                }
            } while(key_match);

        }
        
        this.fireEvent('Jsb::BEHAVIOURS_APPLIED');
    },
    
    /**
     * Fires an event with the given name and values.
     * @param {String} name
     * @param {Object} [values={}]
     */
    fireEvent: function(name, values) {
        values = values || {};
        
        /*
         * Remember the last value for calls to `jsb.whenFired`
         */
        this.last_event_values[name] = values; 
        
        var listeners = this.listeners;
        var listeners_length = listeners.length;
        for (var i = 0; i < listeners_length; i++) {
            this.rawFireEventToListener(listeners[i], name, values);
        }
        
        if (name === 'Jsb::REMOVED_INSTANCE')
        {
            this.removeBoundListenersForInstance(values);
        }
    },
    
    /**
     * Adds an event listener for a given name or regular expression.
     * 
     * @param {String|RegExp} name_or_regexp
     * @param {Object|Function} [filter_or_cb=null]
     * @param {Function} cb
     */
    on: function(name_or_regexp, filter_or_cb, cb) {
        var filter = filter_or_cb || null;

        if (!cb) {
            filter = null;
            cb = filter_or_cb;
        }
        
        this.listeners.push([cb, name_or_regexp, filter]);

        var that = this;
        var off_handler = function() {
            that.off(name_or_regexp, cb);
        };
        
        /*
         * Call this method with your jsb instance, to allow automatic removal of the handler on
         * disposal of the jsb instance.
         */
        off_handler.dontLeak = function(element) {
            for (var i = 0; i < that.listeners.length; i++) {
                var listener = that.listeners[i];
                if (listener[0] === cb && listener[1] === name_or_regexp && listener[2] === filter) {
                    listener[3] = element;
                    return ;
                }
            }
        };
        
        return off_handler;
    },
    
    /**
     * Please call jsb.fireEvent('Jsb::REMOVED_INSTANCE', this) within your object
     * to free all handlers which are bound to the element (by using the dontLeak-method).
     * 
     * @private
     * 
     * @param instance Jsb Instance
     */
    removeBoundListenersForInstance: function(instance) {
        var new_listeners = [];
        var listeners = this.listeners;
        var listeners_length = listeners.length;
        for (var i = 0; i < listeners_length; i++) {
            if (listeners[i][3] !== instance) {
                new_listeners.push(listeners[i]);
            }
        }
        
        this.listeners = new_listeners;
    },
    
    /**
     * Removes an event listener for a given name or regular expression and handler function.
     *
     * The handler function needs to be the exact same Function object that was previously registered as an event handler.
     * 
     * @param {String|RegExp} name_or_regexp
     * @param {Function} cb
     */
    off: function(name_or_regexp, cb) {
        var listeners = this.listeners;
        this.listeners = [];
        var listeners_length = listeners.length;
        for (var i = 0; i < listeners_length; i++) {
            if (!(listeners[i][0] === cb && listeners[i][1].toString() === name_or_regexp.toString())) {
                this.listeners.push(listeners[i]);
            }
        }
    },

    /**
     * Register to an event as soon as it's fired for the first time
     * even if that happend earlier!
     * 
     * @param {String|RegExp} name_or_regexp
     * @param {Object|Function} [filter_or_cb=null]
     * @param {Function} cb
     */
    whenFired: function(name_or_regexp, filter_or_cb, cb)
    {
        var that = this;
        var filter = filter_or_cb;

        if (!cb) {
            filter = null;
            cb = filter_or_cb;
        }
                
        var off_handler = this.on(name_or_regexp, filter, cb);
        
        var is_regexp = (name_or_regexp instanceof RegExp);
        if (is_regexp) {
            for (var key in this.last_event_values) {
                if (this.last_event_values.hasOwnProperty(key) && key.match(name_or_regexp)) {
                    (function(key)
                    {
                        setTimeout(function()
                        {
                            that.rawFireEventToListener([cb, name_or_regexp, filter], key, that.last_event_values[key]);
                        }, 0);
                    })(key);
                }
            }
        } else {
            if (typeof this.last_event_values[name_or_regexp] !== 'undefined') {
                setTimeout(function()
                {
                    that.rawFireEventToListener([cb, name_or_regexp, filter], name_or_regexp, that.last_event_values[name_or_regexp]);
                }, 0);
            }
        }

        return off_handler;
    },
    
    /**
     * @private
     */
    rawFireEventToListener: function(listener, name, values) {
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
                listener[0](values, name);
            }
        }
    },
    
    /**
     * Call a specific handler on a given dom element
     * @private
     * @param {String} key
     * @param {HTMLElement} dom_element
     */
    callHandler: function(key, dom_element) {
        if (typeof this.handlers[key] === 'undefined') {
            if (typeof require === "undefined") {
                throw new Error('The handler ' + key + ' is not defined!');
            } else {
                require([key], function(require_result) {
                    if (typeof jsb.handlers[key] === 'undefined') {
                        if (typeof require_result === "undefined")
                        {
                            throw new Error('The handler ' + key + ' is not defined (even with requirejs)!');
                        }
                        else
                        {
                            jsb.registerHandler(key, require_result);
                        }
                    }
                    jsb.callHandler(key, dom_element);
                });
                return ;
            }
        }

        var value_string = null;
        var dashed_key_name = key.toString().replace(/\//g, "-");

        if (dom_element.getAttribute('data-jsb-' + dashed_key_name)) {
            /*
             * Nice, we have a class specific data-jsb attribute -> let's use that one!
             */
            value_string = dom_element.getAttribute('data-jsb-' + dashed_key_name);
        } else if (dom_element.getAttribute('data-jsb')) {
            /*
             * Nice, we have a data-jsb attribute -> let's use that one!
             */
            value_string = dom_element.getAttribute('data-jsb');
        }

        if (value_string !== null) {
            new this.handlers[key](dom_element, this.parseValueString(value_string));
        } else {
            new this.handlers[key](dom_element);
        }
    },
    
    /**
     * Parse a json or a query string into an object hash
     * @private
     * @param {String} value_string
     * @return {Object}
     */
    parseValueString: function(value_string) {
        if (value_string.substr(0, 1) == '{') {
            return JSON.parse(value_string);
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
            return value;
        }
    },

    /**
     * @private
     * @param {HTMLElement} dom_element
     * @param {String} class_name
     * @return {void}
     */
    removeClassFromElement: function(dom_element, class_name) {
        var element_class_name = dom_element.className;
        element_class_name = element_class_name.replace(new RegExp('(^|[\\s]+)' + class_name + '($|[\\s]+)'), '$1$2');
        dom_element.className = element_class_name;
    },

    /**
     * Return all elements within the dom_element, which match the
     * jsb prefix.
     * 
     * @private
     * @param {HTMLElement} dom_element
     * @returns {HTMLElement[]}
     */
    getJsbElementsInDomElement: function(dom_element) {
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
        
        return dom_elements;
    }
};

if (typeof jQuery !== 'undefined') {
    /*
     * If we have jQuery available, we can use the jQuery methods instead
     * of the native ones (thus having compatibility for IE < 8, FF < 3 and so on)
     */
    jsb.removeClassFromElement = function(dom_element, class_name) {
        jQuery(dom_element).removeClass(class_name);
    };
    
    jsb.getJsbElementsInDomElement = function(dom_element) {
        return jQuery(dom_element).find('.' + this.prefix);
    };
    
    jsb.parseValueString = function(value_string) {
        if (value_string.substr(0, 1) == '{') {
            return jQuery.parseJSON(value_string);
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
            return value;
        }
    };

    /*
     * Fire domready in a jQuery way!
     */
    
    jQuery(window.document).ready(function() {
        jsb.applyBehaviour(window.document);
    });

} else if (typeof MooTools !== 'undefined') {
    /*
     * If we have MooTools available, we can use the MooTools methods instead
     * of the native ones (thus having compatibility for IE < 8, FF < 3 and so on)
     */
    jsb.removeClassFromElement = function(dom_element, class_name) {
        $(dom_element).removeClass(class_name);
    };
    
    jsb.getJsbElementsInDomElement = function(dom_element) {
        return $(dom_element).getElements('.' + this.prefix);
    };
    
    jsb.parseValueString = function(value_string) {
        if (value_string.substr(0, 1) == '{') {
            return JSON.decode(value_string);
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
            return value;
        }
    };
    
    /*
     * Fire domready in a mootools way!
     */
    
    $(window).addEvent('domready', function() {
        jsb.applyBehaviour(window.document);
    });
} else {
    
    /*
     * Fire domready in a native way!
     */
    if (window.addEventListener) {
        window.addEventListener("DOMContentLoaded", function() {
            jsb.applyBehaviour(window.document);
        }, true);
    } else if(window.attachEvent)  {
        window.attachEvent("onLoad",function() {
            jsb.applyBehaviour(window.document);
        });
    }
}

if (typeof define !== "undefined") {
    define('jsb', function() {
        return jsb;
    });
}
