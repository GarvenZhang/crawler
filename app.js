const Koa = require('koa')
const koaBody = require('koa-body')
const router = require('koa-router')()
const path = require('path')
const url = require('url')
const fs = require('fs')

const crawler = require('./middlewares/crawler')
const urlsHandle = require('./middlewares/urlsHandle')
const beforeStart = require('./middlewares/beforeStart')
const beforeEnd = require('./middlewares/beforeEnd')

// 全局变量
global.crawler = {
  html: '', // html文本
  memory: [],
  // 用栈, 与顺序无关
  defaultStack: [],
  needRequestArr: [],
  hasGottenStack: [],
  hasCreatedStack: [],
  interval: 0,
  len: 0,
  limit: 0,
  urls: new Map(),
  hashMap: {},
  dirPath: '',  // 要存放的目录
  initialRootDirPath: '', // 资源原始根目录
  initialHtmlDirPath: '' // html原始目录
}

/**
 * 创建服务器
 * @param {Object} params - 参数
 * @param {String} params.html - html字符串
 * @param {String} params.target - 主域
 * @param {String} params.dirPath - 项目目录
 * @param {Number} params.port - 服务器端口
 * @param {Number} params.interval - 请求间隔时间
 * @param {Number} params.len - 请求缓冲区长度
 * @param {Number} params.limit - 低于此值时填充缓冲区
 * @returns {Object} - koaapp
 */
function createServer (
  {
    target,
    dirPath,
    port = 3E3,
    domainBlackList = [],
    interval = 1E2,
    len = 10,
    limit = 5
  } = {}
) {
  const urlObj = url.parse(target)

  global.crawler = {
    ...global.crawler,
    dirPath,
    initialRootDirPath: urlObj.protocol + '//' + urlObj.hostname,
    initialHtmlDirPath: urlObj.href.replace('/index.html', ''),
    domainBlackList,
    interval,
    len,
    limit
  }

  const app = new Koa()

  // 服务启动时处理
  beforeStart()

  // body解析
  app.use(
    koaBody({
      jsonLimit: '10mb'
    })
  )

  // 路由
  app.use(require('./routes/index')).use(router.allowedMethods())

  // 监听
  app.listen(port, err => {
    err && console.error(`app.listen error: ${port}`)
    console.log(`Listening at localhost:${port}`)
  })

  return app
}

// 程序终止前处理
process.on('SIGINT', () => {
  // TODO:
  beforeEnd()
  setTimeout(() => {
    process.exit()
  }, 2E3)
})

module.exports = createServer
