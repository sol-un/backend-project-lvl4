import path from 'path';
import objection from 'objection';

const { Model } = objection;

export default class Label extends Model {
  static get tableName() {
    return 'labels';
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
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname, 'Task.js'),
        join: {
          from: 'labels.id',
          through: {
            from: 'tasks_labels.label_id',
            to: 'tasks_labels.task_id',
          },
          to: 'tasks.id',
        },
      },
    };
  }

  static get modifiers() {
    return {
      selectName(builder) {
        builder.select('name');
      },
      selectId(builder) {
        builder.select('id');
      },
    };
  }
}
