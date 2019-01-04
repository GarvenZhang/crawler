const fs = require('fs')
const path = require('path')
const url = require('url')

const {gets, handleData, canAccess} = require('./utils')

// const getHtml = function (url, dirPath) {
//   return gets (url).then (params => {
//     const {res} = params;
//     const ws = fs.createWriteStream (path.resolve (dirPath, 'index.html'));
//     return handleData (res, ws, url);
//   });
// }

module.exports = () => {
  const hasExist = canAccess(path.resolve(global.crawler.dirPath, './index.html'))
  if (hasExist) {
    global.crawler.html = fs.readFileSync(path.resolve(global.crawler.dirPath, './index.html'))
    global.crawler.urls = JSON.parse(fs.readFileSync(path.resolve(global.crawler.dirPath, './urls.json')))
    global.crawler.hashMap = JSON.parse(fs.readFileSync(path.resolve(global.crawler.dirPath, './directoryHash.json')))
  } else {
    gets(url.resolve(global.crawler.initialHtmlDirPath, './index.html'))
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
