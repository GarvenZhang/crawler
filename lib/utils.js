const https = require('https')
const fs = require('fs')
const path = require('path')
const ProgressBar = require('progress')
const request = require('request')
const url = require('url')

const UA = require('../const/UA')
const MIME = require('../const/MIME')

exports.httpsHandle = (absUrl, filePath) => {
  // 请求头
  const headers = {
    'User-Agent': UA[Math.random() * UA.length | 0]
  }

  // 判断无后缀情况
  // 当后缀最后有斜杠的时候, 如'https://www.baidu.com/', 会自动匹配index.html / php等
  // 当后缀最后就是文件名时, 如'https://www.baidu.com/fejwiofjeoiwa', 则文件名称就是 fejwiofjeoiwa
  const pathname = url.parse(absUrl).pathname
  const special = path.extname(pathname) === '' && filePath.lastIndexOf('/') === filePath.length - 1
  let hash = +Date.now()
  let contentType = ''
  if (special) {
    filePath += hash
  }

  const ws = fs.createWriteStream(filePath)

  const httpStream = request({
    method: 'GET',
    url: absUrl,
    headers
  })

  // 联接Readable和Writable
  httpStream.pipe(ws)

  const bar = new ProgressBar(`资源进度: [:bar] :rate/bps :percent :etas | ${absUrl}`, {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: parseInt(httpStream.headers['content-length'] || 99999, 10)
  })

  return new Promise((resolve, reject) => {
    // 当获取到第一个HTTP请求的响应获取
    httpStream.on('response', (response) => {
      contentType = response.headers['content-type']
      bar.interrupt(`> 开始接收资源: ${absUrl}`)
    })

    httpStream.on('data', (chunk) => {
      // bar.tick(chunk.length)
    })

    httpStream.on('error', err => {
      reject(err)
    })

    // 下载完成
    ws.on('close', () => {
      if (special) {
        fs.rename(filePath, filePath.replace(hash, `index${MIME[contentType]}`), (err) => {
          resolve({bar})
        })
      } else {
        resolve({bar})
      }
    })
  })
}

exports.mkdir = (dirPath, localBaseUrl) => {
  const pathArray = dirPath.slice(1).split('/')

  pathArray.reduce((acc, val, i) => {
    if (i === pathArray.length) {
      return
    }
    if (!fs.existsSync(acc)) {
      fs.mkdirSync(acc)
    }
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
