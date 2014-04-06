
(function() {
    /*
     * Get the selected version and load the required library
     */
    var version = 'jquery';
    var version_match = document.location.toString().match(/\?version\=(\w+)/);
    
    if (version_match)
    {
        version = version_match[1];
    }

    var libraries = [];
    
    if (version === 'jquery')
    {
        document.getElementById('version_selector').selectedIndex = 1;
        libraries.push('jquery');
    }
    
    if (version === 'mootools')
    {
        document.getElementById('version_selector').selectedIndex = 2;
        libraries.push('mootools');
    }
    
    if (version === 'native')
    {
        document.getElementById('version_selector').selectedIndex = 3;
    }

    require.config({
        baseUrl: "./",
        urlArgs: "cb=" +  (new Date()).getTime(),
        paths: {
            "jquery": "http://code.jquery.com/jquery-1.6.2.min",
            "mootools": "http://ajax.googleapis.com/ajax/libs/mootools/1.3.2/mootools"
        }
    });

    require(libraries, function()
    {
        require(["./../jsb"], function() {
            jsb.applyBehaviour(document.body);
        });
    });

    /*
     * Load the library (if one is required)
     */

    setInterval(function() {
        /*
         * Update test counter (poor man style, but works even without frameworks;))
         */
        var divs = document.getElementsByTagName('div');
        var tests_failed = 0;
        var tests_ok = 0;
        for (var i = 0; i < divs.length; i++)
        {
            if (divs[i].className.indexOf('test_failed') > -1)
            {
                tests_failed++;
            }
            else
            {
                if (divs[i].className.indexOf('test_succeeded') > -1)
                {
                    tests_ok++;
                }
            }
        }
        
        document.getElementById('tests_succeeded').textContent = tests_ok;
        document.getElementById('tests_count').textContent = tests_ok + tests_failed;
    }, 100);
    
})();
