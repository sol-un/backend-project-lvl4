// @ts-check

import getApp from '../server/index.js';
import { getTestData, prepareData, getCookies } from './helpers/index.js';

describe('test statuses CRUD', () => {
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
    cookies = await getCookies(app, testData);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses'),
      cookies,
    });
    expect(response.statusCode).toBe(200);
    expect(await models.status.query()).toHaveLength(2);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newStatus'),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('edit', async () => {
    const { id } = await models.status.query().findOne({ name: testData.statuses.existing.name });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editStatus', { id }),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.statuses.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statuses'),
      cookies,
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);

    const status = await models.status.query().findOne({ name: params.name });
    expect(status).toMatchObject(params);
  });

  it('update', async () => {
    const { id } = await models.status.query().findOne({ name: testData.statuses.existing.name });

    const params = { name: 'Status Name Updated' };

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateStatus', { id }),
      cookies,
      payload: {
        data: params,
      },
    });
    expect(response.statusCode).toBe(302);

    const status = await models.status.query().findById(id);
    expect(status).toMatchObject(params);
  });

  it('delete', async () => {
    const { id } = await models.status.query().findOne({ name: testData.statuses.existing.name });

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteStatus', { id }),
      cookies,
    });
    expect(response.statusCode).toBe(302);

    expect(await models.status.query().findById(id)).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
