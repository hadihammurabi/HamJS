const router = require('./router')
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
  const session = require('express-session')

  const app = config.express()

  // Session
  const maxAge = new Date()
  maxAge.setDate(maxAge.getDate() + 1)

  app.use(session({
    secret: Config.app.session.secret || 'Th15-15-Th3-535510n-53Cr3T-1234567890ABCDEF',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: Config.app.session.maxAge || maxAge
    }
  }));

  app.use((req, res, next) => {
    // Set session as global object
    global.session = req.session
    
    // Set powered by
    res.set('X-Powered-By', 'HamJS')
    next()
  })

  // Set static/public directory
  app.use(config.express.static(`${config.root}/public`))
  app.set('view engine', 'ejs')
  app.set('views', `${config.root}/views`)

  app.use('/', router(config))
  
  app.listen(8080, () => config.app.onInit({
    host: config.app.host,
    port: config.app.port
  }))

}
