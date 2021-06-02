// @ts-check

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

    const task = await models.task.query()
      .findOne({ name: params.name })
      .withGraphJoined('labels(selectIds) as labelIds')
      .modifiers({
        selectIds(builder) {
          builder.select('id');
        },
      });
    expect(task.statusId.toString()).toBe(params.statusId);
    expect(task.ownerId.toString()).toBe(params.executorId);
    expect(task.description).toBe(params.description);
    expect(task.labelIds.map(({ id }) => id.toString())).toEqual(params.labels);
  });

  it('update', async () => {
    const initialTask = await models.task.query().findOne({ name: testData.tasks.existing.name });
    const params = {
      creatorId: initialTask.creatorId,
      statusId: '1',
      executorId: '2',
      name: 'Task Name Updated',
      description: 'New description.',
      labels: ['1', '2'],
    };

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateTask', { id: initialTask.id }),
      cookies,
      payload: {
        data: params,
      },
    });
    expect(response.statusCode).toBe(302);

    const task = await models.task.query()
      .findById(initialTask.id).withGraphJoined('labels(selectIds) as labelIds')
      .modifiers({
        selectIds(builder) {
          builder.select('id');
        },
      });
    expect(task.statusId.toString()).toBe(params.statusId);
    expect(task.ownerId.toString()).toBe(params.executorId);
    expect(task.name).toBe(params.name);
    expect(task.description).toBe(params.description);
    expect(task.labelIds.map(({ id }) => id.toString())).toEqual(params.labels);
  });

  it('delete', async () => {
    const task = await models.task.query().findOne({ name: testData.tasks.existing.name });
    expect(await task.$relatedQuery('labels')).toHaveLength(1);

    const { id } = task;
    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteTask', { id }),
      cookies,
    });
    expect(response.statusCode).toBe(302);

    expect(await models.task.query().findById(id)).toBeUndefined();
    expect(await task.$relatedQuery('labels')).toHaveLength(0);
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
