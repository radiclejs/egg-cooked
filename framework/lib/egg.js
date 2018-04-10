'use strict';

const path = require('path');
const debug = require('debug')('egg:application');
const http = require('http');
const EggCore = require('egg-core').EggCore;
const ContextLogger = require('egg-logger').EggContextLogger;
// const BaseContextClass = require('egg-core').BaseContextClass;
const BaseContextClass = require('./core/base_context_class');
const Singleton = require('./core/singleton');
const ContextCookies = require('egg-cookies');
const createLoggers = require('./core/logger');
const LOGGERS = Symbol('EggApplication#loggers');
const EGG_PATH = Symbol.for('egg#eggPath');

/**
 * Base on koa's Application
 * @see https://github.com/eggjs/egg-core
 * @see http://koajs.com/#application
 * @extends EggCore
 */
class EggApplication extends EggCore {

  /**
   * @constructor
   * @param {Object} options
   *  - {Object} [type] - type of instance, Agent and Application both extend koa, type can determine what it is.
   *  - {String} [baseDir] - app root dir, default is `process.cwd()`
   *  - {Object} [plugins] - custom plugin config, use it in unittest
   */
  constructor(options) {
    super(options);
    this.ContextCookies = ContextCookies;
    this.ContextLogger = ContextLogger;

    this.loader.loadConfig();

    this.console.info('[egg:core] App root: %s', this.baseDir);
    this.console.info('[egg:core] All *.log files save on %j', this.config.logger.dir);
    this.console.info('[egg:core] Loaded enabled plugin %j', this.loader.orderPlugins);

    // Listen the error that promise had not catch, then log it in common-error
    this._unhandledRejectionHandler = this._unhandledRejectionHandler.bind(this);
    process.on('unhandledRejection', this._unhandledRejectionHandler);

    // register close function
    this.beforeClose(() => {
      for (const logger of this.loggers.values()) {
        logger.close();
      }
      process.removeListener('unhandledRejection', this._unhandledRejectionHandler);
    });

    /**
     * Retreive base context class
     * @member {Controller} BaseContextClass
     * @since 1.0.0
     */
    this.BaseContextClass = BaseContextClass;

    /**
     * Retreive base controller
     * @member {Controller} Controller
     * @since 1.0.0
     */
    this.Controller = BaseContextClass;

    /**
     * Retreive base service
     * @member {Service} Service
     * @since 1.0.0
     */
    this.Service = BaseContextClass;
  }

    /**
   *  All loggers contain logger, coreLogger and customLogger
   * @member {Object}
   * @since 1.0.0
   */
  get loggers() {
    if (!this[LOGGERS]) {
      this[LOGGERS] = createLoggers(this);
    }
    return this[LOGGERS];
  }

  /**
   * Get logger by name, it's equal to app.loggers['name'],
   * but you can extend it with your own logical.
   * @param {String} name - logger name
   * @return {Logger} logger
   */
  getLogger(name) {
    return this.loggers[name] || null;
  }

  /**
   * application logger, log file is `$HOME/logs/{appname}/{appname}-web`
   * @member {Logger}
   * @since 1.0.0
   */
  get logger() {
    return this.getLogger('logger');
  }

  /**
   * core logger for framework and plugins, log file is `$HOME/logs/{appname}/egg-web`
   * @member {Logger}
   * @since 1.0.0
   */
  get coreLogger() {
    return this.getLogger('coreLogger');
  }

  _unhandledRejectionHandler(err) {
    if (!(err instanceof Error)) {
      const newError = new Error(String(err));
      // err maybe an object, try to copy the name, message and stack to the new error instance
      /* istanbul ignore else */
      if (err) {
        if (err.name) newError.name = err.name;
        if (err.message) newError.message = err.message;
        if (err.stack) newError.stack = err.stack;
      }
      err = newError;
    }
    /* istanbul ignore else */
    if (err.name === 'Error') {
      err.name = 'unhandledRejectionError';
    }
    this.coreLogger.error(err);
  }

  // 每一个继承application的类都要声明这个路径, 这个是为了在框架多层继承的时候分析框架所在的路径来加载代码
  get [EGG_PATH]() {
    return path.join(__dirname, '..');
  }

  /**
   * create a singleton instance
   * @param {String} name - unique name for singleton
   * @param {Object} create - method will be invoked when singleton instance create
   */
  addSingleton(name, create) {
    const options = {};
    options.name = name;
    options.create = create;
    options.app = this;
    const singleton = new Singleton(options);
    singleton.init();
  }

  /**
   * app.env delegate app.config.env
   * @deprecated
   */
  get env() {
    this.deprecate('please use app.config.env instead');
    return this.config.env;
  }
  /* eslint no-empty-function: off */
  set env(_) {}

  /**
   * Shorthand for:
   *
   *    http.createServer(app.callback()).listen(...)
   *    这里覆写了koa原生方法为了同时广播server事件
   *
   * @param {Mixed} ...
   * @return {Server}
   * @api public
   */

  listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    this.emit('server', server);
    return server.listen(...args);
  }
}

module.exports = EggApplication;
