import i18next from 'i18next';
import { isEmpty } from 'lodash';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses', preValidation: app.authenticate }, async (request, reply) => {
      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus', preValidation: app.authenticate }, async (request, reply) => {
      const status = new app.objection.models.status();
      reply.render('statuses/new', { status });
    })
    .post('/statuses', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const status = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(status);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
        return reply;
      } catch (error) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status: req.body.data, errors: error.data });
        return reply;
      }
    })
    .patch('/statuses/:id', { name: 'updateStatus', preValidation: app.authenticate }, async (req, reply) => {
      const status = await app.objection.models.status.query().findById(req.params.id);
      try {
        await status.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.statuses.edit.success'));
        reply.redirect(app.reverse('statuses'));
        return reply;
      } catch (error) {
        req.flash('error', i18next.t('flash.editError'));
        reply.render('statuses/edit', { status, errors: error.data });
        return reply;
      }
    })
    .delete('/statuses/:id', { name: 'deleteStatus', preValidation: app.authenticate }, async (req, reply) => {
      const status = await app.objection.models.status.query().findById(req.params.id);
      const relatedTasks = await status.$relatedQuery('tasks');

      if (!isEmpty(relatedTasks)) {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        reply.redirect(app.reverse('statuses'));
        return reply;
      }

      try {
        await status.$query().delete();
        req.flash('info', i18next.t('flash.statuses.delete.success'));
        reply.redirect(app.reverse('statuses'));
        return reply;
      } catch (error) {
        return app.httpErrors.internalServerError(error);
      }
    })
    .get('/statuses/:id/edit', { name: 'editStatus', preValidation: app.authenticate }, async (req, reply) => {
      const status = await app.objection.models.status.query().findById(req.params.id);
      reply.render('statuses/edit', { status });
      return reply;
    });
};
