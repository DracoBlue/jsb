// @ts-check

/*
 * jsb
 *
 * This file is part of jsb (Javascript Behaviour Toolkit).
 * Copyright (c) 2010-2022 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

let prefix = 'jsb_';
let prefix_regexp = /jsb_([^\s]+)/;

let handlers = {};
let listeners = [];
let last_event_values = {};
let sticky_event_values = {};

/**
 * Set the prefix for the jsb toolkit.
 *
 * @param {string} customPrefix
 */
export function setPrefix(customPrefix) {
    prefix = customPrefix + '_';
    prefix_regexp = new RegExp(prefix + '([^\\s]+)');
}

/**
 * Register a new handler with the given constructor function or class.
 *
 * @param {string} key
 * @param {Function} handler_function
 */
export function registerHandler(key, handler_function) {
    handlers[key] = handler_function;
}

/**
 * Tests if a handler is registered.
 *
 * @param {string} key
 * @returns boolean
 */
export function hasHandler(key) {
    return (typeof handlers[key] !== 'undefined');
}

/**
 * Apply all behaviours on a given dom-element and it's children.
 *
 * @param {HTMLElement} parent_dom_element
 */
export function applyBehaviour(parent_dom_element) {
    const dom_elements = getJsbElementsInDomElement(parent_dom_element);
    const dom_elements_length = dom_elements.length;

    for (let i = 0; i < dom_elements_length; i++) {
        let key_match;
        const dom_element = dom_elements[i];
        removeClassFromElement(dom_element, prefix);

        do {
            key_match = dom_element.className.match(prefix_regexp);
            if (key_match) {
                const key = key_match[1];

                callHandler(key, dom_element);
                removeClassFromElement(dom_element, prefix + key);
            }
        } while(key_match);
    }

    fireEvent('Jsb::BEHAVIOURS_APPLIED');
}

/**
 * Fires an event with the given name and values.
 * @param {string} name
 * @param {object} [values={}]
 * @param {boolean} [sticky=false]
 */
export function fireEvent(name, values = {}, sticky = false) {
    // Remember the last values for calls to `whenFired`
    if (sticky) {
        sticky_event_values[name] = sticky_event_values[name] || [];
        sticky_event_values[name].push(values);
    } else {
        last_event_values[name] = values;
    }

    listeners.forEach((listener) => rawFireEventToListener(listener, name, values));

    if (name === 'Jsb::REMOVED_INSTANCE') {
        removeBoundListenersForInstance(values);
    }
}

/**
 * Fires an event with the given name and values.
 * @param {string} name
 * @param {object} [values={}]
 */
export function fireStickyEvent(name, values = {}) {
    fireEvent(name, values, true);
}

/**
 * Adds an event listener for a given name or regular expression.
 *
 * @param {string|RegExp} name_or_regexp
 * @param {Function} cb
 * @param {object} [filter]
 * @returns {Function} off_handler
 */
export function on(name_or_regexp, cb, filter) {
    listeners.push([cb, name_or_regexp, filter]);

    let off_handler = () => {
        off(name_or_regexp, cb);
    };

    /**
     * Call this method with your class instance, to allow automatic removal of the handler on
     * disposal of the class instance.
     * @param {any} instance
     */
    off_handler.dontLeak = (instance) => {
        for (let i = 0; i < listeners.length; i++) {
            let listener = listeners[i];

            if (listener[0] === cb && listener[1] === name_or_regexp && listener[2] === filter) {
                listener[3] = instance;
                return;
            }
        }
    };

    return off_handler;
}

/**
 * Please call fireEvent('Jsb::REMOVED_INSTANCE', this) within your object
 * to free all handlers which are bound to the element (by using the dontLeak-method).
 *
 * @private
 *
 * @param {any} instance
 */
function removeBoundListenersForInstance(instance) {
    listeners = listeners.filter((listenerItem) => (listenerItem[3] !== instance));
}

/**
 * Removes an event listener for a given name or regular expression and handler function.
 *
 * The handler function needs to be the exact same Function object that was previously registered as an event handler.
 *
 * @param {String|RegExp} name_or_regexp
 * @param {Function} cb
 */
export function off(name_or_regexp, cb) {
    listeners = listeners.filter(
        (listenerItem) =>
            !(listenerItem[0] === cb && listenerItem[1].toString() === name_or_regexp.toString())
    );
}

/**
 * Register to an event as soon as it's fired for the first time
 * even if that happend earlier!
 *
 * @param {string|RegExp} name_or_regexp
 * @param {Function} cb
 * @param {object} [filter]
 * @returns {Function}
 */
