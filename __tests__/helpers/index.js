// @ts-check

import fs from 'fs';
import path from 'path';

const getFixturePath = (filename) => path.join(__dirname, '..', '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8').trim();
const getFixtureData = (filename) => JSON.parse(readFixture(filename));

export const getTestData = () => getFixtureData('testData.json');

export const prepareData = async (app) => {
  const { knex } = app.objection;

  await knex('users').insert(getFixtureData('users.json'));
  await knex('statuses').insert(getFixtureData('statuses.json'));
  await knex('tasks').insert(getFixtureData('tasks.json'));
  await knex('labels').insert(getFixtureData('labels.json'));
  await knex('tasks_labels').insert(getFixtureData('tasks_labels.json'));
};

export const getCookies = async (app, testData) => {
  const { cookies: [{ name, value }] } = await app.inject({
    method: 'POST',
    url: app.reverse('session'),
    payload: {
      data: testData.users.existing,
    },
  });
  return { [name]: value };
};
