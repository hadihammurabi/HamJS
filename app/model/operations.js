const modelUtil = require('./model')
const db = require('./dbcontext')

const valid = (struct, data) => {
  let isValid = false
  Object.keys(struct).forEach((fieldS) => {
    if (struct[fieldS].required) {
      if (!data[fieldS]) {
        throw Error(' (!) Field yang required wajib diisi.')
      }
      isValid = true
    }
  })

  return isValid
}

module.exports = (model) => {
  model.prototype.create = (data) => {
    return new Promise((resolve, reject) => {
      if (valid(modelUtil.struct, data)) {
        let sql = `INSERT INTO ${model.name.toLowerCase()} (`
        Object.keys(data).forEach((field) => {
          sql += `${field}, `
        })
        sql = sql.slice(0, -2)
        sql += ') VALUES ('
        Object.keys(data).forEach((field) => {
          if (modelUtil.struct[field].type.name.toLowerCase() === 'string')
            sql += `"${data[field]}", `
          else
            sql += `${data[field]}, `
        })
        sql = sql.slice(0, -2)
        sql += ')'
        db.query(sql, (err, result) => {
          if (err) reject(err)
          else {
            result.sql = sql
            resolve(result)
          }
        })
      } else {
        reject(' (!) Format data tidak sesuai definisi.')
      }
    })
  }
  return new model(require('./model'))
}