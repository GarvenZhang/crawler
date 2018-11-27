const Router = require('koa-router')

const router = new Router()

router.post('/urls', require('../controllers/index'))

module.exports = router.routes()