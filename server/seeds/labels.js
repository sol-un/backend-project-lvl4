exports.seed = function (knex) {
  return knex('labels').del()
    .then(() => knex('labels').insert([
      { name: 'System Maintenance' },
      { name: 'Development' },
      { name: 'Hexlet Forever' },
    ]));
};
