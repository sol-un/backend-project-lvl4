import objection from 'objection';
import Status from './Status.js';
import User from './User.js';
import Label from './Label.js';

const { Model } = objection;

export default class Task extends Model {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'status_id', 'creator_id'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        status_id: { type: 'integer' },
        owner_id: { type: ['integer', 'null'] },
        creator_id: { type: 'integer' },
      },
    };
  }

  static get relationMappings() {
    return {
      status: {
        relation: Model.BelongsToOneRelation,
        modelClass: Status,
        join: {
          from: 'tasks.status_id',
          to: 'statuses.id',
        },
      },
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.creator_id',
          to: 'users.id',
        },
      },
      labels: {
        relation: Model.ManyToManyRelation,
        modelClass: Label,
        join: {
          from: 'tasks.id',
          through: {
            from: 'tasks_labels.task_id',
            to: 'tasks_labels.label_id',
          },
          to: 'labels.id',
        },
      },
    };
  }
}
