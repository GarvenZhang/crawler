const fs = require('fs')
const path = require('path')
const htmlHandle = require('./htmlHandle')
const {
  getCategoryData
} = require('../middlewares/statusHandle')

module.exports = () => {
  const {
    dirPath, html, urls, hashMap
  } = global.crawler
  const {
    real
  } = getCategoryData()

  // html路径处理
  htmlHandle()

  // 写入
  fs.createWriteStream(path.resolve(dirPath, './index.html')).write(html)
  fs.createWriteStream(path.resolve(dirPath, './directoryHash.json')).write(JSON.stringify(hashMap))
  fs.createWriteStream(path.resolve(dirPath, './urls.json')).write(JSON.stringify(real))
}
