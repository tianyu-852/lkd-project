const router = require('koa-router')()

const indexController = require('../controller/indexController');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

// e签宝签署
router.get('/esign', indexController.createFlowOneESign);

// e签宝签署回调通知
router.post('/esign-notify', indexController.esignCallBackNotify);

module.exports = router
