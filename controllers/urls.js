const fs = require('fs')
const path = require('path')

const urlsHandle = require('../middlewares/urlsHandle')
const crawler = require('../middlewares/crawler')
const {
  len,
  notHandle,
  hasCreated,
  readyRequest,
  hasGotten,
  memory
} = global.crawler

module.exports = (ctx) => {
  const {
    data
  } = JSON.parse(ctx.request.body)

  // 更新处理
  memory.receive(data)
  memory.send(notHandle)

  // 请求缓冲处理
  notHandle.send(readyRequest, len)

  // 请求缓冲区空闲, 入栈needRequestArr
  
  // 请求完成, 入栈hasGottenStack

  // 创建完成, 入栈hasCreatedStack

  ctx.body = JSON.stringify({
    message: 'success'
  })
}
