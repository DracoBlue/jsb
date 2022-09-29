/**
 * Set the prefix for the jsb toolkit.
 *
 * @param {string} prefix
 */
export function setPrefix(prefix: string): void;
/**
 * Register a new handler with the given constructor function or class.
 *
 * @param {string} key
 * @param {Function} handler_function
 */
export function registerHandler(key: string, handler_function: Function): void;
/**
 * Tests if a handler is registered.
 *
 * @param {string} key
 * @returns boolean
 */
export function hasHandler(key: string): boolean;
/**
 * Apply all behaviours on a given dom-element and it's children.
 *
 * @param {HTMLElement} parent_dom_element
 */
export function applyBehaviour(parent_dom_element: HTMLElement): void;
/**
 * Fires an event with the given name and values.
 * @param {string} name
 * @param {object} [values={}]
 * @param {boolean} [sticky=false]
 */
export function fireEvent(name: string, values?: object, sticky?: boolean): void;
/**
 * Fires an event with the given name and values.
 * @param {string} name
 * @param {object} [values={}]
 */
export function fireStickyEvent(name: string, values?: object): void;
/**
 * Adds an event listener for a given name or regular expression.
 *
 * @param {string|RegExp} name_or_regexp
 * @param {Function} cb
 * @param {object} [filter]
 * @return Function off_handler
 */
export function on(name_or_regexp: string | RegExp, cb: Function, filter?: object): {
    (): void;
    /**
     * Call this method with your class instance, to allow automatic removal of the handler on
     * disposal of the class instance.
     * @param {any} instance
     */
    dontLeak(instance: any): void;
};
/**
 * Removes an event listener for a given name or regular expression and handler function.
 *
 * The handler function needs to be the exact same Function object that was previously registered as an event handler.
 *
 * @param {String|RegExp} name_or_regexp
 * @param {Function} cb
 */
export function off(name_or_regexp: string | RegExp, cb: Function): void;
/**
 * Register to an event as soon as it's fired for the first time
 * even if that happend earlier!
 *
 * @param {string|RegExp} name_or_regexp
 * @param {Function} cb
 * @param {object} [filter]
 */
export function whenFired(name_or_regexp: string | RegExp, cb: Function, filter?: object): {
    (): void;
    /**
     * Call this method with your class instance, to allow automatic removal of the handler on
     * disposal of the class instance.
     * @param {any} instance
     */
    dontLeak(instance: any): void;
};
