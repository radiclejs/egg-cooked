'use strict';

/**
 * @namespace Egg
 */

// const BaseContextClass = require('egg-core').BaseContextClass;
const BaseContextClass = require('./lib/core/base_context_class');

/**
 * @member {Application} Egg#Application
 * @since 1.0.0
 */
exports.Application = require('./lib/application');

/**
 * @member {Agent} Egg#Agent
 * @since 1.0.0
 */
exports.Agent = require('./lib/agent');

/**
 * @member {AppWorkerLoader} Egg#AppWorkerLoader
 * @since 1.0.0
 */
exports.AppWorkerLoader = require('./lib/loader').AppWorkerLoader;

/**
 * @member {Controller} Egg#Controller
 * @since 1.1.0
 */
exports.Controller = BaseContextClass;

/**
 * @member {Service} Egg#Service
 * @since 1.1.0
 */
exports.Service = BaseContextClass;
/**
 * @member {BaseContextClass} Egg#BaseContextClass
 * @since 1.2.0
 */
exports.BaseContextClass = BaseContextClass;
