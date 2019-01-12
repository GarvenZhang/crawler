const init = require('./app')
const path = require('path')

// 只考虑https情况

init({
  dirPath: path.resolve('./h5_games/000/801/004'),
  target: 'https://www.yiv.com/games/Ultimate-Boxing/index.html',
  domainBlackList: [
    'google',
    'facebook',
    '127.0.0.1'
  ]
})
