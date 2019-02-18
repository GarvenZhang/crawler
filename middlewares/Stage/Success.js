const Stage = require('./index')

class Success extends Stage {
  constructor () {
    super()
  }

  receive (data) {
    const {
      init, pending, success
    } = global.crawler
    const [
      {filePath}, {bar}
    ] = [...data.entries()][0]

    // 存新数据
    this.add(data)
    // 全部
    const total = Stage.getTotal(init, pending, success)

    bar.interrupt(`< 未处理: ${init.size}, 排队中: ${pending.size}, 已处理: ${success.size} |【${this.size}/${total}】| 资源创建成功: ${filePath}\n`)

    // tips
    if (this.size === total) {
      bar.interrupt(`~~全部资源处理完毕~~`)
    }
  }
}

module.exports = Success
