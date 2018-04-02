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

module.exports = connection