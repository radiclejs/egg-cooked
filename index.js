'use strict';

const Application = require('./lib/application');
const Agent = require('./lib/agent');
const Controller = require('./lib/controller');
const Service = require('./lib/service');
const egg = require('egg');

Object.assign(exports, egg);

exports.Application = Application;
exports.Agent = Agent;
exports.Controller = Controller;
exports.Service = Service;
