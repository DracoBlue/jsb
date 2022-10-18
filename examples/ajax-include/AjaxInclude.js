import {
    registerHandler,
    applyBehaviour
} from '../../dist/jsb.es.js';
class AjaxInclude {

    constructor(dom_element, options = {}) {
        this.dom_element = dom_element;
        this.options = options;
        this.options.method = this.options.method || 'replace';
        this.loadNow();
    }

    loadNow() {
        fetch(this.options.url)
            .then((response) => response.text())
            .then((data) => {
                const method_name = this.options.method;
                const parent = this.dom_element.parentNode;
                const div = document.createElement('div');

                div.innerHTML = data;

                const elements = [].slice.call(div.childNodes);

                if (method_name === 'replace') {
                    this.dom_element.replaceWith(...elements);
                } else {
                    this.dom_element[method_name](...elements);
                }
                /*
                 * Execute all behaviours on it's parent.
                 */
                applyBehaviour(parent);
            });
    }
}

registerHandler('ajax_include', AjaxInclude);
export default AjaxInclude;
