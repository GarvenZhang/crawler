const fs = require('fs')
const path = require('path')

const urlsHandle = require('../middleware/urlsHandle')
const crawler = require('../middleware/crawler')


module.exports = (ctx) => {
  const {
    dirPath, initialRootDirPath
  } = global.crawler
  let arr = JSON.parse(ctx.request.body)

  // 记录所有记录
  global.crawler.urls = ctx.request.body

  // 处理url列表为特定格式
  const {
    resources
  } = urlsHandle(arr.data)


  // 爬资源
  crawler(resources)

  ctx.body = JSON.stringify({
    message: 'success'
  })
}
