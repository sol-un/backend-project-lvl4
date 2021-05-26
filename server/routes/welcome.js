// @ts-check

export default (app) => {
  app
    .get('/', { name: 'root' }, async (req, reply) => {
      // if (!req.isAuthenticated()) {
      //   reply.redirect(app.reverse('newSession'));
      //   return reply;
      // }
      // const ownedTasks = await app.objection.models.task.query()
      //   .where('owner_id', req.user.id)
      //   .join('statuses', 'statuses.id', 'tasks.status_id')
      //   .join('users as creator', 'creator.id', 'tasks.creator_id')
      //   .select(
      //     'tasks.id',
      //     'tasks.name',
      //     'tasks.description',
      //     'tasks.created_at',
      //     'statuses.name as status_name',
      //     'creator.first_name as creator_first_name',
      //     'creator.last_name as creator_last_name',
      //   );
      reply.render('welcome/index'); // , { user: req.user, tasks: ownedTasks });
      return reply;
    });
};
