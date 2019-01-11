const https = require('https')
const fs = require('fs')
const path = require('path')
const ProgressBar = require('progress')

const httpsHandle = (absUrl, i) => {
  return new Promise((resolve, reject) => {
    https.get(absUrl, res => {
      // 回调参数只能有一个
      resolve({ res })
    }).on('error', err => {
      console.info(`http.get error: \n${absUrl}\n${err}\n自动尝试重新请求(${i})次`)
      reject(false)
    })
  })
}

const getResult = async (absUrl, i) => {
  const result = await httpsHandle(absUrl, i)
  if (!result) {
    const _result = await getResult(absUrl, ++i)
    return _result
  } else {
    return result
  }
}

exports.gets = async (absUrl) => {
  let i = 0
  const result = await getResult(absUrl, i)
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

    // 进度条
    // content-length 不一定有，注意有bug
    const bar = new ProgressBar(`资源进度: [:bar] :rate/bps :percent :etas | ${absUrl}`, {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: parseInt(res.headers['content-length'] || 99999, 10)
    })

    res.on('data', chunk => {
      ws.write(chunk)
      bar.tick(chunk.length)

      if (type === 'html') {
        html += chunk
      }
    }).on('end', () => {
      resolve({ absUrl, html, bar })
    })
  })
}
