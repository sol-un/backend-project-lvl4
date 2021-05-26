exports.seed = (knex) => knex('labels').del()
  .then(() => knex('labels').insert([
    { name: 'synthesize' },
    { name: 'enable' },
    { name: 'matrix' },
    { name: 'evolve' },
  ]));
