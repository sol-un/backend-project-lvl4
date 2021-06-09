// @ts-check

import { omit } from 'lodash';
import getApp from '../server/index.js';
import { getTestData, prepareData, logIn } from './helpers/index.js';

describe('test tasks CRUD', () => {
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
      url: app.reverse('tasks'),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('profile', async () => {
    const { id } = await models.task.query().findOne({ name: testData.tasks.existing.name });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('taskProfile', { id }),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('edit', async () => {
    const { id } = await models.task.query().findOne({ name: testData.tasks.existing.name });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editTask', { id }),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.tasks.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      cookies,
      payload: {
        data: params,
      },
    });
    expect(response.statusCode).toBe(302);

    const task = await models.task.query().findOne({ name: params.name });
    const taskLabels = await task.$relatedQuery('labels');
    const expectedLabels = await models.label.query().findByIds(params.labels);

    expect(task).toMatchObject(omit(params, 'labels'));
    expect(taskLabels).toMatchObject(expectedLabels);
  });

  it('update', async () => {
    const { id } = await models.task
      .query()
      .findOne({ name: testData.tasks.existing.name });

    const params = { ...testData.tasks.new };

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateTask', { id }),
      cookies,
      payload: {
        data: params,
      },
    });
    expect(response.statusCode).toBe(302);

    const task = await models.task.query().findOne({ name: params.name });
    const taskLabels = await task.$relatedQuery('labels');
    const expectedLabels = await models.label.query().findByIds(params.labels);

    expect(task).toMatchObject(omit(params, 'labels'));
    expect(taskLabels).toMatchObject(expectedLabels);
  });

  it('delete', async () => {
    const task = await models.task.query().findOne({ name: testData.tasks.existing.name });
    const taskLabels = await task.$relatedQuery('labels');

    const { id } = task;
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteTask', { id }),
      cookies,
    });
    expect(response.statusCode).toBe(302);

    expect(await models.task.query().findById(id)).toBeUndefined();
    taskLabels.forEach(async (label) => {
      const labelTasks = label.$relatedQuery('tasks');
      expect(await labelTasks.where({ taskId: id })).toHaveLength(0);
    });
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
