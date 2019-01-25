// const init = require('./app')
// const path = require('path')

// // 只考虑https情况

// init({
//   dirPath: path.resolve('../../h5_games/000/802/003'),
//   target: 'https://www.yiv.com/games/Fruit-Master/index.html',
//   domainBlackList: [
//     'google',
//     'facebook',
//     '127.0.0.1'
//   ]
// })

let request = require('request');
let fs = require('fs');

let httpStream = request({
    method: 'GET',
    url: 'https://baobao-3d.bj.bcebos.com/16-0-205.shuimian.mp4'
});
// 由于不需要获取最终的文件，所以直接丢掉
let writeStream = fs.createWriteStream('/Users/garven/Downloads/shuimian.mp4');

// 联接Readable和Writable
httpStream.pipe(writeStream);

let totalLength = 0;

// 当获取到第一个HTTP请求的响应获取
httpStream.on('response', (response) => {
    console.log('response headers is: ', response.headers);
});

httpStream.on('data', (chunk) => {
    totalLength += chunk.length;
    console.log('recevied data size: ' + totalLength + 'KB');
});

// 下载完成
writeStream.on('close', () => {
    console.log('download finished');
});