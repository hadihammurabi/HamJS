const db = require('./dbcontext')
const models = require('./load')

// Load all model from models directory
Object.keys(models).forEach(modelName => {
  const model = {}
  model.create = (oncreate) => {
    model.struct = oncreate
    let sql = `CREATE TABLE IF NOT EXISTS ${modelName.toLowerCase()} (id INT PRIMARY KEY AUTO_INCREMENT`
    Object.keys(model.struct).forEach(field => {
      let type = ''
      let required = model.struct[field].required ? 'NOT NULL': ''
      let unique = model.struct[field].unique ? 'UNIQUE' : ''
      if (model.struct[field].type.name.toLowerCase() === 'string') {
        if (model.struct[field].max) {
          type = `VARCHAR(${model.struct[field].max})`
        } else {
          type = 'TEXT'
        }
      }
      sql += `, ${field} ${type} ${required} ${unique}`
    })
    sql += ')'
    db.query(sql, (err, res) => {
      if (err) throw err
    })
  }

  // Validate input for insert operation
  const validate = (struct, data) => {
    Object.keys(struct).forEach(fieldS => {
      if (struct[fieldS].required) {
        Object.keys(data).forEach(fieldD => {
          if (data[fieldS] === undefined)
            throw Error(' (!) Field yang required tidak boleh dikosongkan.')
        })
      }
    })
    return true
  }
  
  // Inserting data
  models[modelName].prototype.create = (data) => new Promise((ful, rej) => {
    if (!data || Object.keys(data).length < 1)
      rej(' (!) Data yang akan disimpan tidak boleh dikosongkan.')

    if (!validate(model.struct, data)) {
      rej(' (!) Data yang akan disimpan tidak sesuai dengan definisi.')
    }

    let sql = `INSERT INTO ${modelName.toLowerCase()} (`
    Object.keys(data).forEach(field => {
      sql += `${field}, `
    })
    sql = sql.slice(0, -2)
    sql += ' ) VALUES ( '
    Object.keys(data).forEach(field => {
      if (model.struct[field].type.name.toLowerCase() === 'string')
        sql += `"${data[field]}", `
      else
        sql += `${data[field]}, `
    })
    sql = sql.slice(0, -2)
    sql += ')'
    
    db.query(sql, (err, res) => {
      if (err) rej(err)
      ful(res)
    })
  })

  // Destroy an item
  models[modelName].prototype.destroy = (id) => new Promise((ful, rej) => {
    if (!id)
      rej(' (!) Id yang akan dihapus tidak boleh dikosongkan.')

    let sql = `DELETE FROM ${modelName.toLowerCase()} WHERE id=${id}`

    db.query(sql, (err, res) => {
      if(err) rej(err)
      ful(res)
    })
  })

  // Update function
  models[modelName].prototype.update = (id, data) => new Promise((ful, rej) => {
    if (!id)
      rej(' (!) Id yang akan diupdate tidak boleh dikosongkan.')

    if (!data || Object.keys(data).length < 1)
      rej(' (!) Data yang akan disimpan tidak boleh dikosongkan.')

    if (!validate(model.struct, data)) {
      rej(' (!) Data yang akan disimpan tidak sesuai dengan definisi.')
    }

    let sql = `UPDATE ${modelName.toLowerCase()} SET `

    Object.keys(data).forEach(field => {
      sql += `${field}=${data[field]}, `
    })
    sql = sql.slice(0, -2)

    sql += ` WHERE id=${id}`

    db.query(sql, (err, res) => {
      if (err) rej(err)
      ful(res)
    })
  })

  // Show an item by id
  models[modelName].prototype.show = (id) => new Promise((ful, rej) => {
    if (!id)
      rej(' (!) Id yang akan dihapus tidak boleh dikosongkan.')

    let sql = `SELECT * FROM ${modelName.toLowerCase()} WHERE id=${id}`

    db.query(sql, (err, res) => {
      if (err) rej(err)
      ful(res[0])
    })
  })

  // Get all data
  models[modelName].prototype.all = (where) => new Promise((ful, rej) => {
    let sql = `SELECT * FROM ${modelName.toLowerCase()}`

    if (where) {
      sql = `SELECT * FROM ${modelName.toLowerCase()} WHERE ${where}`
    }

    db.query(sql, (err, res) => {
      if (err) rej(err)
      ful(res)
    })
  })

  models[modelName] = new models[modelName](model)
})

module.exports = models