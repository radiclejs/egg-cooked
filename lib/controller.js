'use strict';

const egg = require('egg');
const _ = require('lodash');

module.exports = class CookedController extends egg.Controller {
  get SERVICE() {
    throw new Error('SERVICE must be implemented');
  }

  get id() {
    return this.checkInput({
      id: 'string'
    }, ['id']).id;
  }

  checkInput(rule, keys, isParam = true) {
    const ctx = this.ctx;
    const { BOOL_TRANSFER } = this.app;

    // 取得参数并修正 && 过滤掉可选参数信息
    const validOptions = _.reduce(keys, function(result, key) {
      let value = isParam ? ctx.params[key] : ctx.request.body[key];
      let ruleType = _.isObject(rule[key]) ? rule[key].type : rule[key];

      if (ruleType === 'int') {
        // 矫正
        if (_.isString(value)) {
          value = +value;
        }
      }

      if (ruleType === 'bool') {
        if (_.isString(value)) {
          value = BOOL_TRANSFER[value];
        }
      }

      const notRequired = _.isObject(rule[key]) && !rule[key].required
      // 指明了是可选项并且也没有传这个参数, 就不要校验了
      const notValid = notRequired && value === undefined;

      if (!notValid) {
        result.rule[key] = rule[key];
        result.data[key] = value;
      }
      return result;
    }, { rule: {}, data: {} });

    // 校验参数
    ctx.validate(validOptions.rule, validOptions.data);
    return validOptions.data;
  }

  checkBodyInput(rule, keys) {
    return this.checkInput(rule, keys, false);
  }

  async list(query) {
    const ctx = this.ctx;
    const result = await this.SERVICE.list(query);
    ctx.done(result);
  }

  async findById() {
    const result = await this.SERVICE.find(this.id);
    this.ctx.done(result);
  }

  async find(query) {
    const result = await this.SERVICE.find(query);
    this.ctx.done(result);
  }

  async create(body) {
    const ctx = this.ctx;

    const created = await this.SERVICE.create(body);
    ctx.status = 201;
    ctx.done(created);
  }

  async update(updates) {
    const ctx = this.ctx;
    const result = await this.SERVICE.updateById({ id: this.id, updates });
    ctx.done(result);
  }

  async del() {
    const ctx = this.ctx;
    const result = await this.SERVICE.del(this.id);
    ctx.status = 200;
    ctx.done(result);
  }
}
