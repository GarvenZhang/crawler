const fs = require('fs')
const path = require('path')
const url = require('url')

const {gets, handleData, canAccess} = require('../lib/utils')

module.exports = () => {
  const {
    dirPath, initialHtmlDirPath
  } = global.crawler

  const hasExist = canAccess(path.resolve(dirPath, './index.html'))
  if (hasExist) {
    global.crawler = {
      ...global.crawler,
      html: fs.readFileSync(path.resolve(dirPath, './index.html')),
      urls: JSON.parse(fs.readFileSync(path.resolve(dirPath, './urls.json'))),
      hashMap: JSON.parse(fs.readFileSync(path.resolve(dirPath, './directoryHash.json')))
    }
  } else {
    gets(url.resolve(initialHtmlDirPath, './index.html'))
    .then(params => {
      const {
        res
      } = params
      let html = ''
      res.on('data', chunk => {
        html += chunk
      }).on('end', () => {
        global.crawler.html = html
      })
    })
  }
}
