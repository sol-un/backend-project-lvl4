// @ts-check

exports.up = (knex) => (
  knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.string('password_digest');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('statuses', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.timestamps(true, true);
    })
    .createTable('tasks', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('description');
      table.integer('status_id');
      table.integer('creator_id');
      table.integer('owner_id');
      table.timestamps(true, true);

      table.foreign('status_id').references('id').inTable('statuses');
      table.foreign('creator_id').references('id').inTable('users');
      table.foreign('owner_id').references('id').inTable('users');
    })
    .createTable('labels', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.timestamps(true, true);
    })
    .createTable('tasks_labels', (table) => {
      table.increments('id').primary();
      table.integer('task_id');
      table.integer('label_id');
      table.timestamps(true, true);

      table.foreign('task_id').references('id').inTable('tasks');
      table.foreign('label_id').references('id').inTable('labels');
    })
);

exports.down = (knex) => knex.schema
  .dropTable('tasks_labels')
  .dropTable('labels')
  .dropTable('tasks')
  .dropTable('users')
  .dropTable('statuses');
