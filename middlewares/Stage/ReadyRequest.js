const path = require('path')
const url = require('url')

const Stage = require('./index')
const {
  gets
} = require('../../lib/utils')
const {
  notHandle,
  hasGotton,
  initialRootDirPath,
  hashMap
} = global.crawler

const errorHandle = (err) => {
  console.error(err)
}

const hash = (domain) => {
  if (!hashMap[domain]) {
    hashMap[domain] = Date.now().toString()
  }
  return hashMap[domain]
}

const relatedUrlHandle = (RemovedTslUrl) => {
  const urlObj = url.parse(RemovedTslUrl)
  const _domain = `${urlObj.protocol}//${urlObj.hostname}`

  if (_domain !== initialRootDirPath) {
    return `./${hash(_domain)}${urlObj.pathname}`
  } else {
    return `.${urlObj.pathname}`
  }
}

class ReadyRequest extends Stage {
  constructor () {
    super()
  }

  getFreeLen () {
    const freeLen = 10 - this.data.length
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
    // 发送
    target.receive(item)
    // 删除
    for (let l = this.data.length; l--;) {
      if (this.data[l] === item) {
        this.data.splice(l, 1)
        break
      }
    }
    // 尝试填充缓冲区
    const isSuccess = this.get(notHandle)
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

  request (newData) {
    newData.forEach(async item => {
      const filePath = path.join(dirPath, item.relatedUrl.replace(/\?\d+$/g, ''))

      // 发送请求
      const promise = await gets(item.absUrl)
        .then(({res}) => handleData(res, item.absUrl))

      // 转移
      this.send(hasGotton, {[item.absUrl]: promise})
    })
  }
}

module.exports = ReadyRequest
