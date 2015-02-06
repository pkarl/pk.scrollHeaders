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

  // loop over headers and record positions, returns arr
  function updateHeaderPositions(headers) {
    var posArr = [];
    Array.prototype.forEach.call(headers, function(el, i){
      posArr.push(el.offsetTop);
    });
    return posArr;
  }

  // find nearest header to pageYOffset & returns index
  function findNearestHeader(headerPositions, scrollPos) {
    var index = 0;
    while (headerPositions[index] < scrollPos) {
      index++;
    }
    return index > 0 ? index - 1 : 0;
  }

  // swaps text from nearest header --> target
  function updateTarget(headers, index, targets) {
    Array.prototype.forEach.call(targets, function(el, i){
      el.textContent = headers[index].textContent;
    });
  }

  // accepts selectors for headers and target, also accepts callback
  // which is called on the scroll event (throttled to 50ms). cb is passed scrollPos
  module.init = function(headerSelector, textTargetSelector, scrollCallback) {

    var headers = document.querySelectorAll(headerSelector);
    var textTargets = document.querySelectorAll(textTargetSelector);

    var headerPositions, scrollPos, index;

    window.addEventListener('resize', function() {
      headerPositions = updateHeaderPositions(headers);
    });

    trigger(window, 'resize');

    window.addEventListener('scroll', throttle(function() {
      scrollPos = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      index = findNearestHeader(headerPositions, scrollPos);
      updateTarget(headers, index, textTargets);

      if (typeof scrollCallback == 'function') {
        scrollCallback.call(null, scrollPos);
      }
    }, 50));

    trigger(window, 'scroll');
  };

  return module;
}());