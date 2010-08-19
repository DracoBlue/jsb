/*
 * JsBehaviourToolkit 1.0.1
 *
 * Released on 19th August 2010.
 *
 * This file is part of JsBehaviour.
 * Copyright (c) 2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

JsBehaviourToolkit = {
    prefix: 'jsb_',
    
    handlers: {},
    
    registerHandler: function(key, handler_function) {
        this.handlers[key] = handler_function;
    },
    
    callHandler: function(key, dom_element) {
        if (typeof this.handlers[key] === 'undefined') {
            throw new Error('The handler ' + key + ' is not defined!');
        }
        
        var input_element = dom_element.getFirst('input');
        
        if (input_element) {
            var value = JSON.decode(input_element.get('value'));
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
            var key = dom_element.get('class').match(/jsb_([^\s]+)/)[1];
            this.callHandler(key, dom_element);
            dom_element.removeClass(this.prefix);
            dom_element.removeClass(this.prefix + '' + key);
        }
        
    }
};

$(window).addEvent('domready', function() {
    JsBehaviourToolkit.applyBehaviour(window.document);
});
