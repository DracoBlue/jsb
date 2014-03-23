define('AddClass', [], function()
{
    "use strict";

    var ChangeClass = function(dom_element, options)
    {
        options = options || {};
        options.add_class = options.add_class || '';

        /*
         * jQuery/Mootools
         */
        if (typeof $ !== 'undefined')
        {
            $(dom_element).addClass(options.add_class);
        }
        else
        {
            /*
             * Native
             */
            if (options.add_class)
            {
                dom_element['className'] = dom_element['className'] + ' ' + options.add_class;
            }
        }
    };

    return ChangeClass;
});

