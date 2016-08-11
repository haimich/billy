module.exports = {
  knex: {
    client: 'sqlite3',
    connection: {
      filename: "./bills.sqlite"
    }
  }
}
