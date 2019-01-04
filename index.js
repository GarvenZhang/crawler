// 爬html及相关静态资源

// 思路:
// 1 获取到html, 用 cheerio 分析出标签, 获取到以下标签的链接: [img, script, link]
// 2 整理url, 请求到资源
// 3 处理好文件夹, 对应好路径放进去

const cheerio = require('cheerio')
const http = require('http')
const https = require('https')
const path = require('path')
const fs = require('fs')
const url = require('url')

let localBaseUrl = ''
let host = ''


// const $ = cheerio.load('<img src="./img.png">')
// console.log($('img')[0].attribs.src)

function get (absUrl) {

  return new Promise((resolve, reject) => {

    http.get(absUrl, res => {
      // 回调参数只能有一个
      resolve({ res })
    }).on('error', err => {
      reject(`http.get error->\n${absUrl}\n${err}`)
    })

  })

}

function gets (absUrl) {

  return new Promise((resolve, reject) => {

    https.get(absUrl, res => {
      // 回调参数只能有一个
      resolve({ res })
    }).on('error', err => {
      reject(`http.get error: \n${err}`)
    })

  })

}

function mkdir (dirPath) {

  // if (!/^\/\w/.test(dirPath)) {
  //   return
  // }

  const pathArray = dirPath.slice(1).split('/')

  pathArray.reduce((acc, val, i) => {

    if (i === pathArray.length) {
      return
    }

    !fs.existsSync(acc) && fs.mkdirSync(acc)

    return path.resolve(acc, val)

  }, localBaseUrl)

}

/**
 * 解析资源外链
 * @param {String} str - 接收的字符串数据
 * @param {String} absUrl - 绝对url
 * @return {Array} - 外链资源arr {absUrl, relatedUrl}
 */
function parseResourcesLinks(str, absUrl) {

  let $ = cheerio.load(str);
  const tags = ['link', 'script', 'img']

  return tags.reduce((acc, val) => {

    Array.from($(val)).forEach(tag => {

      let link = tag.attribs.src || tag.attribs.href

      // 内嵌
      if (!link) {
        return
      }

      // console.log('link: ', link)
      let _absUrl = ''
      if (/^\/\w/.test(link)) {
        _absUrl = url.resolve(absUrl, link)
      } else if (/^https/.test(link)) {
        _absUrl = link.replace('https', 'http')
      } else if (/^\/\//.test(link)) {
        _absUrl = 'http:' + link
      } else {
        _absUrl = absUrl
      }
      // console.log('absUrl: ', _absUrl)

      acc.push({
        absUrl: _absUrl,
        relatedUrl: link
      })

    })

    return acc

  }, [])
}

/**
 * 创建所有外链资源
 * @param {*} resources - 资源外链数组
 * @return {Promise}
 */
function createOuterResources(resources) {

  resources.forEach(item => {

    if (
      host && (item.absUrl.indexOf(host) === -1) ||
      (/^https?/.test(item.relatedUrl))
    ) {
      return
    }

    const filePath = path.join(localBaseUrl, item.relatedUrl.replace(/\?\d+$/g, ''))
    // 没有才发请求
    if (fs.existsSync(filePath)) {
      return
    }

    gets(item.absUrl)
      .then((params) => {

        const {
          res, paramsObj
        } = params

        console.info(`${++global.logCount} 资源创建成功: ${filePath}`)

        const ws = fs.createWriteStream(filePath)
        handleData(res, ws, item.absUrl)

      })

  })

}

/**
 * 根据外链创建所有的文件夹
 * @param {Object} params - 参数对象
 * @param { String } params - Object.str
 * @param { String } params - Object.absUrl
 * @return {Array} - 资源列表
 */
function mkdirAll(params) {

  return new Promise((resolve, reject) => {

    const {
      str, absUrl
    } = params
    const resources = parseResourcesLinks(str, absUrl)
    resources.forEach(item => {
      mkdir(item.relatedUrl)
    })

    resolve(resources)
  })

}

/**
 * 处理接收数据
 * @param {Object} res - IncomingMessage对象
 * @param {Object} ws  - 可写流对象
 * @param {String} absUrl - 绝对路径
 */
function handleData(res, ws, absUrl) {

  return new Promise((resolve, reject) => {

    let str = ''

    res.on('data', chunk => {

      str += chunk
      ws.write(chunk)

    }).on('end', () => {

      if (/game\.html/.test(absUrl)) {
        console.log(`game.html 流: ${str}`)
      }

      resolve({ str, absUrl })
      console.log(`${++global.logCount} data接受完毕: ${absUrl}`)

    })

  })

}

/**
 * 获取外部资源链接
 * @param {String} absU - 绝对路径
 */
function getResourcesLinks(absU) {

  return get(absU)
    .then((params) => {

      const {
        res
      } = params
      const ws = fs.createWriteStream(path.resolve(localBaseUrl, 'index.html'))
      return handleData(res, ws, absU)

    }).catch(err => {
      console.error(err)
    })

}

// 请求html
// 写html
// 解析html, 得到资源路径, 创建文件夹
// 创建文件
module.exports = function crawler(params) {

  let {
    absU, dirPath, type, html, resources
  } = params

  localBaseUrl = dirPath
  host = url.parse(absU || '').host

  switch (type) {

    case 'url':
      getResourcesLinks(absU)
        .then((params) => {
          return mkdirAll(params)
        })
        .then((resources) => {
          createOuterResources(resources)
        })
      break

    case 'html':
      mkdirAll({ absUrl: absU, str: html })
        .then((resources) => {
          createOuterResources(resources)
        })
      break

    case 'urlsArray':
      resources.forEach(item => {
        mkdir(item.relatedUrl)
      })
      createOuterResources(resources)
      break
  }
}

// 问号的版本号什么时候加?

// console.log(path.extname('global') === '')
