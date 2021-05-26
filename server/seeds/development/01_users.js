exports.seed = (knex) => knex('users').del()
  .then(() => knex('users').insert([
    {
      first_name: 'f',
      last_name: 'f',
      email: 'f@f.com',
      password_digest: 'f29a448b780745bf2e10667f46c442b102e75e76a46a1fff969641866225ab56',
    },
    {
      first_name: 'Karelle',
      last_name: 'Koelpin',
      email: 'Caroline.Cummings56@hotmail.com',
      password_digest: 'f29a448b780745bf2e10667f46c442b102e75e76a46a1fff969641866225ab56',
    },
    {
      first_name: 'Audrey',
      last_name: 'Gleichner',
      email: 'Howard.Terry@hotmail.com',
      password_digest: '00dd9ee086b008984181be926bcf800380b62ab7171e1da9bbacd8491e085378',
    },
  ]));
