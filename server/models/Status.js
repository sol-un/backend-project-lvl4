import path from 'path';
import objection from 'objection';

const { Model } = objection;

export default class Status extends Model {
  static get tableName() {
    return 'statuses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }

  static get relationMappings() {
    return {
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'Task.js'),
        join: {
          from: 'statuses.id',
          to: 'tasks.status_id',
        },
      },
    };
  }
}
