exports.seed = function (knex) {
  return knex('statuses').del()
    .then(() => knex('statuses').insert([
      { name: 'New' },
      { name: 'Pending' },
    ]));
};
