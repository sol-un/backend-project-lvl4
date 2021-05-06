import i18next from 'i18next';

const predicates = {
  filterByCreator: (task, id) => task.creatorId.toString() === id,
  filterByOwner: (task, id) => (task.ownerId
    ? task.ownerId.toString() === id
    : false),
  filterByStatus: (task, id) => task.statusId.toString() === id,
};

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const tasks = await app.objection.models.task.query()
        .join('statuses', 'statuses.id', '=', 'tasks.status_id')
        .join('users as creator', 'creator.id', 'tasks.creator_id')
        .leftJoin('users as owner', 'owner.id', 'tasks.owner_id')
        .select(
          'tasks.id',
          'tasks.name',
          'tasks.created_at',
          'statuses.name as status_name',
          'creator.first_name as creator_first_name',
          'creator.last_name as creator_last_name',
          'owner.first_name as owner_first_name',
          'owner.last_name as owner_last_name',
        );
      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/:id', { name: 'taskProfile' }, async (req, reply) => {
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
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      const task = new app.objection.models.task();
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/new', {
        task, statuses, users, labels,
      });
    })
    .post('/tasks', async (req, reply) => {
      const {
        name,
        desription,
        owner_id, status_id, label_ids, // eslint-disable-line camelcase
      } = req.body.data;
      const taskData = {
        name,
        desription,
        owner_id: Number(owner_id),
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
        console.log(error);
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
    .patch('/tasks/:id', { name: 'updateTask' }, async (req, reply) => {
      const task = await app.objection.models.task.query().findById(req.params.id);

      const {
        name,
        description,
        status_id, owner_id, label_ids, // eslint-disable-line camelcase
      } = req.body.data;

      try {
        await task.$query()
          .update({
            name,
            description,
            creator_id: task.creatorId,
            owner_id: Number(owner_id),
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
        console.log(error);
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
    // .post('/tasks/index', { name: 'taskFilter' }, async (req, reply) => {
    //   const { body } = req;
    //   const statuses = await app.objection.models.status.query();
    //   const users = await app.objection.models.user.query();
    //   // const labels = await app.objection.models.label.query();

    //   const tasks = await app.objection.models.task.query();
    //   const filteredTasks = Object.keys(body)
    //     .filter((key) => body[key] >= 0)
    //     .reduce((acc, key) => _.pickBy(acc, (task) => predicates[key](task, body[key])), tasks);
    //   // const taskPromises = _.values(filteredTasks).map((task) => promiseTaskData(task, app));
    //   const data = await Promise.all(taskPromises);
    //   reply.render('tasks/index', {
    //     data, statuses, users, body, // labels,
    //   });
    // })
    .delete('/tasks/:id', { name: 'deleteTask' }, async (req, reply) => {
      try {
        await app.objection.models.task.query().deleteById(req.params.id);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      } catch (error) {
        return app.httpErrors.internalServerError(error);
      }
    })
    .get('/tasks/:id/edit', { name: 'editTask' }, async (req, reply) => {
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
