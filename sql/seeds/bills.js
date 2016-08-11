const data = require('./data.json')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('bills').del().then(function () {
    return Promise.all(data.map(bill => knex('bills').insert(bill)))
  });
}
