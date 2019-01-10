const fs = require('fs')
const path = require('path')

const urlsHandle = require('../middlewares/urlsHandle')
const crawler = require('../middlewares/crawler')
const {
  init
} = require('../middlewares/statusHandle')

module.exports = (ctx) => {
  let {
    data
  } = JSON.parse(ctx.request.body)

  // 状态化
  init(data)

  // 处理url列表为特定格式
  const {
    resources
  } = urlsHandle()

  // 爬资源
  crawler(resources)

  ctx.body = JSON.stringify({
    message: 'success'
  })
}
