exports.seed = function (knex) {
  return knex('users').del()
    .then(() => knex('users').insert([
      {
        id: 1,
        first_name: 'f',
        last_name: 'f',
        email: 'f@f.com',
        password_digest: 'f29a448b780745bf2e10667f46c442b102e75e76a46a1fff969641866225ab56',
      },
    ]));
};
