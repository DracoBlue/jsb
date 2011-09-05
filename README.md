JsBehaviour README
=======================

Version: 1.2.0

Date: 2011/09/05

Official Site: <http://dracoblue.net/>

JsBehaviour is copyright 2010-2011 by DracoBlue <http://dracoblue.net>

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

    JsBehaviourToolkit.registerHandler('keyword', KeywordBehaviour);

method. As soon as the dom is loaded

    JsBehaviourToolkit.applyBehaviour(window.document);

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
    
    JsBehaviourToolkit.registerHandler('example', ExampleBehaviour);

Now add somewhere in your html code the following:

    <span><input class="jsb_ jsb_example" type="hidden" value="{&quot;name&quot;:&quot;Jan&quot;}" />Are you loaded?</span>

When you execute the html page now, the text "Are you loaded?" won't display,
but will be replaced with 'I am loaded with name: Jan'.

It is also possible to use the query string syntax:

    <span><input class="jsb_ jsb_example" type="hidden" value="name=Jan&amp;param1=one" />Are you loaded?</span>

Check out the generator functions for your favorite programming language.

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
        return '<input class="jsb_ jsb_' . $name . '" type="hidden" value="' . htmlspecialchars(json_encode($options))" />';
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

Resources
----------

* Blog: <http://dracoblue.net/c/js-behaviour/>
* Feed: <http://dracoblue.net/c/js-behaviour/feed/>
* Issue Tracker: <http://github.com/DracoBlue/js-behaviour/issues>

Changelog
---------

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

License
--------

JsBehaviour is licensed under the terms of MIT. See LICENSE for more information.
