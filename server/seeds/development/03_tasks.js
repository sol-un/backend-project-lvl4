exports.seed = (knex) => knex('tasks').del()
  .then(() => knex('tasks').insert([
    {
      name: 'Test Task',
      description: 'This a new test task was created automatically by the system.',
      status_id: 1,
      creator_id: 2,
      executor_id: 1,
    },
    {
      name: 'Test Task 2',
      description: 'This is a second pending test task without an executor.',
      status_id: 2,
      creator_id: 1,
    },
    {
      name: 'Test Task 3',
      status_id: 2,
      creator_id: 3,
      executor_id: 1,
    },
  ]));
