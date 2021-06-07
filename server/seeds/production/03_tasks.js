exports.seed = (knex) => knex('tasks').del()
  .then(() => knex('tasks').insert([
    {
      name: 'Test task',
      description: 'This task was created automatically by the system.',
      status_id: 1,
      creator_id: 7,
      executor_id: 1,
    },
    {
      name: 'Deploy interactive e-commerce',
      description: 'Face to face client-server open system. Transition: users plug-and-play, mission-critical schemas.',
      status_id: 2,
      creator_id: 1,
      executor_id: 1,
    },
    {
      name: 'Innovate impactful architectures',
      description: 'Right-sized tertiary archive. Maximize: partnerships enterprise, frictionless e-tailers.',
      status_id: 3,
      creator_id: 5,
    },
    {
      name: 'Implement cross-platform portals',
      status_id: 4,
      creator_id: 3,
      executor_id: 8,
    },
  ]));
