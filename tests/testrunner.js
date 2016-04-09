(function() {
    'use strict';

    require(['./../jsb'], function() {
        jsb.applyBehaviour(document.body);
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
        for (var i = 0; i < divs.length; i++) {
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

})();
