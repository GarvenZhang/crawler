const fs = require('fs')
const path = require('path')

const urlsHandle = require('../middlewares/urlsHandle')
const crawler = require('../middlewares/crawler')
const {
  init
} = require('../middlewares/statusHandle')
const {
  len,
  memory,
  defaultStack,
  needRequestArr,
  hasGottenStack,
  hasCreatedStack,
  domainBlackList
} = global.crawler

module.exports = (ctx) => {
  let {
    data
  } = JSON.parse(ctx.request.body)

  // 找出新增, 入栈defaultStack
  data.forEach(item => {
    // 黑名单拦截
    if (domainBlackList.some(url => item.indexOf(url) > -1)) {
      return
    }
    // 已存在的拦截
    if (memory.includes(item)) {
      return
    }
    // 记忆备份
    memory.push(item)
    // 放入defaultStack入栈
    defaultStack.push(item)
  })

  // 请求缓冲区空闲, 入栈needRequestArr
  while (needRequestArr.length < len) {
    const url = defaultStack.pop()
    needRequestArr.push(url)

    // 处理url列表为特定格式
    const {
      resources
    } = urlsHandle()

    // 爬资源
    crawler(resources)
  }
  // 请求完成, 入栈hasGottenStack

  // 创建完成, 入栈hasCreatedStack

  // 状态化
  init(data)

  ctx.body = JSON.stringify({
    message: 'success'
  })
}
