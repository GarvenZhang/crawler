const Router = require('koa-router')

const router = new Router()

router.post('/urls', require('../controllers/urls'))

module.exports = router.routes()
