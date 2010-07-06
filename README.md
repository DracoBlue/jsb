JsBevhaviour README
=======================

Version: 1.0

Official Site: <http://dracoblue.net/>

JsBehaviour is copyright 2010 by DracoBlue <http://dracoblue.net>

What is JsBehaviour?
--------------------

JsBehaviour A very extendable Toolkit to inject Javascript Behaviour into
rendered HTML without Inline Javascript.

It works currently only with mootools.

How does it work?
-----------------

The idea behind JsBehaviour is pretty simple. Put a class (jsb_) on all
elements which should be enriched/enhanced by javascript. Additionally
put a class jsb_*keyword* on the element to define which behaviour
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
tag (right after the mootools definition):

    <script type="text/javascript" src="js/JsBehaviourToolkit.js"> </script>

Additionally add this one:

    <script type="text/javascript" src="js/ExampleBehaviour.js"> </script>

Now create a new file `ExampleBehaviour.js`

    ExampleBehaviour = new Class( {

        Implements: [
            Events, Options
        ],
    
        is_open: false,

        initialize: function(dom_element, options) {
            dom_element.set('text', 'I am loaded with name: ' + options.name);
        }
    }
    JsBehaviourToolkit.registerHandler('example', ExampleBehaviour);

Now add somewhere in your html code the following:

    <span class="jsb_ jsb_example"><input type="hidden" value="{&quot;name&quot;:&quot;Jan&quot;}" />Are you loaded?</span>

When you execute the html page now, the text "Are you loaded?" won't display,
but will be replaced with 'I am loaded with name: Jan'.

## Generate the Html-Tag with PHP

You can generate this tag easily with PHP:

    <span class="jsb_ jsb_example"><input type="hidden" value="<?php echo htmlspecialchars(json_encode(array("name" => "Jan")))"/> Are you loaded?</span>

## Generate the Html-Tag with Spludo-Framework

You can drop in the [spludo] plugin from the spludo-plugin folder into your
spludo application folder.

    var JsBehaviourToolkit = require("JsBehaviourToolkit");
    var element_xml = JsBehaviourToolkit.createElementXml({
        'tag': 'span',
        'key': "example",
        'value': {
            "name": "Jan",
        }
    });

  [spludo]: http://spludo.com

Resources
----------

* Blog: <http://dracoblue.net/c/js-behaviour/>
* Feed: <http://dracoblue.net/c/js-behaviour/feed/>
* Issue Tracker: <http://github.com/DracoBlue/js-behaviour/issues>

Thanks
-------
Thanks to hoffigk for the discussions and feedback!

License
--------

JsBehaviour is licensed under the terms of MIT. See LICENSE for more information.
