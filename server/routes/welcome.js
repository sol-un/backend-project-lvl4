// @ts-check

export default (app) => {
  app
    .get('/', { name: 'root' }, async (req, reply) => {
      reply.render('welcome/index');
      return reply;
    });
};
