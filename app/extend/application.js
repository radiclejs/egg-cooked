'use strict';

const _ = require('lodash')
const moment = require('moment')
const DEBUG = require('debug')('extend:application')
const constEnums = require('../../lib/const')

module.exports = {
  _,

  moment,

  ...constEnums,

  /**
   * 同步表结构到远程DB服务器(只创建一次, 从无到有)
   */
  async syncDBOnlyOnce() {
    DEBUG('sync DB start')
    await this.model.sync();
    DEBUG('sync DB done');
  },

  /**
   * 读取数据文件并且初始化数据到DB, 仅一次
   */
  async syncDBDataOnlyOnce() {},

  /**
   * 警告: 创世, 删除所有数据, 重新造新数据, 一切初始化
   * 仅能在本地环境使用
   */
  async TheCreation() {
    await this.model.drop();
    await this.syncDBOnlyOnce();
    await this.syncDBDataOnlyOnce();
  }
};
