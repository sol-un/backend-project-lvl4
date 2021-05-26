exports.seed = (knex) => knex('statuses').del()
  .then(() => knex('statuses').insert([
    { name: 'New' },
    { name: 'Pending' },
    { name: 'Testing' },
    { name: 'Complete' },
  ]));
