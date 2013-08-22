
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
    
    
    var library_script_src = null;
    
    if (version === 'jquery')
    {
        document.getElementById('version_selector').selectedIndex = 1;
        library_script_src = 'http://code.jquery.com/jquery-1.6.2.min.js';
    }
    
    if (version === 'mootools')
    {
        document.getElementById('version_selector').selectedIndex = 2;
        library_script_src = 'http://ajax.googleapis.com/ajax/libs/mootools/1.3.2/mootools.js';
    }
    
    if (version === 'native')
    {
        document.getElementById('version_selector').selectedIndex = 3;
    }
    
    var injectScriptTag = function(src, cb)
    {
        var head = document.getElementsByTagName('head')[0] || document.documentElement;
        var script = document.createElement('script');
        
        /*
         * Have a proper onload-handling for every browser similar to jquery's getScript
         */
        var is_loaded = false;
        script.onload = script.onreadystatechange = function() {
            if (!is_loaded && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                is_loaded = true;
    
                /*
                 * Avoid memory leaks in IE
                 */
                script.onload = script.onreadystatechange = null;
                if (head && script.parentNode) {
                    head.removeChild(script);
                }
                cb();
            }
        };
    
        script.src = src;
        head.appendChild(script);
    };
    
    var loadAllBehavioursAndApplyThem = function()
    {
        /*
         * Wait for jsb to become available, afterwards apply the behaviours!
         */
        injectScriptTag('../JsBehaviourToolkit.js', function()
        {
            injectScriptTag('ChangeClass.js', function()
            {
                injectScriptTag('SucceedTest.js', function()
                {
                    injectScriptTag('Ping.js', function()
                    {
                        injectScriptTag('Pong.js', function()
                        {
                            injectScriptTag('WhenFiredTest.js', function()
                            {
                                injectScriptTag('OffTest.js', function()
                                {
                                    injectScriptTag('OffGeneratorTest.js', function()
                                    {
                                        injectScriptTag('WhenFiredOffTest.js', function()
                                        {
                                            jsb.applyBehaviour(document.body);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };
    
    /*
     * Load the library (if one is required)
     */
    
    if (library_script_src)
    {
        injectScriptTag(library_script_src, function()
        {
            loadAllBehavioursAndApplyThem();
        });
    }
    else
    {
        loadAllBehavioursAndApplyThem();
    }
    
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
