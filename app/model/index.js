const fs = require('fs')
const models = {}

fs.readdirSync(`${Config.root}/models`)
  .forEach((file) => {
    if (fs.lstatSync(`${Config.root}/models/${file}`).isFile()) {
      if (file.split('.')[1] === 'js') {
        const model = file.split('.')[0]
        models[model] = require(`${Config.root}/models/${file}`)
        models[model] = require('./operations')(models[model])
      }
    }
  })

module.exports = models