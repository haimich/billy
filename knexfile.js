// Knex properties for test reasons 

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: './bills.sqlite'
  },
  migrations: {
    tableName: 'migrations',
    directory: './sql/migrations'
  },
  seeds: {
    directory: './sql/seeds'
  },
  debug: false,
  pool: {
    afterCreate: (conn, done) => {
      conn.run('PRAGMA foreign_keys = ON', (err, resp) => {  // see https://github.com/tgriesser/knex/issues/453
        if (err) {
          console.log(err)
          return
        }
        done()
      })
    }
  },
  useNullAsDefault: true // see http://knexjs.org/#Builder-insert
}