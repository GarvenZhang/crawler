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

/**
 * 创建所有外链资源
 * @param {*} resources - 资源外链数组
 * @return {Promise}
 */
function createOuterResources (resources) {
  const {
    dirPath, urls
  } = global.crawler

  // 缓冲区, 10出5, 防IP等, 分段请求, 待验证

  for (let l = resources.length; l--;) {
    const item = resources[l]

    const filePath = path.join(dirPath, item.relatedUrl.replace(/\?\d+$/g, ''))
    // 没有才发请求
    if (fs.existsSync(filePath)) {
      return
    }

    gets(item.absUrl)
      .then((params) => {
        const {
          res
        } = params

        // 更新状态
        update(item.absUrl, 2)

        // io操作
        const ws = fs.createWriteStream(filePath)
        return handleData(res, ws, item.absUrl)
      })
      .then((result) => {
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
      })
      .catch(err => {
        console.error(err)
      })
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
