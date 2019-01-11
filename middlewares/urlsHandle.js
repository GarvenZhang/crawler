const path = require('path')
const url = require('url')
const fs = require('fs')
const {
  getCategoryData
} = require('../middlewares/statusHandle')

// 拿回来的资源分两种: 主域下, 其它域下
// 要先拿到主域, 然后在得到的relatedUrl中替换掉主域
// 其它域的话把 协议 + 域名 替换成hash
// html中同样需要把主域替换成相对路径, 剩下的域替换成hash

// 1 过滤掉无后缀名的
// 2 去掉参数
// 3 统一路径: 取path
// 4 把域名过滤成hash表

function hash (domain) {
  const {
    hashMap
  } = global.crawler

  if (!hashMap[domain]) {
    hashMap[domain] = Date.now().toString()
  }

  return hashMap[domain]
}

function relatedUrlHandle (RemovedTslUrl) {
  const {
    initialRootDirPath
  } = global.crawler

  const urlObj = url.parse(RemovedTslUrl)
  const _domain = `${urlObj.protocol}//${urlObj.hostname}`

  if (_domain !== initialRootDirPath) {
    return `./${hash(_domain)}${urlObj.pathname}`
  } else {
    return `.${urlObj.pathname}`
  }
}

/**
 * 整理成特定格式
 * @returns {{resources: [{absUrl: String, relatedUrl: String}], hashMap: {domain: String}}} 特定格式对象
 */
function urlsHandle () {
  let ret = []
  const {
    needRequest
  } = getCategoryData()

  ret = needRequest.map(item => ({
    absUrl: item,
    relatedUrl: relatedUrlHandle(item)
  }))

  // ret = ret.filter(item => /^https/.test(item.absUrl) && path.extname(item.relatedUrl) !== '')

  return {
    resources: ret
  }
}

module.exports = urlsHandle
