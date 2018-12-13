const init = require('./app')
const path = require('path')
const fs = require('fs')

// 只考虑https情况

init({
  dirPath: path.resolve('../../h5_games/800032'),
  target: 'https://games.cdn.famobi.com/html5games/p/perfect-piano/v090/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=24f835e0-d21a-47e1-a721-9f68beed83f3&fg_pid=4638e320-4444-4514-81c4-d80a8c662371&fg_beat=297&original_ref='
})
