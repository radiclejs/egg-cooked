'use strict';

const Service = require('../../framework').Service;

/**
 * Test Service
 */
class Test extends Service {
  constructor(ctx) {
    super(ctx);
    this.config = this.app.config.test;
  }

  async get(id) {
    return { id, name: this.config.key };
  }
}

module.exports = Test;
