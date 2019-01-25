import Stage from '.'

const {
  domainBlackList
} = global.crawler

class Memory extends Stage {
  constructor () {
    super()
    this.temp = []
  }

  receive (data) {
    // 清空暂存区
    this.temp.length = 0
    // 处理新数据
    data.forEach(item => {
      // 黑名单拦截
      if (domainBlackList.some(url => item.indexOf(url) > -1)) {
        return
      }
      // 已存在的拦截
      if (this.data.includes(item)) {
        return
      }
      // 记忆备份
      this.data.push(item)
      // 存储新数据
      this.temp.push(item)
    })
  }

  send (target) {
    target.receive(this.temp)
    this.temp = []
  }
}

module.exports = Memory
