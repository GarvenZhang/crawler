const init = require('./app')
const path = require('path')
const fs = require('fs')

// 只考虑https情况

init({
  dirPath: path.resolve('../../h5_games/000/801/001'),
  target: 'https://www.yiv.com/games/Adventure-Of-Olaf/index.html'
})
