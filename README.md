jsb README
=======================

Latest Release: [![GitHub version](https://badge.fury.io/gh/DracoBlue%2Fjsb.png)](https://github.com/DracoBlue/jsb/releases)

Official Site: <http://dracoblue.net/>

jsb is copyright 2010-2014 by DracoBlue <http://dracoblue.net>

What is Jsb?
--------------------

Jsb is very extendable Toolkit to inject Javascript Behaviour into
rendered HTML without Inline Javascript.

Requirements:

* .jquery/.mootools-Version: Firefox, Safari, Chrome, Opera, IE6+
* .native-Version: Firefox 3+, Safari 5+, Chrome, Opera, IE9+
* (optional) requirejs - for on demand and subfolder loading

How does it work?
-----------------

The idea behind jsb is pretty simple. Put a class (jsb_) on all
elements which should be enriched/enhanced by javascript. Additionally
put a class `jsb_`*keyword* on the element to define which behaviour
should be applied to the element.

Each behaviour can register on such *keyword* by using this

    jsb.registerHandler('keyword', KeywordBehaviour);

method. As soon as the dom is loaded

    jsb.applyBehaviour(window.document);

is executed. You might even overwrite your Request.HTML method to do the
same.

Example
-------

Include the jsb into your website with the following meta
tag (before you define any behaviours):

    <script type="text/javascript" src="js/jsb.js"> </script>

Additionally add this one:

    <script type="text/javascript" src="js/Example.js"> </script>

Now create a new file `js/Example.js`

    Example = function(dom_element, options) {
       dom_element.textContent = 'I am loaded with name: ' + options.name;
    };
    
    jsb.registerHandler('Example', Example);

If you want to use requirejs integration, create it like this (no `registerHandler` necessary!):

    define("Example", [], function()
    {
        "use strict";

        var Example = function(dom_element, options) {
           dom_element.textContent = 'I am loaded with name: ' + options.name;
        };

        return Example;
    });

Now add somewhere in your html code the following:

    <span class="jsb_ jsb_Example" data-jsb="{&quot;name&quot;:&quot;Jan&quot;}" >Are you loaded?</span>

When you execute the html page now, the text "Are you loaded?" won't display,
but will be replaced with 'I am loaded with name: Jan'.

It is also possible to use the query string syntax:

    <span class="jsb_ jsb_Example" data-jsb="name=Jan&amp;param1=one" >Are you loaded?</span>

Check out the generator functions for your favorite programming language.

If you want to have special data for one class, you might use `data-jsb-ClassName`.

    <span class="jsb_ jsb_Example" data-jsb-Example="{&quot;name&quot;:&quot;Jan&quot;}">Are you loaded?</span>

Foldernames must be replaced with dashes, so: `view/ui/Gui` becomes to `data-jsb-view-ui-Gui`.

Since jsb 2.0 it's also possible to put multiple classes on one element:

    <span class="jsb_ jsb_Example jsb_OtherExample" data-jsb="name=Jan&amp;param1=one" data-jsb-OtherExample="only=for-other">Are you loaded?</span>


Why an Extra jsb_-Class?
---------------------

One could expect to use `class="jsb_Example"` instead of `class="jsb_ jsb_Example"`.
But this is necessary, since searching for all elements which have a class `jsb_*`
is way slower then using the built in methods to search for one class `jsb_`.

You can use one of the Generators (or build your own) to make generation of those
tags easier.

Generator-Helpers
-----------------

### PHP

``` php
<?php
/**
 * @example <pre>
 *    <span class="jsb_ jsb_Example" data-jsb="<?php echo jsbOptions(array('name' => 'Jan')); ?>"></span>
 * </pre>
 */
function jsbOptions(array $options = array()) {
    return htmlspecialchars(json_encode($options));
}
?>
```

Advanced: Using with requirejs and bower
----------------------------------------

If you want to avoid to include all those script tags:

    <script type="text/javascript" src="js/Example.js"> </script>

for your behaviours, you may use requirejs.

Install jsb with bower:

``` console
$ bower install jsb
```

Inject a config to tell requirejs, where jsb lives in bower_components folder and
afterwards apply all behaviours on `document.body`:

     <script type="text/javascript" src="js/requirejs.js"> </script>
     <script>
         requirejs.config({
             baseUrl: './js/', // if your files live in the /js/ folder
             paths: {
                 jsb: './bower_components/jsb/jsb'
             }
         });

         require(['jsb'], function() {
             jsb.applyBehaviour(document.body);
         });
     </script>
     <script type="text/javascript" src="js/jsb.js"> </script>

Create a new file (`js/Example.js`), but don't include it with `<script>` into the head:

    define("Example", [], function()
    {
        "use strict";

        var Example = function(dom_element, options) {
           dom_element.textContent = 'I am loaded with name: ' + options.name;
        };

        return Example;
    });

And now just include your Behaviours in HTML, e.g.:

    <span class="jsb_ jsb_Example" data-jsb="name=Jan&amp;param1=one" />Are you loaded?</span>

If jsb notices, that the handler "Example" is not yet registered. Internally it will call `require` for "Example" and use the result
with `jsb.registerHandler`. Afterwards is the handler for "Example" defined.

This is very good if you want to keep the global namespace clean (since `var Example` defines a local variable). It's
also very nice, if you only want to load the element on demand!

You can even use sub folders of any required depth: Put the file into `js/mymodule/Example.js` and call it from html with
`class="jsb_ jsb_mymodule/Example.js"`.

Force jQuery usage in jsb with requirejs
---------------------------

If you use jsb with requirejs, there is no dependency to jquery. But jsb would use jquery to find elements on the DOM, if
 it were available before jsb is loaded.

So, if you want to enforce it, define a shim like this:

     <script>
         requirejs.config({
             baseUrl: './js/', // if your files live in the /js/ folder
             paths: {
                 jsb: './bower_components/jsb/jsb',
                 jquery: './bower_components/jquery/dist/jquery'
             },
             shim: {
                 jsb: {
                    exports: 'jsb',
                    deps: ['jquery']
                 }
             }
         });

         require(['jsb'], function() {
             jsb.applyBehaviour(document.body);
         });
     </script>

Now jsb will use jQuery's methods to `parseJSON`, find `jsb_`-classified objects in the DOM and to modify the classes.

Advanced: Communication between instances
-----------------------------------------

If you get used to `jsb`, you'll noticed that you have the need to communicate
between multiple jsb_-objects.


### jsb.fireEvent(`name`, `[values = {}]`)

Since 1.3.0 jsb ships with a very simple (by design) event system. It is
framework independent and works with simple channel identifier and a
json-object as value.

    jsb.fireEvent('HoneyPot::CLICKED', {"name": "Bob", "times": 2});

This should be fired by a Js-Behaviour which needs to say something, instead
of global variables and direct call. This enables you to use dependency
injection if you keep the channel identifier the same.

### jsb.on(`name`, `[filter, ]` `callback`)

You can listen to that event, too:

    jsb.on(
        'HoneyPot::CLICKED', // identifier
        function(values, event_name) { // callback
            alert('The user ' + values.name + ' clicked it already ' + values.times);
        }
    );

It's even possible to filter for a filter-object when listening:

    jsb.on(
        'HoneyPot::CLICKED', // identifier
        {"name": "Bob"}, // filter everything with name = Bob
        function(values, event_name) { // callback
            alert('The user ' + values.name + ' clicked it already ' + values.times);
        }
    );

You may also use RegExp as channel identifier when calling `jsb.on`:

    jsb.on(
        /^HoneyPot.*$, // identifier which starts with HoneyPot*
        function(values, event_name) { // callback
            alert('The user ' + values.name + ' clicked it already ' + values.times + ' with event name: ' + event_name);
        }
    );

### jsb.off(`name`, `callback`)

Event handlers can be removed by passing the exact same name/regex and Function object to `jsb.off`.

    var counter = 0;
    var handler = function(){
        counter++
    };
    jsb.on('OFF_TEST', handler);
    jsb.fireEvent('OFF_TEST'); //counter is now 1
    jsb.off('OFF_TEST', handler);
    jsb.fireEvent('OFF_TEST'); //counter is still 1 because the listener was removed before the second event fired.

Alternatively `jsb.on` returns a function that can be called without any parameters and will remove the name/handler pair that was registered by `jsb.on` in that call.

    var counter = 0;
    var handler = function(){
        counter++
    };
    var off = jsb.on('OFF_TEST', handler);
    jsb.fireEvent('OFF_TEST'); //counter is now 1
    off();
    jsb.fireEvent('OFF_TEST'); //counter is still 1 because the listener was removed before the second event fired.

### jsb.whenFired(`name`, `[filter, ]` `callback`)

If the event may be triggered before your jsb class is loaded, you can use `jsb.whenFired`. Afterwards it behaves
the same like `jsb.on`.

    var counter = 0;
    jsb.fireEvent('MASTER_READY', { "key": "value"});
    jsb.whenFired(/^MASTER_READY$/, function(values, event_name) {
        /*
         * Will be called IMMEDIATELY because the event
         * was already fired.
         */
        counter++;
    });
    jsb.fireEvent('MASTER_READY', { "key": "value"});
    // counter is now 2!

Resources
----------

* Blog: <http://dracoblue.net/c/jsb/>
* Issue Tracker: <http://github.com/DracoBlue/jsb/issues>

Changelog
---------

* 2.0.0 (2014/04/08)
  - [BC] removed JsBehaviourToolkit global (use jsb now!) #20
  - define jsb as AMD module (if define-function is defined) #18
  - added specific data with `data-jsb-ClassName` #16
  - [BC] removed input[hidden] as source for jsb data #17
  - multiple behaviours can be put on one element #16
* 1.7.0 (2013/09/26)
  - requirejs don't need to call `jsb.registerHandler` anymore #11
  - refactored testrunner into require.js #10
  - bower.json added #13
* 1.6.2 (2013/09/18)
  - fireEvent/whenFired fires the event with values and event_name now
* 1.6.1 (2013/08/22)
  - use `setTimeout(*, 0)` in whenFired enable off handler #8
* 1.6.0 (2013/03/22)
  - added Jsb::BEHAVIOURS_APPLIED-Event which is fired as soon as all
    behaviours have been applied. May be called multiple times (on
    ajax and stuff)
  - added `.dontLeak()`-Method on off-Handler to remove the instance
    as soon as an instance got removed by triggering: Jsb::REMOVED_INSTANCE
    with `this` of the instance
* 1.5.0 (2013/01/09)
  - requirejs support added
* 1.4.1 (2012/10/16)
  - whenFired also returns the off handler
* 1.4.0 (2012/04/10)
  - cleaned up the tests cases and put them into a separate test runner
  - fixed bug in native version (did not work with first-input element)
  - added support for `data-jsb` instead of input element
  - merged all jsb versions into one JsBehaviourToolkit.js
  - added `jsb.whenFired(name, [filter, ] callback)`
  - added `examples/ajax-include`
  - added jsb.off method for event handler removal
  - added generator for event removal function to jsb.on
* 1.3.1 (2012/01/30)
  - check if the key still exists, before calling handler
* 1.3.0 (2012/01/04)
  - added `jsb.on(name, [filter, ] callback)`
  - added `jsb.fireEvent(name, (values = {}))`
* 1.2.3 (2011/12/31)
  - added jsb as alias for JsBehaviourToolkit
* 1.2.2 (2011/11/29)
  - fixes issue with parentNode in IE <= 7
* 1.2.1 (2011/11/19)
  - value was used before it was defined
* 1.2.0 (2011/09/05)
  - added support for jquery, mootools and a native version
  - added generator for php and rails
* 1.1.0 (2010/11/30)
  - jsb_ can be put right on an input field now
* 1.0.1 (2010/09/24)
  - bugfix with reg exp
* 1.0.0
  - initial release

Thanks
-------
Thanks to hoffigk and graste for the discussions and feedback!

Contributors
------------
* Lars Laade https://github.com/larslaade
* Leon Weidauer https://github.com/lnwdr
* Steffen Gransow https://github.com/graste

License
--------

JsBehaviour is licensed under the terms of MIT. See LICENSE for more information.
