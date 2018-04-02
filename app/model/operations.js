const modelUtil = require('./model')

const valid = (struct, data) => {
  let isValid = false
  Object.keys(struct).forEach((fieldS) => {
    Object.keys(data).forEach((fieldD) => {
      if (struct[fieldS].required) {
        // Require data falsy or truly
        if (data[fieldD]) {
          // console.log(struct[fieldD])
          isValid = true
        } else {
          throw Error(' (!) Field yang required tidak dapat dikosongkan.')
        }
      }
    })
  })

  return isValid
}

module.exports = (model) => {
  model.prototype.create = (data) => {
    console.log(valid(modelUtil.struct, data))
  }
  return new model(require('./model'))
}