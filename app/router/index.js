const fs = require('fs')

const getControllers = (root) => {
  const controllers = []
  fs.readdirSync(`${root}/controllers`)
    .forEach(file => {
      if (fs.lstatSync(`${root}/controllers/${file}`).isFile()) {
        if (file.split('.')[1] === 'js') {
          const controller = file.split('.')[0]
          controllers.push({name: controller.toLowerCase(), controller: require(`${root}/controllers/${file}`)})
        }
      }
    })
  return controllers
}

module.exports = ({ root, express }) => {
  const router = express.Router()
  getControllers(root)
    .forEach(controller => {
      Object.keys(controller.controller)
        .forEach(method => {
          if (method === 'index')
            router.get(`/${controller.name}`, controller.controller[method])
          router.get(`/${controller.name}/${method}`, controller.controller[method])
        })
    })
  return router
}