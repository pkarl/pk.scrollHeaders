/**
 * Matches selectors, and moves their text contents
 * to one or more target nodes.
 *
 * Currently used for scrolling header effects on blog
 * posts. As you scroll, text from headers you pass will appear
 * in the nav bar
 */
var scrollHeaders = (function() {
  'use strict';

  var module = {};

  // turn on test mode, attach priv methods to
  // module
  // function activateTestMode() {
  //   module.updateHeaderPositions = updateHeaderPositions;
  //   module.findNearestHeader = findNearestHeader;
  //   module.updateTarget = updateTarget;
  // }

  // simple throttle from @jonathansampson
  function throttle(callback, limit) {
    var wait = false;
    return function() {
      if (!wait) {
        callback.call();
        wait = true;
        setTimeout(function() { wait = false; }, limit);
      }
    };
  }

  // c/o http://youmightnotneedjquery.com/#trigger_native
  function trigger(target, nativeEventName) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(nativeEventName, true, false);
    target.dispatchEvent(event);
  }

  // loop over matches elements and record positions, returns arr
  function updateHeaderPositions(headers) {
    var posArr = [];
    Array.prototype.forEach.call(headers, function(el, i){
      posArr.push(el.offsetTop);
    });
    return posArr;
  }

  // find nearest selected element to pageYOffset, returns index
  function findNearestHeader(headerPositions, scrollPos) {
    var index = 0;
    while (headerPositions[index] < scrollPos) {
      index++;
    }
    return index > 0 ? index - 1 : 0;
  }

  // swaps text from nearest selected element --> target elements
  function updateTarget(headers, index, targets) {
    Array.prototype.forEach.call(targets, function(el, i){
      el.textContent = headers[index].textContent;
    });
  }

  // accepts selectors for watched elements and targets
  // optional callback, called on the scroll event (throttled to 50ms).
  // callback is passed the current scrollPos
  module.init = function(elSelector, targetSelector, scrollCallback) {

    var elWatched = document.querySelectorAll(elSelector);
    var elTargets = document.querySelectorAll(targetSelector);

    var headerPositions, scrollPos, index;

    window.addEventListener('resize', function() {
      headerPositions = updateHeaderPositions(elWatched);
    });

    trigger(window, 'resize');

    window.addEventListener('scroll', throttle(function() {
      scrollPos = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      index = findNearestHeader(headerPositions, scrollPos);
      updateTarget(elWatched, index, elTargets);

      if (typeof scrollCallback == 'function') {
        scrollCallback.call(null, scrollPos);
      }
    }, 50));

    trigger(window, 'scroll');
  };

  return module;
}());