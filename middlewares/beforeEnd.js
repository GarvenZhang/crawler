const fs = require('fs')
const path = require('path')
const htmlHandle = require('./htmlHandle')

module.exports = () => {
  const {
    dirPath, html, hashMap
  } = global.crawler

  // html路径处理
  htmlHandle()

  // 写入
  fs.createWriteStream(path.resolve(dirPath, './index.html')).write(html)
  fs.createWriteStream(path.resolve(dirPath, './directoryHash.json')).write(JSON.stringify(hashMap))
  fs.createWriteStream(path.resolve(dirPath, './urls.json')).write(JSON.stringify({data: []}))
}
