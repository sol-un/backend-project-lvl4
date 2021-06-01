// @ts-check

import i18next from 'i18next';
import { isEmpty } from 'lodash';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {
      try {
        const user = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(user);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch (error) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: req.body.data, errors: error.data });
        return reply;
      }
    })
    .patch('/users/:id', { name: 'updateUser', preValidation: app.authenticate }, async (req, reply) => {
      if (req.user.id !== Number(req.params.id)) {
        req.flash('error', i18next.t('flash.users.IDerror'));
        reply.redirect(app.reverse('users'));
        return reply;
      }
      const user = await app.objection.models.user.query().findById(req.user.id);
      try {
        await user.$query().update(req.body.data);
        req.flash('info', i18next.t('flash.users.edit.success'));
        reply.redirect(app.reverse('users'));
        return reply;
      } catch (error) {
        req.flash('error', i18next.t('flash.editError'));
        reply.render('users/edit', { user: { ...req.body.data, id: req.user.id }, errors: error.data });
        return reply;
      }
    })
    .delete('/users/:id', { name: 'deleteUser', preValidation: app.authenticate }, async (req, reply) => {
      if (req.user.id !== Number(req.params.id)) {
        req.flash('error', i18next.t('flash.users.IDerror'));
        reply.redirect(app.reverse('users'));
        return reply;
      }

      const user = await app.objection.models.user.query().findById(req.user.id);
      const createdTasks = await user.$relatedQuery('createdTasks');
      const ownedTasks = await user.$relatedQuery('ownedTasks');

      if (!isEmpty(createdTasks) || !isEmpty(ownedTasks)) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        reply.redirect(app.reverse('users'));
        return reply;
      }

      try {
        await user.$query().delete();
        req.logOut();
        req.flash('info', i18next.t('flash.users.delete.success'));
        reply.redirect(app.reverse('users'));
        return reply;
      } catch (error) {
        return app.httpErrors.internalServerError(error);
      }
    })
    .get('/users/:id/edit', { name: 'editUser', preValidation: app.authenticate }, (req, reply) => {
      if (req.user.id !== Number(req.params.id)) {
        req.flash('error', i18next.t('flash.users.IDerror'));
        reply.redirect(app.reverse('users'));
        return reply;
      }
      reply.render('users/edit', { user: req.user });
      return reply;
    });
};
