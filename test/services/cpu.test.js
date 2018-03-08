const assert = require('assert');
const app = require('../../src/app');

describe('\'cpu\' service', () => {
  it('registered the service', () => {
    const service = app.service('cpu');

    assert.ok(service, 'Registered the service');
  });
});
