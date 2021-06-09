// @ts-check

import _ from 'lodash';
import getApp from '../server/index.js';
import encrypt from '../server/lib/secure.js';
import { getTestData, prepareData, logIn } from './helpers/index.js';

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
  let cookies;
  const testData = getTestData();

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
    cookies = await logIn(app, testData.users.existing);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('edit', async () => {
    const { id } = await models.user.query().findOne({ email: testData.users.existing.email });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editUser', { id }),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
    });
    expect(response.statusCode).toBe(302);

    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  it('update', async () => {
    const { id } = await models.user.query().findOne({ email: testData.users.existing.email });

    const params = testData.users.new;

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateUser', { id }),
      cookies,
      payload: {
        data: params,
      },
    });
    expect(response.statusCode).toBe(302);

    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findById(id);
    expect(user).toMatchObject(expected);
  });

  it('delete', async () => {
    const userData = testData.users.existingWithoutRelations;
    cookies = await logIn(app, userData);

    const user = await models.user
      .query()
      .findOne({ email: userData.email });

    const { id } = user;
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id }),
      cookies,
    });
    expect(response.statusCode).toBe(302);

    expect(await models.user.query().findById(id)).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
