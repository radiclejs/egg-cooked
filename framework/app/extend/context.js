'use strict';

const delegate = require('delegates');
const COOKIES = Symbol('Context#cookies');
const CONTEXT_LOGGERS = Symbol('Context#logger');
const HELPER = Symbol('Context#helper');

const proto = module.exports = {
  get cookies() {
    if (!this[COOKIES]) {
      this[COOKIES] = new this.app.ContextCookies(this, this.app.keys);
    }
    return this[COOKIES];
  },

  /**
   * Alias to {@link Application#router}
   *
   * @member {Router} Context#router
   * @since 1.0.0
   * @example
   * ```js
   * this.router.pathFor('post', { id: 12 });
   * ```
   */
  get router() {
    return this.app.router;
  },


  /**
   * Get helper instance from {@link Application#Helper}
   *
   * @member {Helper} Context#helper
   * @since 1.0.0
   */
  get helper() {
    if (!this[HELPER]) {
      this[HELPER] = new this.app.Helper(this);
    }
    return this[HELPER];
  },

  /**
   * Wrap app.loggers with context infomation,
   * if a custom logger is defined by naming aLogger, then you can `ctx.getLogger('aLogger')`
   *
   * @param {String} name - logger name
   * @return {Logger} logger
   */
  getLogger(name) {
    let cache = this[CONTEXT_LOGGERS];
    if (!cache) {
      cache = this[CONTEXT_LOGGERS] = {};
    }

    // read from cache
    if (cache[name]) return cache[name];

    // get no exist logger
    const appLogger = this.app.getLogger(name);
    if (!appLogger) return null;

    // write to cache
    cache[name] = new this.app.ContextLogger(this, appLogger);
    return cache[name];
  },

  /**
   * Logger for Application, wrapping app.coreLogger with context infomation
   *
   * @member {ContextLogger} Context#logger
   * @since 1.0.0
   * @example
   * ```js
   * this.logger.info('some request data: %j', this.request.body);
   * this.logger.warn('WARNING!!!!');
   * ```
   */
  get logger() {
    return this.getLogger('logger');
  },

  /**
   * Logger for frameworks and plugins,
   * wrapping app.coreLogger with context infomation
   *
   * @member {ContextLogger} Context#coreLogger
   * @since 1.0.0
   */
  get coreLogger() {
    return this.getLogger('coreLogger');
  },
};

/**
 * Context delegation.
 * 这里把request上的许多方法delegate到了context上面, 另外注意koa上原本有accept属性(必须)，
 * 但是因为覆写了application里的createContext方法, 所以这里也要重新delegate下
 */

delegate(proto, 'request')
  .getter('accept')
  /**
   * @member {string} Context#ip
   * @see Request#ip
   * @since 1.0.0
   */
  .access('ip');