jsb CHANGELOG
=======================

* 3.0.0 (2016/04/10)
  - added UMD-wrapper to create a module with Node, AMD or browser globals #25
  - removed support for jQuery and MooTools, only a native version is provided
* 2.3.0 (2015/09/16)
  - added `fireStickyEvent` and `sticky` parameter to `fireEvent`
* 2.2.0 (2015/09/03)
  - don't try to listen to domready if window is not available (in case of nodejs)
  - added compatibility to nodejs
  - added mocha tests on cli
* 2.0.1 (2015/07/28)
  - fixed race condition in whenFired (see tests/WhenFiredRaceConditionTest)
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
