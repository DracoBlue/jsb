define('ChangeClass', [], function()
{
    "use strict";

    var ChangeClass = function(dom_element, options)
    {
        options = options || {};
        options.remove_class = options.remove_class || '';
        options.add_class = options.add_class || '';

        /*
         * jQuery/Mootools
         */
        if (typeof $ !== 'undefined')
        {
            $(dom_element).addClass(options.add_class);
            $(dom_element).removeClass(options.remove_class);
        }
        else
        {
            /*
             * Native
             */
            if (options.remove_class)
            {
                dom_element['className'] = dom_element['className'].replace(options.remove_class, '');
            }
            if (options.add_class)
            {
                dom_element['className'] = dom_element['className'] + ' ' + options.add_class;
            }
        }
    };

    return ChangeClass;
});

