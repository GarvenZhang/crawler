# 说明

> v1.0

## 一.操作步骤

1 打开`google chrome canary`, 输入`chrome://extensions/`, 点击**加载已解压的扩展程序**, 选择`crawler > extensions > chrome-redirect-request`, 点击`背景页`

2 在`crawler > index.js`配置好 网站资源爬下来后所放置的文件夹路径(dirPath) 和 需要爬取的网站url(target), 命令行输入`npm run start`, 将nodejs服务器跑起

3 在`google chrome canary`输入 target , 进行网站正常体验以更好地覆盖动态加载型资源, 之后静态资源将会陆续被爬下来

## 二.思路简介

1 nodejs服务器先去抓取到html文件

2 利用chrome扩展插件将网站的每个请求url不定时转发到本地服务器

3 nodejs服务器陆续请求收到的url列表中的每个url, 流式保存到本地

4 结合接收到的url列表对html中的外链host进行处理, 使得本地的index.html请求的资源路径在本地

5 对于在js中动态加载的资源路径需要借助 IDE字符查找功能 进行替换为本地路径

## 三.评价

### 3.1 优点

能较完整地获取网站所需静态资源(包括用户体验过程中动态加载的资源)

## 3.2 缺点

1 只能对单个网站处理, 无法批量抓取

2 对于目标网站需要带参数才能访问的网站无法进行抓取, 需形如 `www.xxxx.com/index.html` 形式
