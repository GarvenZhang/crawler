const ret = []

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
}, 5E3)

function addUrl (requestDetails) {
  if (ret.indexOf(requestDetails.url) > -1) {
    return
  }
  ret.push(requestDetails.url)
  sendUrlsDbc()
}

chrome.webRequest.onCompleted.addListener(
  addUrl,
  { urls: ['<all_urls>'] }
)
