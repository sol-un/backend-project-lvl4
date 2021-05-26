exports.seed = (knex) => knex('users').del()
  .then(() => knex('users').insert([
    {
      first_name: 'admin',
      last_name: 'admin',
      email: 'admin@admin.com',
      password_digest: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    },
    {
      first_name: 'Jacey',
      last_name: 'Mohr',
      email: 'Griffin5@hotmail.com',
      password_digest: '827b46808a9c0405a0edc3a9a0bfc8035bdcd276be80721bd9ec5c81b305d97d',
    },
    {
      first_name: 'Christophe',
      last_name: 'Crooks',
      email: 'Alexander17@hotmail.com',
      password_digest: 'd2d34f9e86865f488c2cf6887bca6ce5df610c378c77d27c49cb4d53ab87727d',
    },
    {
      first_name: 'Tania',
      last_name: 'Raynor',
      email: 'Alphonso.Wintheiser@gmail.com',
      password_digest: 'a99bcdcfa325f4779e54bb5a59cf29546e6c2bc99c625114886ae85046c9c7e4',
    },
    {
      first_name: 'Jimmy',
      last_name: 'Macejkovic',
      email: 'Alejandrin_Tillman26@yahoo.com',
      password_digest: 'f6f3280fdbf08ba5f388258e6fd18fca75bdc37d26e2528cb1a8546c016917ab',
    },
    {
      first_name: 'Marjorie',
      last_name: 'Welch',
      email: 'Abdullah.Runolfsdottir@gmail.com',
      password_digest: '5809cc91f95d32471c53c853606f82d87516cd654949716053db667f57fd2cbd',
    },
    {
      first_name: 'Paula',
      last_name: 'Osinski',
      email: 'Audie32@hotmail.com',
      password_digest: 'e2663081197933b0278726f0b90732794f913b777b316a7af05253ca6d02da4b',
    },
    {
      first_name: 'Trevion',
      last_name: 'Schaden',
      email: 'Nichole30@yahoo.com',
      password_digest: '1e3dc334ba507b14c5acbd1c1acfd2b14c62c97599881c7e3eb19add423e8951',
    },
    {
      first_name: 'Angelica',
      last_name: 'Yundt',
      email: 'Carmella.Stokes92@gmail.com',
      password_digest: 'b071cb5c0517ded42220cd516ee89a8aa5b4b26d5a09822a9963f28e562324c8',
    },
    {
      first_name: 'Nicholas',
      last_name: 'Nienow',
      email: 'Penelope9@yahoo.com',
      password_digest: 'e2da46a5fe61eb7283c742db2df621b2ff8b1e0e42950cc13695066cac52243c',
    },
  ]));
