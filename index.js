const init = require('./app')
const path = require('path')

// 只考虑https情况

init({
  dirPath: path.resolve('../../h5_games/000/804/006'),
  target: 'https://www.yiv.com/games/Happy-Glass/index.html',
  domainBlackList: [
    'google',
    'facebook',
    '127.0.0.1',
    'pro.ip-api.com',
    'pubads.g.doubleclick.net',
    'www.gstatic.com'
  ]
})