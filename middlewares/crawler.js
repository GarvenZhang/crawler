// 爬html及相关静态资源

// 思路:
// 1 获取到html, 用 cheerio 分析出标签, 获取到以下标签的链接: [img, script, link]
// 2 整理url, 请求到资源
// 3 处理好文件夹, 对应好路径放进去

const path = require('path')
const fs = require('fs')
const {
  gets, mkdir, handleData
} = require('../lib/utils')
const {
  update,
  getCategoryData
} = require('../middlewares/statusHandle')

const getSuccessHandle = (params, item, filePath) => {
  const {
    res
  } = params

  // 更新状态

  // io操作
  const ws = fs.createWriteStream(filePath)
  return handleData(res, ws, item.absUrl)
}

const createSuccessHandle = (result, item, filePath) => {
  const {
    bar
  } = result

  // 更新状态
  update(item.absUrl, 3)

  const {
    hasCreated,
    real
  } = getCategoryData()
  // tips
  bar.interrupt(`【${hasCreated.length}/${real.length}】| 资源创建成功: ${filePath}\n`)
  if (hasCreated.length === real.length) {
    bar.interrupt(`全部资源处理完毕~~`)
  }
}

const errorHandle = (err) => {
  console.error(err)
}

/**
 * 创建所有外链资源
 * @param {*} resources - 资源外链数组
 * @return {Promise}
 */
async function createOuterResources (resources) {
  const {
    dirPath, urls
  } = global.crawler

  const ret = []

  // 缓冲区, 10出5, 防IP等, 分段请求, 待验证

  // 用面向对象的思想去做: 面向四个队列
  const fetchPromiseArr = resources.map(async (item) => {
    const filePath = path.join(dirPath, item.relatedUrl.replace(/\?\d+$/g, ''))
    // 没有才发请求
    if (fs.existsSync(filePath)) {
      return
    }

    // 发送请求
    const promise = await gets(item.absUrl)
      .then((params) => getSuccessHandle(params, item, filePath))
      // .then((result) => createSuccessHandle(result, item, filePath))
      // .catch(err => errorHandle(err))
    return promise
  })

  for (const item of fetchPromiseArr) {
    ret.push(
      await item
    )
    // 判断是否填充
  }
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
