const Stage = require('./index')

class Init extends Stage {
  constructor () {
    super()
  }

  send (target) {
    // 先判断是否有空闲缓冲区
    const freeLen = target.getFreeLen()
    if (freeLen === 0) {
      return
    }
    // 转移数据
    const ret = this.data.splice(-freeLen, freeLen)
    target.receive(ret)
  }
}

module.exports = Init
