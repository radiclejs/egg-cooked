'use strict';

const path = require('path');
// const fs = require('fs');
const http = require('http');
// const { assign } = require('utility');
const eggUtils = require('egg-core').utils;
const EggApplication = require('./egg');
const AppWorkerLoader = require('./loader').AppWorkerLoader;

const KEYS = Symbol('Application#keys');
const HELPER = Symbol('Application#Helper');
// const LOCALS = Symbol('Application#locals');
const WARN_CONFUSED_CONFIG = Symbol('Application#warnConfusedConfig');
const EGG_LOADER = Symbol.for('egg#loader');
const EGG_PATH = Symbol.for('egg#eggPath');

// client error => 400 Bad Request
// Refs: https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_event_clienterror
// const DEFAULT_BAD_REQUEST_HTML = `<html>
//   <head><title>400 Bad Request</title></head>
//   <body bgcolor="white">
//   <center><h1>400 Bad Request</h1></center>
//   <hr><center>❤</center>
//   </body>
//   </html>`;
// const DEFAULT_BAD_REQUEST_HTML_LENGTH = Buffer.byteLength(DEFAULT_BAD_REQUEST_HTML);
// const DEFAULT_BAD_REQUEST_RESPONSE =
//   `HTTP/1.1 400 Bad Request\r\nContent-Length: ${DEFAULT_BAD_REQUEST_HTML_LENGTH}` +
//   `\r\n\r\n${DEFAULT_BAD_REQUEST_HTML}`;

/**
 * Singleton instance in App Worker, extend {@link EggApplication}
 * @extends EggApplication
 */
class Application extends EggApplication {

  /**
   * @constructor
   * @param {Object} options - see {@link EggApplication}
   */
  constructor(options = {}) {
    options.type = 'application';
    super(options);

    if (process.env.EGG_SERVER_ENV === 'local') {
      global.app = this;
    }

    try {
      this.loader.load();
    } catch (e) {
      throw e;
    }

    this[WARN_CONFUSED_CONFIG]();
  }

  // 这里为了构造函数里初始化loader实例
  get [EGG_LOADER]() {
    return AppWorkerLoader;
  }

  get [EGG_PATH]() {
    return path.join(__dirname, '..');
  }

  /**
   * Create egg context, 注意这里覆写了koa的createContext, 主要为了onerror,cookie
   * @method Application#createContext
   * @param  {Req} req - node native Request object
   * @param  {Res} res - node native Response object
   * @return {Context} context object
   */
  createContext(req, res) {
    const app = this;
    const context = Object.create(app.context);
    const request = context.request = Object.create(app.request);
    const response = context.response = Object.create(app.response);
    context.app = request.app = response.app = app;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.onerror = context.onerror.bind(context);
    context.originalUrl = request.originalUrl = req.url;

    /**
     * Request start time
     * @member {Number} Context#starttime
     */
    context.starttime = Date.now();
    return context;
  }

  /**
   * Create an anonymous context, the context isn't request level, so the request is mocked.
   * then you can use context level API like `ctx.service`
   * @member {String} Application#createAnonymousContext
   * @param {Request} req - if you want to mock request like querystring, you can pass an object to this function.
   * @return {Context} context
   */
  createAnonymousContext(req) {
    const request = {
      headers: {
        'x-forwarded-for': '127.0.0.1',
      },
      query: {},
      querystring: '',
      host: '127.0.0.1',
      hostname: '127.0.0.1',
      protocol: 'http',
      secure: 'false',
      method: 'GET',
      url: '/',
      path: '/',
      socket: {
        remoteAddress: '127.0.0.1',
        remotePort: 7001,
      },
    };
    if (req) {
      for (const key in req) {
        if (key === 'headers' || key === 'query' || key === 'socket') {
          Object.assign(request[key], req[key]);
        } else {
          request[key] = req[key];
        }
      }
    }
    const response = new http.ServerResponse(request);
    return this.createContext(request, response);
  }

  /**
   * secret key for Application
   * @member {String} Application#keys
   */
  get keys() {
    if (!this[KEYS]) {
      if (!this.config.keys) {
        if (this.config.env === 'local' || this.config.env === 'unittest') {
          const configPath = path.join(this.config.baseDir, 'config/config.default.js');
          console.error('Cookie need secret key to sign and encrypt.');
          console.error('Please add `config.keys` in %s', configPath);
        }
        throw new Error('Please set config.keys first');
      }

      this[KEYS] = this.config.keys.split(',').map(s => s.trim());
    }
    return this[KEYS];
  }

  /**
   * reference to {@link Helper}
   * @member {Helper} Application#Helper
   */
  get Helper() {
    if (!this[HELPER]) {
      /**
       * The Helper class which can be used as utility function.
       * Files from `${baseDir}/app/helper` will be loaded to the prototype of Helper,
       * then you can use all method on `ctx.helper` that is a instance of Helper.
       */
      class Helper extends this.BaseContextClass {}
      this[HELPER] = Helper;
    }
    return this[HELPER];
  }

  /**
   * warn when confused configurations are present
   *
   * @private
   */
  [WARN_CONFUSED_CONFIG]() {
    const confusedConfigurations = this.config.confusedConfigurations;
    Object.keys(confusedConfigurations).forEach(key => {
      if (this.config[key]) {
        this.logger.warn('Unexpected config key `%s` exists, Please use `%s` instead.',
          key, confusedConfigurations[key]);
      }
    });
  }
}

module.exports = Application;
