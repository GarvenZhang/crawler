const Stage = require('./index')
const {
  notHandle,
  readyRequest,
  hasGotton,
  hasCreated
} = global.crawler

class HasCreated extends Stage {
  constructor () {
    super()
  }

  receive (data) {

    // 全部
    const total = Stage.getTotal(notHandle, readyRequest, hasGotton, hasCreated)

    // tips
    bar.interrupt(`【${this.size}/${total}】| 资源创建成功: ${filePath}\n`)
    if (this.size === total) {
      bar.interrupt(`全部资源处理完毕~~`)
    }
  }
}

module.exports = HasCreated
