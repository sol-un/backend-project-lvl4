exports.seed = function (knex) {
  return knex('tasks').del()
    .then(() => knex('tasks').insert([
      {
        name: 'Test Task',
        description: 'This a new test task was created automatically by the system.',
        status_id: 1,
        creator_id: 2,
        owner_id: 1,
      },
      {
        name: 'Test Task 2',
        description: 'This is a second pending test task without an owner.',
        status_id: 2,
        creator_id: 1,
      },
      {
        name: 'Test Task 3',
        status_id: 2,
        creator_id: 3,
        owner_id: 1,
      },
    ]));
};
