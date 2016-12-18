// Knex properties for test reasons 

module.exports = {
  client: 'sqlite3',
  debug: false,
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
  pool: {
    afterCreate: (conn, done) => {
      conn.run('PRAGMA foreign_keys = ON', (err, resp) => {  // see https://github.com/tgriesser/knex/issues/453
        if (err) {
          console.log(err)
          return
        }
        console.log('Ran afterCreate query')
        done()
      })
    }
  },
  useNullAsDefault: true // see http://knexjs.org/#Builder-insert
}