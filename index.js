const init = require('./app')
const path = require('path')
const fs = require('fs')

// 只考虑https情况

init({
  dirPath: path.resolve('./h5_games/000/801/008'),
  target: 'https://www.yiv.com/games/Flow-Free-Online/index.html',
  domainBlackList: [
    'google',
    'facebook',
    '127.0.0.1'
  ]
})
