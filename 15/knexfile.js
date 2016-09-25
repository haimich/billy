// Knex properties for test reasons 

module.exports = {
  client: 'sqlite3',
  debug: false,
  connection: {
    filename: "./bills.sqlite"
  },
  migrations: {
    tableName: 'migrations',
    directory: './sql/migrations'
  },
  seeds: {
    directory: './sql/seeds'
  },
  useNullAsDefault: true // see http://knexjs.org/#Builder-insert
}