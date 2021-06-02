// @ts-check

import i18next from 'i18next';
import _ from 'lodash';

export default (app) => ({
  route(name, args) {
    return app.reverse(name, args);
  },
  t(key) {
    return i18next.t(key);
  },
  _,
  getAlertClass(type) {
    switch (type) {
      // case 'failure':
      //   return 'danger';
      case 'error':
        return 'danger';
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      default:
        throw new Error(`Unknown flash type: '${type}'`);
    }
  },
  formatDate(str) {
    const date = new Date(str);
    return date.toLocaleString();
  },
  shouldBeSelected(selectable) {
    const dispatcher = {
      number: (idToSelect) => selectable.toString() === idToSelect.toString(),
      string: (idToSelect) => selectable === idToSelect.toString(),
      object: (idToSelect) => selectable && selectable
        .map((item) => item.toString())
        .includes(idToSelect.toString()),
    };
    return dispatcher[typeof (selectable)];
  },
});
