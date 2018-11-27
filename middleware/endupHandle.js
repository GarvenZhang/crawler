const fs = require('fs')
const path = require('path')
const replaceHtmlLinkPath = require('./replaceHtmlLinkPath')

module.exports = () => {

  // html路径处理
  replaceHtmlLinkPath()

  // 写入
  fs.createWriteStream(path.resolve(global.crawler.dirPath, './index.html')).write(global.crawler.html)
  fs.createWriteStream(path.resolve(global.crawler.dirPath, './directoryHash.json')).write(JSON.stringify({hashMap: global.crawler.hashMap}))
  fs.createWriteStream(path.resolve(global.crawler.dirPath, './urls.json')).write(global.crawler.urls)
  
}
