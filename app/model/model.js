const mysql = require('mysql')

const connection = mysql.createConnection({
  host: Config.db.host,
  user: Config.db.username,
  password: Config.db.password,
  database: Config.db.database
})

connection.connect((err) => {
  if (err) throw err;
  console.log(' (*) Database connected.')
})

let struc = {}
exports.create = (name, oncreate) => {
  struct = oncreate()
  exports.struct = struct
  let sql = `CREATE TABLE IF NOT EXISTS ${name}(
    id INT PRIMARY KEY AUTO_INCREMENT,
    `
  Object.keys(struct).forEach((field) => {
    let type = ''
    if (struct[field].type.name.toLowerCase() === 'string') {
      if (struct[field].max) {
        type = `VARCHAR(${struct[field].max})`
      } else {
        type = 'TEXT'
      }
    }
    const required = struct[field].required ? 'NOT NULL' : ''
    const unique = struct[field].unique ? 'UNIQUE' : ''
    sql += `${field} ${type} ${required} ${unique}, `
  })
  sql = sql.slice(0, -2)
  sql += `)`
  connection.query(sql, (err, res) => {
    if (err) throw err;
  })
}