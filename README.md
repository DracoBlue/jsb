JsBehaviour README
=======================

Version: 1.6.1

Date: 2013/08/22

Official Site: <http://dracoblue.net/>

JsBehaviour is copyright 2010-2013 by DracoBlue <http://dracoblue.net>

What is JsBehaviour?
--------------------

JsBehaviour is very extendable Toolkit to inject Javascript Behaviour into
rendered HTML without Inline Javascript.

Requirements:

* .jquery/.mootools-Version: Firefox, Safari, Chrome, Opera, IE6+
* .native-Version: Firefox 3+, Safari 5+, Chrome, Opera, IE9+

How does it work?
-----------------

The idea behind JsBehaviour is pretty simple. Put a class (jsb_) on all
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

Include the JsBehaviourToolkit into your website with the following meta
tag (before you define any behaviours):

    <script type="text/javascript" src="js/JsBehaviourToolkit.js"> </script>

Additionally add this one:

    <script type="text/javascript" src="js/ExampleBehaviour.js"> </script>

Now create a new file `js/ExampleBehaviour.js`

    ExampleBehaviour = function(dom_element, options) {
       dom_element.textContent = 'I am loaded with name: ' + options.name;
    };
    
    jsb.registerHandler('example', ExampleBehaviour);

Now add somewhere in your html code the following:

    <span><input class="jsb_ jsb_example" type="hidden" value="{&quot;name&quot;:&quot;Jan&quot;}" />Are you loaded?</span>

When you execute the html page now, the text "Are you loaded?" won't display,
but will be replaced with 'I am loaded with name: Jan'.

It is also possible to use the query string syntax:

    <span><input class="jsb_ jsb_example" type="hidden" value="name=Jan&amp;param1=one" />Are you loaded?</span>

Check out the generator functions for your favorite programming language.

Since 1.4.0 it's possible to use also html5 data attributes:

    <span class="jsb_ jsb_example" data-jsb="{&quot;name&quot;:&quot;Jan&quot;}">Are you loaded?</span>

Why an Extra jsb_-Class?
---------------------

One could expect to use `class="jsb_example"` instead of `class="jsb_ jsb_example"`.
But this is necessary, since searching for all elements which have a class `jsb_*`
is way slower then using the built in methods to search for one class `jsb_`.

You can use one of the Generators (or build your own) to make generation of those
tags easier.

Generator-Helpers
-----------------

### PHP

    <?php
    /**
     * @example <pre>
     *    <?php echo jsb('example', array('name' => 'Jan')); ?>
     * </pre>
     */
    function jsb($name, array $options = array()) {
        return '<input class="jsb_ jsb_' . $name . '" type="hidden" value="' . htmlspecialchars(json_encode($options)) . '" />';
    }
    ?>

### Rails

    # Generates a jsb tag
    #
    #   <%= jsb('example', {:name => 'Jan'}) %>
    #
    def jsb(handler_name, data)
      tag("input", { :type => 'hidden', :class => 'jsb_ jsb_' + handler_name, :value => h(data.to_json) })
    end

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
        function(values) { // callback
            alert('The user ' + values.name + ' clicked it already ' + values.times);
        }
    );

It's even possible to filter for a filter-object when listening:

    jsb.on(
        'HoneyPot::CLICKED', // identifier
        {"name": "Bob"}, // filter everything with name = Bob
        function(values) { // callback
            alert('The user ' + values.name + ' clicked it already ' + values.times);
        }
    );

You may also use RegExp as channel identifier when calling `jsb.on`:

    jsb.on(
        /^HoneyPot.*$, // identifier which starts with HoneyPot*
        function(values) { // callback
            alert('The user ' + values.name + ' clicked it already ' + values.times);
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
    jsb.whenFired(/^MASTER_READY$/, function(values) {
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

* Blog: <http://dracoblue.net/c/js-behaviour/>
* Feed: <http://dracoblue.net/c/js-behaviour/feed/>
* Issue Tracker: <http://github.com/DracoBlue/js-behaviour/issues>

Changelog
---------

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
* Leon Weidauer http://sevenmil.es

License
--------

JsBehaviour is licensed under the terms of MIT. See LICENSE for more information.
