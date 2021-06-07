// @ts-check

import path from 'path';
import { Model } from 'objection';
import objectionUnique from 'objection-unique';

import encrypt from '../lib/secure.js';

const unique = objectionUnique({ fields: ['email'] });

export default class User extends unique(Model) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 3 },
      },
    };
  }

  static get relationMappings() {
    return {
      createdTasks: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'Task.js'),
        join: {
          from: 'users.id',
          to: 'tasks.creator_id',
        },
      },
      ownedTasks: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'Task.js'),
        join: {
          from: 'users.id',
          to: 'tasks.executor_id',
        },
      },
    };
  }

  static get virtualAttributes() {
    return ['name'];
  }

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }

  set password(value) {
    this.passwordDigest = encrypt(value);
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }
}
