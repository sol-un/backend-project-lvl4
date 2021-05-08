import objection from 'objection';

const { Model } = objection;

export default class TaskLabel extends Model {
  static get tableName() {
    return 'tasks_labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['task_id', 'label_id'],
      properties: {
        id: { type: 'integer' },
        task_id: { type: 'integer' },
        label_id: { type: 'integer' },
      },
    };
  }
}
