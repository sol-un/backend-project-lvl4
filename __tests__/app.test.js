// @ts-check

import {
  describe, beforeAll, it, expect,
} from '@jest/globals';
import getApp from '../server/index.js';

describe('requests', () => {
  let app;

  beforeAll(async () => {
    app = await getApp();
  });

  it('GET 302', async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('root'),
    });
    expect(res.statusCode).toBe(302);
  });

  it('GET 404', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/wrong-path',
    });
    expect(res.statusCode).toBe(404);
  });

  afterAll(() => {
    app.close();
  });
});
