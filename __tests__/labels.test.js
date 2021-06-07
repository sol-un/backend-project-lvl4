// @ts-check

import getApp from '../server/index.js';
import { getTestData, prepareData, logIn } from './helpers/index.js';

describe('test labels CRUD', () => {
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
      url: app.reverse('labels'),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('edit', async () => {
    const { id } = await models.label.query().findOne({ name: testData.labels.existing.name });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editLabel', { id }),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.labels.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      cookies,
      payload: {
        data: params,
      },
    });
    expect(response.statusCode).toBe(302);

    const label = await models.label.query().findOne({ name: params.name });
    expect(label).toMatchObject(params);
  });

  it('update', async () => {
    const { id } = await models.label.query().findOne({ name: testData.labels.existing.name });

    const params = testData.labels.new;

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateLabel', { id }),
      cookies,
      payload: {
        data: params,
      },
    });
    expect(response.statusCode).toBe(302);

    const label = await models.label.query().findById(id);
    expect(label).toMatchObject(params);
  });

  it('delete', async () => {
    const label = await models.label.query().findOne({ name: testData.labels.existing.name });
    await label.$relatedQuery('tasks').unrelate();

    const { id } = label;
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteLabel', { id }),
      cookies,
    });
    expect(response.statusCode).toBe(302);

    expect(await models.label.query().findById(id)).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
