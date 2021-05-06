// @ts-check

export default (app) => {
  app
    .get('/', { name: 'root' }, async (req, reply) => {
      if (!req.isAuthenticated()) {
        reply.redirect(app.reverse('newSession'));
        return reply;
      }
      const ownedTasks = await app.objection.models.task.query().where('owner_id', req.user.id);
      reply.render('welcome/index', { user: req.user, ownedTasksCount: ownedTasks.length });
      return reply;
    });
};
