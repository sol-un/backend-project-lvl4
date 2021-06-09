import i18next from 'i18next';
import { isEmpty } from 'lodash';

export default (app) => {
  app
    .get('/labels', { name: 'labels', preValidation: app.authenticate }, async (request, reply) => {
      const labels = await app.objection.models.label.query();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { name: 'newLabel', preValidation: app.authenticate }, async (request, reply) => {
      const label = new app.objection.models.label();
      reply.render('labels/new', { label });
    })
    .post('/labels', { preValidation: app.authenticate }, async (req, reply) => {
      try {
        const label = await app.objection.models.label.fromJson(req.body.data);
        await app.objection.models.label.query().insert(label);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels'));
        return reply;
      } catch (error) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.statusCode = 422;
        reply.render('labels/new', { label: req.body.data, errors: error.data });
        return reply;
      }
    })
    .patch('/labels/:id', { name: 'updateLabel', preValidation: app.authenticate }, async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);
      try {
        await label.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.labels.edit.success'));
        reply.redirect(app.reverse('labels'));
        return reply;
      } catch (error) {
        req.flash('error', i18next.t('flash.editError'));
        reply.statusCode = 422;
        reply.render('labels/edit', { label, errors: error.data });
        return reply;
      }
    })
    .delete('/labels/:id', { name: 'deleteLabel', preValidation: app.authenticate }, async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);
      const relatedTasks = await label.$relatedQuery('tasks');

      if (!isEmpty(relatedTasks)) {
        req.flash('error', i18next.t('flash.labels.delete.error'));
        reply.redirect(app.reverse('labels'));
        return reply;
      }

      await label.$query().delete();
      req.flash('info', i18next.t('flash.labels.delete.success'));
      reply.redirect(app.reverse('labels'));
      return reply;
    })
    .get('/labels/:id/edit', { name: 'editLabel', preValidation: app.authenticate }, async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);
      reply.render('labels/edit', { label });
      return reply;
    });
};
