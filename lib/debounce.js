module.exports = function (fn, wait, immediate) {
  let timer

  return function () {
    let args = arguments
    let self = this

    timer && clearTimeout(timer)

    if (immediate) {
      timer = setTimeout(function () {
        timer = null
      }, wait)

      !timer && fn.apply(self, args)
    } else {
      timer = setTimeout(function () {
        fn.apply(self, args)
      }, wait)
    }
  }
}
