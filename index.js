// const init = require('./app')
// const path = require('path')
// const fs = require('fs')

// // 只考虑https情况

// init({
//   dirPath: path.resolve('../../h5_games/800028'),
//   target: 'https://games.cdn.famobi.com/html5games/h/hex-blitz/v360/index.html?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=6d9f5f75-2f84-44c5-9cfe-06056d557639&fg_pid=4638e320-4444-4514-81c4-d80a8c662371&fg_beat=354&original_ref=',
// })

const phantom = require ('phantom');
const fs = require ('fs');
const path = require ('path');

(async function () {
  const instance = await phantom.create ();
  const page = await instance.createPage ();
  let ret = {
    urls: []
  };
  await page.on ('onResourceRequested', function (requestData) {
    console.info ('Requesting', requestData.url);
    ret.urls.push(requestData.url)
  });

  const status = await page.open (
    'https://games.cdn.famobi.com/html5games/h/hex-blitz/v360/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=6d9f5f75-2f84-44c5-9cfe-06056d557639&fg_pid=4638e320-4444-4514-81c4-d80a8c662371&fg_beat=380&original_ref='
  );
  const content = await page.property ('content');

  // await instance.exit();

  // 程序终止前处理
  process.on ('SIGINT', () => {
    // TODO:
    fs.createWriteStream(path.resolve('result.json')).write(JSON.stringify(ret))
    setTimeout (() => {
      process.exit ();
    }, 2e3);
  });
}) ();
