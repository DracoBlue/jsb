requirejs.config({
    baseUrl: '.',
    paths: {
        jsb: './../dist/jsb'
    }
});

require([
    'jsb'
], function(jsb) {
    'use strict';

    function runJsb() {
        try {
            jsb.applyBehaviour(document.documentElement);
        } catch (e) {
            if (e.name && e.name === 'UnknownHandlerException') {
                require([e.key], function(require_result) {
                    if (require_result && !jsb.hasHandler(e.key)) {
                        jsb.registerHandler(e.key, require_result);
                    }
                    runJsb();
                });
            }
        }
    }

    /*
     * Load the library (if one is required)
     */
    setInterval(function() {
        /*
         * Update test counter (poor man style, but works even without frameworks;))
         */
        let divs = document.getElementsByTagName('div');
        let tests_failed = 0;
        let tests_ok = 0;

        for (let i = 0; i < divs.length; i++) {
            if (divs[i].className.indexOf('test_failed') > -1) {
                tests_failed++;
            } else {
                if (divs[i].className.indexOf('test_succeeded') > -1) {
                    tests_ok++;
                }
            }
        }

        document.getElementById('tests_succeeded').textContent = tests_ok;
        document.getElementById('tests_count').textContent = tests_ok + tests_failed;
    }, 100);

    runJsb()
});
