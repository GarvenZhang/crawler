const https = require('https')
const fs = require('fs')
const path = require('path')

const httpsHandle = (absUrl, i, count) => {
  return new Promise((resolve, reject) => {
    https.get(absUrl, res => {
      // 回调参数只能有一个
      resolve({ res })
    }).on('error', err => {
      console.info(`http.get error: \n${absUrl}\n${err}\n自动尝试重新请求(${i}/${count})次`)
      reject(false)
    })
  })
}

const getResult = async (absUrl, i, count) => {
  const result = await httpsHandle(absUrl, i, count)
  if (!result) {
    const _result = await getResult(absUrl, i, count)
    return _result
  } else {
    return result
  }
}

exports.gets = async (absUrl) => {
  let count = 3
  let i = 0
  const result = await getResult(absUrl, i, count)
  return result
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
    })
  })
}
