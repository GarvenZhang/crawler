const https = require('https')
const fs = require('fs')
const path = require('path')

exports.gets = (absUrl) => {
  return new Promise((resolve, reject) => {
    https.get(absUrl, res => {
      // 回调参数只能有一个
      resolve({ res })
    }).on('error', err => {
      reject(`http.get error: \n${absUrl}\n${err}`)
    })
  })
}

exports.mkdir = (dirPath, localBaseUrl) => {
  const pathArray = dirPath.slice(1).split('/')

  pathArray.reduce((acc, val, i) => {
    if (i === pathArray.length) {
      return
    }

    !fs.existsSync(acc) && fs.mkdirSync(acc)

    return path.resolve(acc, val)
  }, localBaseUrl)
}

exports.canAccess = (path) => {
  let ret = true
  try {
    fs.accessSync(path, fs.constants.R_OK | fs.constants.W_O)
  } catch (e) {
    ret = false
  }
  return ret
}

/**
 * 处理接收数据
 * @param {Object} res - IncomingMessage对象
 * @param {Object} ws  - 可写流对象
 * @param {String} absUrl - 绝对路径
 */
exports.handleData = (res, ws, absUrl, type) => {
  return new Promise((resolve, reject) => {
    let html = ''

    res.on('data', chunk => {
      ws.write(chunk)

      if (type === 'html') {
        html += chunk
      }
    }).on('end', () => {
      resolve({ absUrl, html })
      console.log(`${++global.crawler.logCount} data接受完毕: ${absUrl}`)
    })
  })
}
