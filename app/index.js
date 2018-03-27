const router = require('./router')

module.exports = (config) => {
  const app = config.express()

  app.use('/', router(config))
  
  app.listen(8080, () => config.app.onInit({
    host: config.app.host,
    port: config.app.port
  }))

}
