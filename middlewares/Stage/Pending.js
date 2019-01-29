const path = require('path')
const url = require('url')

const Stage = require('./index')
const {
  httpsHandle,
  mkdir
} = require('../../lib/utils')
// 引用类型与基本类型定义的位置
const {
  hashMap
} = global.crawler

const hash = (domain) => {
  if (!hashMap[domain]) {
    hashMap[domain] = Date.now().toString()
  }
  return hashMap[domain]
}

const relatedUrlHandle = (RemovedTslUrl) => {
  const {
    initialRootDirPath
  } = global.crawler
  const urlObj = url.parse(RemovedTslUrl)
  const _domain = `${urlObj.protocol}//${urlObj.hostname}`

  if (_domain !== initialRootDirPath) {
    return `./${hash(_domain)}${urlObj.pathname}`
  } else {
    return `.${urlObj.pathname}`
  }
}

class Pending extends Stage {
  constructor () {
    super()
  }

  getFreeLen () {
    const freeLen = 10 - this.size
    if (freeLen > 5) {
      return freeLen
    } else {
      return 0
    }
  }

  receive (data) {
    // 新数据处理
    const newData = this.dataHandle(data)
    // 放入新数据
    newData.forEach(item => {
      this.data.push(item)
    })
    // 发送请求
    this.request(newData)
  }

  get (from) {
    const freeLen = this.getFreeLen()
    if (freeLen === 0) {
      return false
    }
    from.send(this, freeLen)
    return true
  }

  send (target, item) {
    const {
      init
    } = global.crawler
    const [
      {absUrl}
    ] = [...item.entries()][0]
    // 删除
    for (let l = this.data.length; l--;) {
      if (this.data[l].absUrl === absUrl) {
        this.data.splice(l, 1)
        break
      }
    }
    // 发送
    target.receive(item)
    // 尝试填充缓冲区
    const isSuccess = this.get(init)
  }

  dataHandle (data) {
    // 拿回来的资源分两种: 主域下, 其它域下
    // 要先拿到主域, 然后在得到的relatedUrl中替换掉主域
    // 其它域的话把 协议 + 域名 替换成hash
    // html中同样需要把主域替换成相对路径, 剩下的域替换成hash

    // 1 过滤掉无后缀名的
    // 2 去掉参数
    // 3 统一路径: 取path
    // 4 把域名过滤成hash表
    return data.map(item => ({
      absUrl: item,
      relatedUrl: relatedUrlHandle(item)
    }))
  }

  async request (newData) {
    const {
      dirPath, success
    } = global.crawler

    const handle = async item => {
      const filePath = path.join(dirPath, item.relatedUrl.replace(/\?\d+$/g, ''))
      // 创建文件夹
      mkdir(item.relatedUrl, dirPath)

      // 发送请求
      const res = await httpsHandle(item.absUrl, filePath)

      // 转移
      const key = {
        ...item,
        filePath
      }
      const map = new Map()
      map.set(key, res)
      this.send(success, map)
    }
    // 必须要控制请求间隔时间, 因为对方服务器肯定会有限制的, 如50ms内处理一共能处理多少个, 超过则拦截。
    // 每个服务器有个连接池, 因为每个连接就是一个新的线程或者进程, 因此连接池的最大数量是由内存决定的, 必须要限定最大数量, 以空出足够的内存给其它进程用
    const sleep = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 2E2)
      })
    }

    for (const item of newData) {
      await sleep()
      handle(item)
    }
  }
}

module.exports = Pending
