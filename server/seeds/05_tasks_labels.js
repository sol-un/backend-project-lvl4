exports.seed = function (knex) {
  return knex('tasks_labels').del()
    .then(() => knex('tasks_labels').insert([
      { task_id: 1, label_id: 1 },
      { task_id: 3, label_id: 2 },
      { task_id: 3, label_id: 3 },
    ]));
};
