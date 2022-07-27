import {
    registerHandler,
    applyBehaviour
} from '../../dist/jsb.es.js';
class AjaxInclude {

    constructor(dom_element, options = {}) {
        this.dom_element = jQuery(dom_element);
        this.options = options;
        this.options.method = this.options.method || 'replace';
        this.loadNow();
    }

    loadNow() {
        const request_options = this.options.options || {};
        request_options.url = this.options.url;

        $.ajax(request_options)
            .done((data) => {
                const method_name = this.options.method;
                const parent = this.dom_element.parent();
                if (method_name === 'replace') {
                    this.dom_element.replaceWith(data);
                } else {
                    this.dom_element[method_name](data);
                }
                /*
                 * Execute all behaviours on it's parent.
                 */
                applyBehaviour(parent.get(0));
            });
    }
}

registerHandler('ajax_include', AjaxInclude);
export default AjaxInclude;
