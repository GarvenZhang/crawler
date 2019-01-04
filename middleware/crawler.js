// 爬html及相关静态资源

// 思路:
// 1 获取到html, 用 cheerio 分析出标签, 获取到以下标签的链接: [img, script, link]
// 2 整理url, 请求到资源
// 3 处理好文件夹, 对应好路径放进去

const path = require('path')
const fs = require('fs')
const {
  gets, mkdir, handleData
} = require('./utils')

/**
 * 创建所有外链资源
 * @param {*} resources - 资源外链数组
 * @return {Promise}
 */
function createOuterResources (resources) {
  resources.forEach(item => {
    const filePath = path.join(global.crawler.dirPath, item.relatedUrl.replace(/\?\d+$/g, ''))
    // 没有才发请求
    if (fs.existsSync(filePath)) {
      return
    }

    gets(item.absUrl).then((params) => {
      const {
        res
      } = params

      console.info(`${++global.crawler.logCount} 资源创建成功: ${filePath}`)

      const ws = fs.createWriteStream(filePath)
      handleData(res, ws, item.absUrl)
    }).catch(err => {
      console.error(err)
    })
  })
}

/**
 * 根据目录创建文件
 * @param {Array} resources - url列表
 * @param {String} resources[].relatedUrl - 相对路径
 * @param {String} resources[].absUrl - 绝对路径
 */
function crawler (resources) {
  const {
    dirPath
  } = global.crawler

  // 生成文件夹
  resources.forEach(item => {
    mkdir(item.relatedUrl, dirPath)
  })

  // 生成文件
  createOuterResources(resources)
}

module.exports = crawler
