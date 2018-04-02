const router = require('./router')
const mysql = require('mysql')
let config = {}

const setup = (config) => {
  global.Config = require(`${config.root}/ham.config.js`)
  global.Controller = require('./controller')
  global.Model = require('./model')
  
  global.render = (view, data={}, status=200) => {
    if (typeof view === 'string')
      res.status(status).render(view, data)
    else {
      if (!view) {
        res.status(status).json(data)
      }
    }
  }
}

module.exports = (config) => {
  setup(config)

  const app = config.express()

  app.use((req, res, next) => {
    res.set('X-Powered-By', 'HamJS')
    next()
  })

  app.use(config.express.static(`${config.root}/public`))
  app.set('view engine', 'ejs')
  app.set('views', `${config.root}/views`)

  app.use('/', router(config))
  
  app.listen(8080, () => config.app.onInit({
    host: config.app.host,
    port: config.app.port
  }))

}
