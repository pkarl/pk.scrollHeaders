# pk.scrollTextSwap
This is a little module I wrote to support some in-article scrolling effects for http://eng.localytics.com.

<img src="http://fat.gfycat.com/SomeRemoteAngora.gif">

### Notes
* IE9+ compat
* There are no tests, because it's really just comparing numbers

## Installation

`bower install scroll-text-swap`

## Usage:

```javascript
// pass it a selector for headers, and a selector for text destination
scrollHeaders.init('h1, h2', '.nav-text');
```

```javascript
// it also accepts a callback which will be called on the scroll event (throttled to 50ms), callback is passed the scroll position
scrollHeaders.init('.article-h1, h2, h3', '.article-navH', function(scrollPos) {
  if ($('.article-content').offset().top > scrollPos) {
    $('.article-nav').removeClass('visible');
  } else {
    $('.article-nav').addClass('visible');
  }
});
```