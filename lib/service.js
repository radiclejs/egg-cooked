'use strict';

const Service = require('egg').Service;
const _ = require('lodash');

module.exports = class CookedService extends Service {
  get MODEL() {
    throw new Error('MODEL must be implemented');
  }

  async list(options = {}) {
    options.offset = options.offset || 0;
    options.limit = options.limit || 9999;
    options.order_by = options.order_by || 'created_at';
    options.order = options.order || 'DESC';
    options.where = options.where || {};
    const { offset, limit, where, transaction, include, order_by, order } = options;

    const result = await this.MODEL.findAndCountAll({
      offset,
      limit,
      order: [[ order_by, order.toUpperCase() ]],
      where: Object.assign(where, {
        enable: true
      }),
      include,
      transaction
    });

    return result;
  }

  async find(id, options = {}) {
    if (!options.where) {
      options.where = {};
      options.where.id = id;
    }
    return this.findOne(options);
  }

  async findOne(options = {}) {
    if (!options.where) {
      options.where = {};
      // options.where.enable = true;
    }
    const item = await this.MODEL.findOne(options);
    return item;
  }

  async last() {
    const order_by = 'created_at';
    const order = 'DESC';
    const item = await this.MODEL.findOne({
      order: [[ order_by, order.toUpperCase()]]
    });
    return item;
  }

  async create(item, options) {
    const result = await this.MODEL.create(item, options);
    return result;
  }

  async bulkCreate(data, options) {
    const result = await this.MODEL.bulkCreate(data, options);
    return result;
  }

  async updateById({ id, updates, options = {} }) {
    const item = await this.MODEL.findById(id, options);
    const result = await item.update(updates, options);
    return result;
  }

  async update(values, options) {
    const result = await this.MODEL.update(values, options);
    return result;
  }

  async upsert(values, options) {
    const result = await this.MODEL.upsert(values, options);
    return result;
  }

  async del(id, options) {
    const item = await this.MODEL.findById(id, options);
    if (!item) {
      throw new Error(`${id} not found`);
    }
    const result = await item.destroy(options);
    return result;
  }

  async max(attr, options) {
    const result = await this.MODEL.max(attr, options);
    return result;
  }
}
