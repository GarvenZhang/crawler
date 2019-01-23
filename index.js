const init = require('./app')
const path = require('path')

// 只考虑https情况

init({
  dirPath: path.resolve('../../h5_games/000/802/003'),
  target: 'https://www.yiv.com/games/Fruit-Master/index.html',
  domainBlackList: [
    'google',
    'facebook',
    '127.0.0.1'
  ]
})
