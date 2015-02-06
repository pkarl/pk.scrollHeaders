/**
 * a module that looks for headers &
 * a destination for header text, and updates
 * the dest. on scroll
 */
var scrollHeaders = (function($) {
  'use strict';

  var module = {};

  // simple throttle from @jonathansampson
  function throttle(callback, limit) {
    var wait = false;
    return function() {
      if (!wait) {
        callback.call();
        wait = true;
        setTimeout(function() {
          wait = false;
        }, limit);
      }
    };
  }

  // loop over headers and record positions, returns arr
  function updateHeaderPositions($headers) {
    var posArr = [];
    $headers.each(function() {
      posArr.push($(this).offset().top);
    });
    return posArr;
  }

  // find nearest header to pageYOffset & returns index
  function findNearestHeader(headerPositions, scrollPos) {
    var index = 0;
    while (headerPositions[index] < scrollPos) {
      index++;
    }
    return index - 1;
  }

  // swaps text from nearest header --> target
  function updateTarget($headers, index, $target) {
    $target.text($headers.eq(index).text());
  }

  // accepts selectors for headers and target, also accepts callback
  // which is called on the scroll event (throttled to 50ms). cb is passed scrollPos
  module.init = function(headerSelector, textTargetSelector, scrollCallback) {

    var $headers = $(headerSelector);
    var $textTarget = $(textTargetSelector);

    var headerPositions, scrollPos, index;

    $(window).on('resize', function() {
      headerPositions = updateHeaderPositions($headers);
    }).trigger('resize');

    $(window).on('scroll', throttle(function() {
      scrollPos = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
      index = findNearestHeader(headerPositions, scrollPos);
      updateTarget($headers, index, $textTarget);

      if (typeof scrollCallback == 'function') {
        scrollCallback.call(null, scrollPos);
      }
    }, 50)).trigger('scroll');
  };

  return module;
}(jQuery));