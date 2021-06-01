import i18next from 'i18next';
import { isEmpty } from 'lodash';

const predicates = {
  byCreatorId: (task, id) => task.creatorId.toString() === id,
  byOwnerId: (task, id) => (task.ownerId
    ? task.ownerId.toString() === id
    : false),
  byStatusId: (task, id) => task.statusId.toString() === id,
  byLabelId: (task, id) => task.labelIds.some(({ id: labelId }) => labelId === Number(id)),
};

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const tasks = await app.objection.models.task.query()
        .withGraphJoined(`[
          status(selectName),
          creator,
          owner,
          labels(selectId) as labelIds
        ]`);

      const filteredTasks = Object.keys(req.query)
        .filter((key) => Number(req.query[key]) > 0)
        .reduce((acc, key) => acc
          .filter((task) => predicates[key](task, req.query[key])), tasks);

      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/index', {
        tasks: filteredTasks,
        creatorId: req.user.id,
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
        .withGraphJoined(`[
          status(selectName),
          creator,
          owner,
          labels(selectName) as labelNames
        ]`);

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
      const {
        name,
        description,
        statusId, executorId, labels: labelIds = [],
      } = req.body.data;
      const taskData = {
        name,
        description,
        owner_id: isEmpty(executorId) ? null : Number(executorId),
        status_id: Number(statusId),
        creator_id: Number(req.user.id),
      };

      try {
        await app.objection.models.task
          .query()
          .insertGraph([
            {
              ...taskData,
              labels: [...labelIds]
                .map((id) => ({ id })),
            },
          ],
          { relate: true });

        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (error) {
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();
        req.flash('error', i18next.t('flash.createError'));
        reply.render('tasks/new', {
          task: taskData, statuses, users, labels, labelIds, errors: error.data,
        });
        return reply;
      }
    })
    .patch('/tasks/:id', { name: 'updateTask', preValidation: app.authenticate }, async (req, reply) => {
      const {
        name,
        description,
        statusId, executorId, labels: labelIds = [],
      } = req.body.data;
      const taskData = {
        id: Number(req.params.id),
        name,
        description,
        owner_id: isEmpty(executorId) ? null : Number(executorId),
        status_id: Number(statusId),
        creator_id: Number(req.user.id),
      };

      try {
        await await app.objection.models.task
          .query()
          .upsertGraph([
            {
              ...taskData,
              labels: [...labelIds]
                .map((id) => ({ id })),
            },
          ],
          {
            relate: true,
            unrelate: true,
          });

        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (error) {
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();
        req.flash('error', i18next.t('flash.editError'));
        reply.render('tasks/edit', {
          task: taskData, statuses, users, labels, labelIds, errors: error.data,
        });
        return reply;
      }
    })
    .delete('/tasks/:id', { name: 'deleteTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = await app.objection.models.task.query().findById(req.params.id);

      if (req.user.id !== Number(task.creatorId)) {
        req.flash('error', i18next.t('flash.tasks.IDerror'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      }

      try {
        await task.$relatedQuery('labels').unrelate();
        await task.$query().delete();
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (error) {
        return app.httpErrors.internalServerError(error);
      }
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = await app.objection.models.task.query()
        .findById(req.params.id)
        .withGraphJoined('labels(selectId) as labelIds');

      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();

      reply.render('tasks/edit', {
        task, statuses, users, labels,
      });
      return reply;
    });
};
