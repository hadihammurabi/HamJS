const fs = require('fs')

// Get controller from file
const getControllers = (root) => {
  const controllers = []
  // Get files from controllers directory
  fs.readdirSync(`${root}/controllers`)
    .forEach(file => {
      // If this is file, not directory
      if (fs.lstatSync(`${root}/controllers/${file}`).isFile()) {
        // If this is .js file
        if (file.split('.')[1] === 'js') {
          // Get file name
          const controller = file.split('.')[0]
          // Push to controller list
          controllers.push({name: controller.toLowerCase(), controller: require(`${root}/controllers/${file}`)})
        }
      }
    })
  return controllers
}

const controllerHandler = (controller) => {
  return (req, res) => {
    global.req = req
    global.res = res
    controller()
  }
}

const requestMethod = [
  {
    name: 'post',
    regex: /^Post/g
  }, {
    name: 'get',
    regex: /^Get/g
  }, {
    name: 'put',
    regex: /^Put/g
  }, {
    name: 'delete',
    regex: /^Delete/g
  }
]

module.exports = ({ root, express, app }) => {
  // Router init
  const router = express.Router()

  // Get controller list
  getControllers(root)
  .forEach(controller => {
    // Set default route
    // If app.default.controller is not falsy
    if (app.defaults.controller) {
      // If app.default.controller is exists in controller list
      if (app.defaults.controller === `${controller.name.charAt(0).toUpperCase()}${controller.name.slice(1)}`) {
        router.get('/', controllerHandler(controller.controller.Index))
      }
    }
    // Get method from each controller
    Object.getOwnPropertyNames(Object.getPrototypeOf(controller.controller))
    .forEach(method => {
      // Register controller with specify request method
      requestMethod.forEach(reqmet => {
        // If request method is NOT get
        if (method.match(reqmet.regex) && reqmet.name !== 'get') {
          // Delete request method from method name 
          method = method.replace(reqmet.regex, '')
          // If method is not constructor
          if (method !== 'constructor') {
            // Register method to route
            router[reqmet.name](
              // Set URL to lowercase from controller/method
              `/${controller.name}/${method.toLowerCase()}`,
              // Set controller from controller list with
              // RequestMethod
              controllerHandler(controller.controller[`${reqmet.name.charAt(0).toUpperCase() + reqmet.name.slice(1)}${method}`])
            )
          }
        } else {
            // Register get method
            if (method !== 'constructor') {
              if (method === 'Index')
                router.get(
                  `/${controller.name}`,
                  controllerHandler(controller.controller[`${method}`])
                )
              router.get(
                `/${controller.name}/${method.toLowerCase()}`,
                controllerHandler(controller.controller[method])
              )
            }
        }
      })
    })
  })
  return router
}