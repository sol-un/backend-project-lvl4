exports.seed = function (knex) {
  return knex('statuses').del()
    .then(() => knex('statuses').insert([
      { id: 1, name: 'New' },
    ]));
};
