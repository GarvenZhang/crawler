// 若实际测试中代价太大, 应该要有测试用例来简化此过程
const ret = ['https://www.yiv.com/games/Fruit-Master/index.html', 'https://www.yiv.com/games/Fruit-Master/jquery-2.1.1.min.js', 'https://www.yiv.com/games/Fruit-Master/c2runtime.js', 'https://www.googleadservices.com/pagead/conversion.js', 'first-paint', 'https://googleads.g.doubleclick.net/pagead/viewthr…ter%2Findex.html&tiba=Fruit%20Master&rfmt=3&fmt=4', 'https://www.yiv.com/games/Fruit-Master/data.js', 'https://www.yiv.com/games/Fruit-Master/loading-logo.png', 'https://www.yiv.com/games/Fruit-Master/images/half-sheet1.png', 'https://www.yiv.com/games/Fruit-Master/images/half-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/half-sheet2.png', 'https://www.yiv.com/games/Fruit-Master/images/half-sheet3.png', 'https://www.yiv.com/games/Fruit-Master/images/half-sheet4.png', 'https://www.yiv.com/games/Fruit-Master/images/fruit-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/bg-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/splash1-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/splash1-sheet1.png', 'https://www.yiv.com/games/Fruit-Master/images/splash2-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/splash2-sheet1.png', 'https://www.yiv.com/games/Fruit-Master/images/splash2-sheet2.png', 'https://www.yiv.com/games/Fruit-Master/images/splash3.png', 'https://www.yiv.com/games/Fruit-Master/images/point-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/center-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/knife-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/juicerm-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/juicermask-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/juice-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/splash4.png', 'https://www.yiv.com/games/Fruit-Master/images/btngetknife-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/box-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/box-sheet1.png', 'https://www.yiv.com/games/Fruit-Master/images/sprite2-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/select-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/text.png', 'https://www.yiv.com/games/Fruit-Master/images/coin-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/btnback-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/title-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/tap-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/bar-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/barmask-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/progressbar.png', 'https://www.yiv.com/games/Fruit-Master/images/juicecup-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/arrow-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/arrow-sheet1.png', 'https://www.yiv.com/games/Fruit-Master/images/arrow-sheet2.png', 'https://www.yiv.com/games/Fruit-Master/images/sp-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/btncustomize-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/btnreset-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/red-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/sprmissed-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/plusscore-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/plusscore-sheet1.png', 'https://www.yiv.com/games/Fruit-Master/images/btnsound-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/btnsound-sheet1.png', 'https://www.yiv.com/games/Fruit-Master/images/sprite-sheet0.png', 'https://www.yiv.com/games/Fruit-Master/images/sitelogo-sheet0.png', 'https://www.google.com/pagead/1p-user-list/9754905…m=791455705&resp=GooglemKTybQhCsO&rmt_tld=0&ipr=y', 'https://www.google.com.ph/pagead/1p-user-list/9754…m=791455705&resp=GooglemKTybQhCsO&rmt_tld=1&ipr=y', 'first-contentful-paint', 'https://www.yiv.com/games/Fruit-Master/appmanifest.json', 'https://www.yiv.com/games/Fruit-Master/icon-256.png', 'https://www.yiv.com/games/Fruit-Master/media/cut.ogg', 'https://www.yiv.com/games/Fruit-Master/media/get_coin.ogg', 'https://www.yiv.com/games/Fruit-Master/media/juice.ogg', 'https://www.yiv.com/games/Fruit-Master/media/missed.ogg', 'https://www.yiv.com/games/Fruit-Master/media/move_coin.ogg', 'https://www.yiv.com/games/Fruit-Master/media/shoot.ogg', 'https://www.yiv.com/games/Fruit-Master/media/click.ogg', 'https://www.yiv.com/games/Fruit-Master/media/completed.ogg', 'https://www.yiv.com/js/GameApi.js', 'https://www.yiv.com/games/Fruit-Master/icon-256.png', 'https://connect.facebook.com/en_US/sdk.js?_=1548382369556']

function ajax ({method = 'get', async = true, data = null, url, headers = {} }) {
  return new Promise(function (resolve, reject) {
    // === readyState: 0 === //
    // === Client has been created. open() not called yet. === //
    let xhr = new XMLHttpRequest()

    // === readyState: 3 === //
    // === Downloading; responseText holds partial data. === //
    xhr.onreadystatechange = function () {
      // === readyState: 4 === //
      // === The operation is complete. === //
      if (this.readyState === 4) {
        if ((this.status >= 200 && this.status < 300) || this.status === 304) {
          try {
            resolve(JSON.parse(this.responseText))
          } catch (e) {
            resolve(this.responseText)
          }
        } else if (this.status >= 400) {
          reject(JSON.parse(this.responseText))
        }
      }
    }

    // === readyState: 1 === //
    // === open() has been called. === //
    xhr.open(method, url, async)

    for (let key in headers) {
      xhr.setRequestHeader(key, headers[key])
    }

    // === readyState: 2 === //
    // === send() has been called, and headers and status are available. === //

    xhr.send(data)
  })
}

function debounce (fn, wait, immediate) {
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

const sendUrlsDbc = debounce(function () {
  ajax({
    method: 'post',
    data: JSON.stringify({
      data: ret
    }),
    url: 'http://127.0.0.1:3000/urls'
  }).then(data => {
    if (data.message !== 'success') {
      return
    }
    console.log(ret)
  }).catch(err => {
    console.error(`ajax error: ${err}`)
  })
}, 0)

sendUrlsDbc()
