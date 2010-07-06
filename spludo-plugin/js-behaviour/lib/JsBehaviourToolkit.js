/*
 * JsBehaviourToolkit 1.0
 *
 * Released on 6th July 2010.
 *
 * This file is part of JsBehaviour.
 * Copyright (c) 2010 DracoBlue, http://dracoblue.net/
 *
 * Licensed under the terms of MIT License. For the full copyright and license
 * information, please see the LICENSE file in the root folder.
 */

exports.createElementXml = function(options) {
    if (typeof options.tag === 'undefined') {
        throw new Error('The option .tag is not set!');
    }
    if (typeof options.key === 'undefined') {
        throw new Error('The option .key is not set!');
    }

    var key = options.key;
    var tag = options.tag;
    var content = options.content || '';

    var js_behaviour_config = config.get('js-behaviour', {});
    var prefix = js_behaviour_config.prefix || 'jsb_';
    
    var xml = ['<'];
    
    xml.push(tag);
    xml.push(' class="');
    
    if (options['class']) {
        xml.push(options['class'] + ' ');
    }
    
    xml.push(prefix);
    xml.push(' ');
    
    xml.push(prefix);
    xml.push(key);
    xml.push('">');
    
    if (typeof options.value !== 'undefined') {
        xml.push('<input type="hidden" value="' + StringToolkit.encodeXml(JSON.stringify(options.value)) + '" />');
    }

    if (options['inner']) {
        xml.push(options['inner']);
    }
    
    xml.push('</');
    xml.push(tag);
    xml.push('>');

    return xml.join('');
};
