jsb README
=======================

Latest Release: [![GitHub version](https://badge.fury.io/gh/DracoBlue%2Fjsb.png)](https://github.com/DracoBlue/jsb/releases)

Build-Status: [![Build Status](https://travis-ci.org/DracoBlue/jsb.png?branch=master)](https://travis-ci.org/DracoBlue/jsb)

Official Site: <http://dracoblue.net/>

jsb is copyright 2010-2022 by DracoBlue <http://dracoblue.net>

What is Jsb?
--------------------

Jsb is very extendable toolkit to inject JavaScript behaviour into
rendered HTML without inline JavaScript.

How does it work?
-----------------

The idea behind jsb is pretty simple. Put a class (jsb_) on all
elements which should be enriched/enhanced by JavaScript. Additionally
put a class `jsb_`*keyword* on the element to define which behaviour
should be applied to the element.

Each behaviour can register on such *keyword* by using the `registerHandler` method

```javascript
import { registerHandler } from 'node-jsb'

registerHandler('keyword', KeywordBehaviour)
```

As soon as the dom is loaded call:

```javascript
import { applyBehaviour } from 'node-jsb'

applyBehaviour(document.documentElement)
```

If you use ES modules, you do not need a dom ready event.

Example
-------

Create a new file `js/Example.js` and include it as a module.

```html
<script type="module" src="js/Example.js"> </script>
```

Import the needed parts of jsb into your module:

```javascript
import { registerHandler } from 'jsb';

class Example {
    constructor(dom_element, options) {
        dom_element.textContent = `I am loaded with name: ${options.name}`;
    }
}

registerHandler('Example', Example);
```

Now add somewhere in your HTML code the following:

```html
<span class="jsb_ jsb_Example" data-jsb="{&quot;name&quot;:&quot;Jan&quot;}">Are you loaded?</span>
```

or with single attribute quotes:

```html
<span class="jsb_ jsb_Example" data-jsb='{"name": "Jan"}'>Are you loaded?</span>
```

When you execute the HTML page now, the text "Are you loaded?" won't display, but will be replaced with 'I am loaded with name: Jan'.

It is also possible to use the query string syntax:

```html
<span class="jsb_ jsb_Example" data-jsb="name=Jan&amp;param1=one">Are you loaded?</span>
```

Check out the generator functions for your favorite programming language.

If you want to have special data for one class, you might use `data-jsb-Keyword`.

```html
<span class="jsb_ jsb_Example" data-jsb-Example="{&quot;name&quot;:&quot;Jan&quot;}">Are you loaded?</span>
```

Foldernames must be replaced with dashes, so: `view/ui/Gui` becomes to `data-jsb-view-ui-Gui`.

It's also possible to put multiple classes on one element:

```html
<span class="jsb_ jsb_Example jsb_OtherExample" data-jsb="name=Jan&amp;param1=one" data-jsb-OtherExample="only=for-other">Are you loaded?</span>
```

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

```php
/**
 * @example <pre>
 *    <span class="jsb_ jsb_Example" data-jsb="<?php echo jsbOptions(array('name' => 'Jan')); ?>"></span>
 * </pre>
 */
function jsbOptions(array $options = array()) {
    return htmlspecialchars(json_encode($options));
}
```

Advanced: Using with bundler (webpack/rollup/parcel)
----------------------------------------

If you are using a bundler, please don't forget to add `registerHandler` at the end of your behaviour.

Advanced: Using with requirejs and npm
----------------------------------------

If you want to avoid to include all those script tags:
```html
<script src="js/Example.js"></script>
```
for your behaviours, you may use requirejs.

Install jsb with npm:

```console
$ npm install node-jsb --save
```

Inject a config to tell requirejs, where jsb lives in and afterwards apply all behaviours on `document.documentElement`:

```html
<script src="js/requirejs.js"> </script>
<script>
 requirejs.config({
     baseUrl: './js/', // if your files live in the /js/ folder
     paths: {
         jsb: './node_modules/node-jsb/dist/jsb'
     }
 });

 require(['jsb'], (jsb) => {
    let runJsb = () {
        // using the "UnknownHandlerException" error to require the missing modules
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
    runJsb();
 });
</script>
```

Create a new file (`js/Example.js`), but don't include it with `<script>` into the head.
Calling `registerHandler` is also not needed with requirejs.

```javascript
define('Example', () => {
    'use strict';

    class Example {
        constructor(dom_element, options) {
            dom_element.textContent = 'I am loaded with name: ' + options.name;
        }
    }

    return Example;
});
```

And now just include your behaviours in HTML, e.g.:

```html
<span class="jsb_ jsb_Example" data-jsb="name=Jan&amp;param1=one">Are you loaded?</span>
```

If jsb notices that the handler "Example" is not yet registered, internally it will throw the `UnknownHandlerException` error.
You need to catch the error and load your module with requirejs like in the example above.

This is very good if you want to keep the global namespace clean (since `class Example` defines a local variable). It's
also very nice, if you only want to load the element on demand!

You can even use sub folders of any required depth: Put the file into `js/mymodule/Example.js` and call it from HTML with
`class="jsb_ jsb_mymodule/Example.js"`.

Advanced: Communication between instances
-----------------------------------------

If you get used to `jsb`, you'll noticed that you have the need to communicate
between multiple jsb_-objects.

### fireEvent(`name`, `[values = {}, sticky = false`)

Jsb ships with a very simple (by design) event system. It is
framework independent and works with simple channel identifier and a
json-object as value.

```javascript
fireEvent('HoneyPot::CLICKED', {'name': 'Bob', 'times': 2});
```

This should be fired by a module which needs to say something, instead
of global variables and direct call. This enables you to use dependency
injection if you keep the channel identifier the same.

If you set `sticky` to `true` or use the `jsb.fireStickyEvent` alias, you can retrieve multiple events with the same name with `jsb.whenFired`.

### on(`name`, `[filter, ]` `callback`)

You can listen to that event, too:

```javascript
import { on } from 'node-jsb';

on(
    // identifier
    'HoneyPot::CLICKED',

    // callback
    (values, eventName) => {
        console.log(`The user ${values.name} clicked it already ${values.times}`);
    }
);
```

It's even possible to filter for a filter-object when listening:

```javascript
import { on } from 'node-jsb';

on(
    // identifier
    'HoneyPot::CLICKED',

    // filter everything with name = Bob
    {'name': 'Bob'},

    // callback
    (values, eventName) => {
        console.log(`The user ${values.name} clicked it already ${values.times}`);
    }
);
```

You may also use RegExp as channel identifier when calling `on`:

```javascript
import { on } from 'node-jsb';

on(
    // identifier which starts with HoneyPot*
    /^HoneyPot.*$,

    // callback
    (values, eventName) => {
        console.log(`The user ${values.name} clicked it already ${values.times} width event name: ${eventName}`);
    }
);
```

### off(`name`, `callback`)

Event handlers can be removed by passing the exact same name/regex and function object to `off`.

```javascript
import { on, off, fireEvent} from 'node-jsb';

let counter = 0;
let handler = () => {
    counter++
};

// listen
on('OFF_TEST', handler);

// counter is now 1
fireEvent('OFF_TEST');

// remove the handler
off('OFF_TEST', handler);

// counter is still 1 because the listener was removed before the second event fired
fireEvent('OFF_TEST');
```

Alternatively `on` returns a function that can be called without any parameters and will remove the name/handler pair that was registered by `on` in that call.

```javascript
import { on, off, fireEvent} from 'node-jsb';

let counter = 0;
let handler = () => {
    counter++
};

// add listener and save the result
let off = on('OFF_TEST', handler);

// counter is now 1
fireEvent('OFF_TEST');

// call the function to remove the listener
off();

// counter is still 1 because the listener was removed before the second event fired.
fireEvent('OFF_TEST');
```

### whenFired(`name`, `[filter, ]` `callback`)

If the event may be triggered before your jsb class is loaded, you can use `whenFired`. Afterwards it behaves the same like `on`.

```javascript
import { on, fireEvent, whenFired} from 'node-jsb';

let counter = 0;

// event called before listening
fireEvent('MASTER_READY', { "key": "value"});

// listen
whenFired(/^MASTER_READY$/, (values, event_name) => {
    /*
     * Will be called IMMEDIATELY because the event
     * was already fired.
     */
    counter++;
});

// counter is now 2!
fireEvent('MASTER_READY', { "key": "value"});
```

If you use `fireStickyEvent` in favor of `fireEvent`, it's also possible to use whenFired for multiple events with the same name.

Advanced: Using with nodejs
----------------------------------------

If you want to run mocha tests or want to use the event system of jsb in nodejs, you can install jsb as npm package, too!

```console
$ npm install node-jsb --save
```

In your source, you might use it like this:

```javascript
let jsb = require('node-jsb');

jsb.on('Event::NAME', () => {
    console.log('Hi!');
});

jsb.fireEvent('Event::NAME');
```

Resources
----------

* Blog: <http://dracoblue.net/c/jsb/>
* Issue Tracker: <http://github.com/DracoBlue/jsb/issues>

Changelog
---------

See CHANGELOG.md

Thanks
-------
Thanks to hoffigk and graste for the discussions and feedback!

Contributors
------------
* Lars Laade https://github.com/larslaade
* Leon Weidauer https://github.com/lnwdr
* Steffen Gransow https://github.com/graste
* Benny Görlitz https://github.com/axten

License
--------

Jsb is licensed under the terms of MIT. See LICENSE for more information.
