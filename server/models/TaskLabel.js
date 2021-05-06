import objection from 'objection';

const { Model } = objection;

export default class TaskLabel extends Model {
  static get tableName() {
    return 'tasks_labels';
  }
}
