exports.seed = (knex) => knex('labels').del()
  .then(() => knex('labels').insert([
    { name: 'System Maintenance' },
    { name: 'Development' },
    { name: 'Hexlet Forever' },
  ]));
