const eventNames = {
  start: [ 'touchstart', 'mousedown' ],
  move: [ 'touchmove', 'mousemove' ],
  end: [ 'touchend', 'touchcancel', 'mouseup' ],
}

const closest = (el, fn) => {
  while (el) {
    if (fn(el)) {
      return el
    }
    el = el.parentNode
  }
}

const getCursorPosition = (event) => ({
  x: event.touches ? event.touches[0].clientX : event.clientX,
  y: event.touches ? event.touches[0].clientY : event.clientY,
})

const vendorPrefix = (function() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return '' // server environment
  // fix for:
  //    https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  //    window.getComputedStyle() returns null inside an iframe with display: none
  // in this case return an array with a fake mozilla style in it.
  const styles = window.getComputedStyle(document.documentElement, '') || ['-moz-hidden-iframe']
  const pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1]

  switch (pre) {
    case 'ms':
      return 'ms'
    default:
      return pre && pre.length ? pre[0].toUpperCase() + pre.substr(1) : ''
  }
})()


export {
  eventNames,
  closest,
  getCursorPosition,
  vendorPrefix,
}