export function whenFired(name_or_regexp, cb, filter) {
    let off_handler = on(name_or_regexp, cb, filter);

    let is_regexp = (name_or_regexp instanceof RegExp);

    if (is_regexp) {
        for (let key in last_event_values) {
            if (last_event_values.hasOwnProperty(key) && key.match(name_or_regexp)) {
                ((key) => {
                    let last_value = last_event_values[key];

                    setTimeout(() => {
                        rawFireEventToListener([cb, name_or_regexp, filter], key, last_value);
                    }, 0);
                })(key);
            }
        }
        for (let key in sticky_event_values) {
            if (sticky_event_values.hasOwnProperty(key) && key.match(name_or_regexp)) {
                ((key) => {
                    let last_values = sticky_event_values[key];
                    let last_values_length = last_values.length;

                    for (let i = 0; i < last_values_length; i++) {
                        ((last_value) => {
                            setTimeout(() => {
                                rawFireEventToListener([cb, name_or_regexp, filter], key, last_value);
                            }, 0);
                        })(last_values[i]);
                    }
                })(key);
            }
        }
    } else if (typeof name_or_regexp === 'string') {
        if (typeof last_event_values[name_or_regexp] !== 'undefined') {
            let last_value = last_event_values[name_or_regexp];

            setTimeout(() => {
                rawFireEventToListener([cb, name_or_regexp, filter], name_or_regexp, last_value);
            }, 0);
        }
        if (typeof sticky_event_values[name_or_regexp] !== 'undefined') {
            let last_values = sticky_event_values[name_or_regexp];
            let last_values_length = last_values.length;

            for (let i = 0; i < last_values_length; i++) {
                ((last_value) => {
                    setTimeout(() => {
                        rawFireEventToListener([cb, name_or_regexp, filter], name_or_regexp, last_value);
                    }, 0);
                })(last_values[i]);
            }
        }
    }

    return off_handler;
}

/**
 * @private
 * @param {Array} listener
 * @param {String} name
 * @param {Array.<(String|RegExp)>} values
 */
function rawFireEventToListener(listener, name, values) {
    let is_regexp_match = (listener[1] instanceof RegExp && name.match(listener[1]));

    if (is_regexp_match || listener[1] === name) {
        let filter = listener[2];
        let is_match = true;
        if (filter) {
            for (let filter_key in filter) {
                if (filter.hasOwnProperty(filter_key)) {
                    is_match = is_match && (typeof values[filter_key] !== 'undefined' && filter[filter_key] === values[filter_key]);
                }
            }
        }

        if (is_match) {
            listener[0](values, name);
        }
    }
}

/**
 * Exception for unknown key.
 * @private
 * @param {String} key
 * @param {HTMLElement} dom_element
 */
function UnknownHandlerException(key, dom_element) {
    this.name = 'UnknownHandlerException';
    this.message = `The handler ${key} is not definded.`;
    this.key = key;
    this.domElement = dom_element;
}

/**
 * Call a specific handler on a given dom element
 * @private
 * @param {String} key
 * @param {HTMLElement} dom_element
 */
function callHandler(key, dom_element) {
    if (typeof handlers[key] === 'undefined') {
        // add prefix again, to enable a re-run
        dom_element.classList.add(prefix);
        throw new UnknownHandlerException(key, dom_element);
    }

    let value_string = null;
    let dashed_key_name = key.toString().replace(/\//g, '-');

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
        new handlers[key](dom_element, parseValueString(value_string));
    } else {
        new handlers[key](dom_element);
    }
}

/**
 * Parse a json or a query string into an object hash
 * @private
 * @param {string} value_string
 * @returns {object}
 */
function parseValueString(value_string) {
    if (value_string.substring(0, 1) == '{') {
        return JSON.parse(value_string);
    } else {
        let value = {};
        let parts = value_string.split('&');
        let parts_length = parts.length;
        for (let i = 0; i < parts_length; i++) {
            let query_string_entry = parts[i].split('=');
            let value_key = decodeURIComponent(query_string_entry[0]);
            let value_content = decodeURIComponent(query_string_entry.slice(1).join('='));
            value[value_key] = value_content;
        }
        return value;
    }
}

/**
 * @private
 * @param {HTMLElement} dom_element
 * @param {string} class_name
 */
function removeClassFromElement(dom_element, class_name) {
    dom_element.classList.remove(class_name);
}

/**
 * Return all elements within the dom_element, which match the
 * jsb prefix.
 *
 * @private
 * @param {HTMLElement} dom_element
 * @returns {HTMLElement[]}
 */
function getJsbElementsInDomElement(dom_element) {
    /*
     * We need to use slice, because otherwise the returned array would
     * change as soon as we remove the element's className.
     */
    return [].slice.call(dom_element.getElementsByClassName(prefix));
}
