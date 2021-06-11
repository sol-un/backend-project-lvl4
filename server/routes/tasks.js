import i18next from 'i18next';
import { isEmpty, snakeCase, identity } from 'lodash';

const normalizeDigit = (value) => (isEmpty(value.toString()) ? null : Number(value));

const normalizerDispatcher = {
  name: identity,
  description: identity,
  statusId: normalizeDigit,
  executorId: normalizeDigit,
  labels: (value) => [...value].map((id) => ({ id })),
};

const normalizeData = (data, initialAcc = {}) => Object.entries(data)
  .reduce((acc, [key, value]) => ({
    ...acc,
    [snakeCase(key)]: normalizerDispatcher[key](value),
  }), initialAcc);

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const {
        creatorId, executorId, statusId, labelId,
      } = req.query;

      const query = app.objection.models.task.query()
        .withGraphJoined('[status, creator, executor, labels]')
        .orderBy('created_at', 'desc');

      if (creatorId) {
        query.modify('filterByCreatorId', req.user.id);
      }
      if (executorId) {
        query.modify('filterByExecutorId', executorId);
      }
      if (statusId) {
        query.modify('filterByStatusId', statusId);
      }
      if (labelId) {
        query.modify('filterByLabelId', labelId);
      }

      const tasks = await query;

      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/index', {
        tasks,
        query: req.query,
        statuses,
        users,
        labels,
      });
      return reply;
    })
    .get('/tasks/:id', { name: 'taskProfile', preValidation: app.authenticate }, async (req, reply) => {
      const task = await app.objection.models.task.query()
        .findById(req.params.id)
        .withGraphJoined('[status, creator, executor, labels]');

      reply.render('tasks/profile', { task });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/new', {
        task, statuses, users, labels,
      });
    })
    .post('/tasks', { preValidation: app.authenticate }, async (req, reply) => {
      const creatorId = Number(req.user.id);
      const taskData = normalizeData(req.body.data, { creator_id: creatorId });
      try {
        const { task } = app.objection.models;
        await task.transaction(async (trx) => task
          .query(trx)
          .insertGraph(taskData, { relate: true }));

        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (error) {
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.statusCode = 422;
        reply.render('tasks/new', {
          task: req.body.data,
          statuses,
          users,
          labels,
          errors: error.data,
        });
        return reply;
      }
    })
    .patch('/tasks/:id', { name: 'updateTask', preValidation: app.authenticate }, async (req, reply) => {
      const creatorId = Number(req.user.id);
      const taskId = Number(req.params.id);
      const initialAcc = {
        creator_id: creatorId,
        id: taskId,
        labels: [],
      };
      const taskData = normalizeData(req.body.data, initialAcc);
      try {
        const { task } = app.objection.models;
        await task.transaction(async (trx) => task
          .query(trx)
          .upsertGraph(taskData, { relate: true, unrelate: true }));

        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (error) {
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();
        req.flash('error', i18next.t('flash.editError'));
        reply.statusCode = 422;
        reply.render('tasks/edit', {
          task: {
            ...req.body.data,
            id: taskId,
          },
          statuses,
          users,
          labels,
          errors: error.data,
        });
        return reply;
      }
    })
    .delete('/tasks/:id', { name: 'deleteTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = await app.objection.models.task.query().findById(req.params.id);

      if (req.user.id !== Number(task.creatorId)) {
        req.flash('error', i18next.t('flash.tasks.accessError'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      }

      await task.$relatedQuery('labels').unrelate();
      await task.$query().delete();
      req.flash('info', i18next.t('flash.tasks.delete.success'));
      reply.redirect(app.reverse('tasks'));
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = await app.objection.models.task.query()
        .findById(req.params.id)
        .withGraphJoined('labels');

      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();

      reply.render('tasks/edit', {
        task, statuses, users, labels,
      });
      return reply;
    });
};
