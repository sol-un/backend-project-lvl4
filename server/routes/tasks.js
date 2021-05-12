import i18next from 'i18next';
import { isEmpty } from 'lodash';

const predicates = {
  isCreatorUser: (task, id) => task.creatorId.toString() === id,
  byOwnerId: (task, id) => (task.ownerId
    ? task.ownerId.toString() === id
    : false),
  byStatusId: (task, id) => task.statusId.toString() === id,
};

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const tasks = await app.objection.models.task.query()
        .join('statuses', 'statuses.id', '=', 'tasks.status_id')
        .join('users as creator', 'creator.id', 'tasks.creator_id')
        .leftJoin('users as owner', 'owner.id', 'tasks.owner_id')
        .select(
          'tasks.*',
          'statuses.name as status_name',
          'creator.first_name as creator_first_name',
          'creator.last_name as creator_last_name',
          'owner.first_name as owner_first_name',
          'owner.last_name as owner_last_name',
        );
      const filteredTasks = Object.keys(req.query)
        .filter((key) => Number(req.query[key]) > 0)
        .reduce((acc, key) => acc.filter((task) => predicates[key](task, req.query[key])), tasks);

      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      console.log(req.query);
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
        .join('statuses', 'statuses.id', 'tasks.status_id')
        .join('users as creator', 'creator.id', 'tasks.creator_id')
        .leftJoin('users as owner', 'owner.id', 'tasks.owner_id')
        .select(
          'tasks.id',
          'tasks.name',
          'tasks.description',
          'tasks.created_at',
          'statuses.name as status_name',
          'creator.first_name as creator_first_name',
          'creator.last_name as creator_last_name',
          'owner.first_name as owner_first_name',
          'owner.last_name as owner_last_name',
        );
      const labels = await app.objection.models.taskLabel.query()
        .where('task_id', task.id)
        .join('labels', 'labels.id', 'tasks_labels.label_id')
        .select('labels.name');
      reply.render('tasks/profile', { task, labels });
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
        status_id, owner_id, label_ids = [], // eslint-disable-line camelcase
      } = req.body.data;
      const taskData = {
        name,
        description,
        owner_id: isEmpty(owner_id) ? null : Number(owner_id),
        status_id: Number(status_id),
        creator_id: Number(req.user.id),
      };

      try {
        const task = await app.objection.models.task.fromJson(taskData);
        await app.objection.models.task.query().insert(task);

        const labelsData = [...label_ids] // eslint-disable-line camelcase
          .map((id) => ({ task_id: task.id, label_id: Number(id) }));
        const labelInsertionPromises = labelsData
          .map(async (item) => app.objection.models.taskLabel.query().insert(item));
        await Promise.all(labelInsertionPromises);

        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (error) {
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', {
          task: taskData, statuses, users, labels, labelIds: label_ids, errors: error.data,
        });
        return reply;
      }
    })
    .patch('/tasks/:id', { name: 'updateTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = await app.objection.models.task.query().findById(req.params.id);
      const {
        name,
        description,
        status_id, owner_id, label_ids = [], // eslint-disable-line camelcase
      } = req.body.data;

      try {
        await task.$query()
          .update({
            name,
            description,
            creator_id: task.creatorId,
            owner_id: isEmpty(owner_id) ? null : Number(owner_id),
            status_id: Number(status_id),
          });

        await app.objection.models.taskLabel.query()
          .where('task_id', task.id)
          .delete();
        const labelsData = [...label_ids] // eslint-disable-line camelcase
          .map((id) => ({ task_id: task.id, label_id: Number(id) }));
        const labelInsertionPromises = labelsData
          .map(async (item) => app.objection.models.taskLabel.query().insert(item));
        await Promise.all(labelInsertionPromises);

        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (error) {
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.render('tasks/edit', {
          task, statuses, users, labels, labelIds: label_ids, errors: error.data,
        });
        return reply;
      }
    })
    .delete('/tasks/:id', { name: 'deleteTask', preValidation: app.authenticate }, async (req, reply) => {
      try {
        await app.objection.models.taskLabel.query()
          .where('task_id', req.params.id)
          .delete();
        await app.objection.models.task.query().deleteById(req.params.id);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (error) {
        return app.httpErrors.internalServerError(error);
      }
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const task = await app.objection.models.task.query().findById(req.params.id);
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      const labelIdObjects = await app.objection.models.taskLabel.query()
        .where('task_id', task.id)
        .join('labels', 'labels.id', 'tasks_labels.label_id')
        .select('labels.id');
      const labelIds = labelIdObjects.map(({ id }) => id);
      reply.render('tasks/edit', {
        task, statuses, users, labels, labelIds,
      });
      return reply;
    });
};
