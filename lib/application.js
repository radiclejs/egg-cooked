'use strict';

const path = require('path');
const egg = require('../framework');
const EGG_PATH = Symbol.for('egg#eggPath');

class EggCookedApplication extends egg.Application {
  get [EGG_PATH]() {
    return path.dirname(__dirname);
  }
}

module.exports = EggCookedApplication;
