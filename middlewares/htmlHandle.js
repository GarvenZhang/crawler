const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const url = require('url')

let $ = null

// tdk处理
function kdkHandle (html) {
  // title
  $('title').text('')
  // description
  $('meta[name=description]').attr('content', '')
  // keywords
  $('meta[name=keywords]').attr('content', '')
}

// 统一还原成完整路径, 再进行替换
function toAbsUrl (tag, domain, htmlDirPath) {
  // 若有base, 找到, 还原其它相对url, 删除base
  const $base = $('base')[0]
  const baseHref = ($base && $base.attribs.href) || ''
  if (
    baseHref &&
    /^\/\//.test(baseHref) &&
    new RegExp(domain).test(`https:${baseHref}`)
  ) {
    const pathname = url.parse(`https:${baseHref}`).pathname
    $base.attr(baseHref, pathname)
  }

  Array.from($(tag)).forEach(item => {
    // 类型
    let link = ''
    let attrName = ''
    if (item.attribs.src) {
      attrName = 'src'
      link = item.attribs.src
    } else if (item.attribs.href) {
      attrName = 'href'
      link = item.attribs.href
    }

    const pattern = `=("|')${link}`

    // url去掉参数
    if (/.+?(\?.+)$/.test(link)) {
      $(tag).attr(attrName, '')
    }

    // 内嵌
    if (!link) {
      return
    }

    let pre = path.join(baseHref, link)

    // 相对协议
    if (/^\/\//.test(link)) {
      $(tag).attr(attrName, `https:${link}`)
      return
    }

    // 已经是完整路径
    if (/^https?/.test(link)) {
      return
    }

    // 如果是类似 /js/xxx.js
    if (/^\/\w/.test(link)) {
      $(tag).attr(attrName, `https:${domain}${pre}`)
      return
    }

    if ($base) {
      $(tag).attr(attrName, `${domain}/${pre}`)
      return
    }

    // 如果是类似 js/xxx.js 或者 ./js/xxx.js
    $(tag).attr(attrName, `https:${htmlDirPath}/${pre}`)
  })
}

function toRelativeUrl (html) {
  const {
    hashMap
  } = global.crawler
  let ret = html

  for (const domain in hashMap) {
    ret = ret.replace(new RegExp(domain, 'g'), `./${hashMap[domain]}`)
  }

  return ret
}

module.exports = () => {
  const {html, initialRootDirPath, initialHtmlDirPath} = global.crawler

  // 初始化
  $ = cheerio.load(html)

  // 处理TDK
  kdkHandle()

  // 全部还原成完整路径
  // 需还原的情况: //a 、 ./a 、 a
  // 即只要不是https开头的, 都需要还原, 但考虑不到的情况有: css中的路径, js中动态加载的路径
  // 用path.join()
  ;['img', 'script', 'link', 'iframe'].forEach(tag => {
    toAbsUrl(tag, initialRootDirPath, initialHtmlDirPath)
  })

  let ret = $.html()

  // 根据hashMap替换成相对路径
  ret = toRelativeUrl(ret)
  // 替换掉主域
  ret = ret.replace(new RegExp(initialRootDirPath, 'g'), '.')

  // 若有base, 删除base
  ret = ret.replace(/\<base href\=\".+?\"\>/, '')

  // 重置
  $ = null

  global.crawler.html = ret
}
