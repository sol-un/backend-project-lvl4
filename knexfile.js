// @ts-check

const path = require('path');

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

const getSeeds = (env) => ({
  directory: path.join(__dirname, 'server', 'seeds', env),
});

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite',
    },
    useNullAsDefault: true,
    migrations,
    seeds: getSeeds('development'),
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations,
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
    },
    useNullAsDefault: true,
    migrations,
    seeds: getSeeds('production'),
  },
};
