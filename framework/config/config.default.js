'use strict';

// const fs = require('fs');
const path = require('path');

/**
 * The configuration of egg application, can be access by `app.config`
 * @class Config
 * @since 1.0.0
 */

module.exports = appInfo => {

  const config = {

    /**
     * The environment of egg
     * @member {String} Config#env
     * @see {appInfo#env}
     * @since 1.0.0
     */
    env: appInfo.env,

    /**
     * The name of the application
     * @member {String} Config#name
     * @see {appInfo#name}
     * @since 1.0.0
     */
    name: appInfo.name,

    /**
     * The key that signing cookies. It can contain multiple keys seperated by `,`.
     * @member {String} Config#keys
     * @see https://eggjs.org/zh-cn/basics/controller.html#cookie-秘钥
     * @default
     * @since 1.0.0
     */
    keys: '',

    /**
     * Whether application deployed after a reverse proxy,
     * when true proxy header fields will be trusted
     * @member {Boolean} Config#proxy
     * @default
     * @since 1.0.0
     */
    proxy: false,

    /**
     * Detect request's protocol from specified headers, not case-sensitive.
     * Only worked when config.proxy set to true.
     * @member {String} Config#protocolHeaders
     * @default
     * @since 1.0.0
     */
    protocolHeaders: 'x-forwarded-proto',

    /**
     * Detect request' ip from specified headers, not case-sensitive.
     * Only worked when config.proxy set to true.
     * @member {String} Config#ipHeaders
     * @default
     * @since 1.0.0
     */
    ipHeaders: 'x-forwarded-for',

    /**
     * Detect request' host from specified headers, not case-sensitive.
     * Only worked when config.proxy set to true.
     * @member {String} Config#hostHeaders
     * @default
     * @since 1.0.0
     */
    hostHeaders: 'x-forwarded-host',

    /**
     * package.json
     * @member {Object} Config#pkg
     * @see {appInfo#pkg}
     * @since 1.0.0
     */
    pkg: appInfo.pkg,

    /**
     * The current directory of the application
     * @member {String} Config#baseDir
     * @see {appInfo#baseDir}
     * @since 1.0.0
     */
    baseDir: appInfo.baseDir,

    /**
     * The current HOME directory
     * @member {String} Config#HOME
     * @see {appInfo#HOME}
     * @since 1.0.0
     */
    HOME: appInfo.HOME,

    /**
     * configurations are confused to users
     * {
     *   [unexpectedKey]: [expectedKey],
     * }
     * @member Config#confusedConfigurations
     * @type {Object}
     */
    confusedConfigurations: {
      bodyparser: 'bodyParser',
      middlewares: 'middleware',
      httpClient: 'httpclient',
    },
  };

  /**
   * The option of `bodyParser` middleware
   *
   * @member Config#bodyParser
   * @property {Boolean} enable - enable bodyParser or not, default is true
   * @property {String | RegExp | Function | Array} ignore - won't parse request body when url path hit ignore pattern, can not set `ignore` when `match` presented
   * @property {String | RegExp | Function | Array} match - will parse request body only when url path hit match pattern
   * @property {String} encoding - body's encoding type，default is utf8
   * @property {String} formLimit - limit of the urlencoded body. If the body ends up being larger than this limit, a 413 error code is returned. Default is 100kb
   * @property {String} jsonLimit - limit of the json body, default is 100kb
   * @property {Boolean} strict - when set to true, JSON parser will only accept arrays and objects. Default is true
   * @property {Number} queryString.arrayLimit - urlencoded body array's max length, default is 100
   * @property {Number} queryString.depth - urlencoded body object's max depth, default is 5
   * @property {Number} queryString.parameterLimit - urlencoded body maximum parameters, default is 1000
   */
  config.bodyParser = {
    enable: true,
    encoding: 'utf8',
    formLimit: '100kb',
    jsonLimit: '100kb',
    strict: true,
    // @see https://github.com/hapijs/qs/blob/master/lib/parse.js#L8 for more options
    queryString: {
      arrayLimit: 100,
      depth: 5,
      parameterLimit: 1000,
    },
  };

  /**
   * logger options
   * @member Config#logger
   * @property {String} dir - directory of log files
   * @property {String} encoding - log file encloding, defaults to utf8
   * @property {String} level - default log level, could be: DEBUG, INFO, WARN, ERROR or NONE, defaults to INFO in production
   * @property {String} consoleLevel - log level of stdout, defaults to INFO in local serverEnv, defaults to WARN in unittest, defaults to NONE elsewise
   * @property {Boolean} disableConsoleAfterReady - disable logger console after app ready. defaults to `false` on local and unittest env, others is `true`.
   * @property {Boolean} outputJSON - log as JSON or not, defaults to false
   * @property {Boolean} buffer - if enabled, flush logs to disk at a certain frequency to improve performance, defaults to true
   * @property {String} errorLogName - file name of errorLogger
   * @property {String} coreLogName - file name of coreLogger
   * @property {String} agentLogName - file name of agent worker log
   * @property {Object} coreLogger - custom config of coreLogger
   */
  config.logger = {
    dir: path.join(appInfo.root, 'logs', appInfo.name),
    encoding: 'utf8',
    env: appInfo.env,
    level: 'INFO',
    consoleLevel: 'INFO',
    disableConsoleAfterReady: appInfo.env !== 'local' && appInfo.env !== 'unittest',
    outputJSON: false,
    buffer: true,
    appLogName: `${appInfo.name}-web.log`,
    coreLogName: 'egg-web.log',
    agentLogName: 'egg-agent.log',
    errorLogName: 'common-error.log',
    coreLogger: {},
    allowDebugAtProd: true,
  };

  /**
   * The option for httpclient
   * @member Config#httpclient
   * @property {Boolean} enableDNSCache - Enable DNS lookup from local cache or not, default is false.
   *
   * @property {Number} request.timeout - httpclient request default timeout, default is 5000 ms.
   *
   * @property {Boolean} httpAgent.keepAlive - Enable http agent keepalive or not, default is true
   * @property {Number} httpAgent.freeSocketKeepAliveTimeout - http agent socket keepalive max free time, default is 4000 ms.
   * @property {Number} httpAgent.maxSockets - http agent max socket number of one host, default is `Number.MAX_SAFE_INTEGER` @ses https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
   * @property {Number} httpAgent.maxFreeSockets - http agent max free socket number of one host, default is 256.
   *
   * @property {Boolean} httpsAgent.keepAlive - Enable https agent keepalive or not, default is true
   * @property {Number} httpsAgent.freeSocketKeepAliveTimeout - httpss agent socket keepalive max free time, default is 4000 ms.
   * @property {Number} httpsAgent.maxSockets - https agent max socket number of one host, default is `Number.MAX_SAFE_INTEGER` @ses https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
   * @property {Number} httpsAgent.maxFreeSockets - https agent max free socket number of one host, default is 256.
   */
  config.httpclient = {
    enableDNSCache: false,
    dnsCacheMaxLength: 1000,
    dnsCacheMaxAge: 10000,

    request: {
      timeout: 5000,
    },
    httpAgent: {
      keepAlive: true,
      freeSocketKeepAliveTimeout: 4000,
      maxSockets: Number.MAX_SAFE_INTEGER,
      maxFreeSockets: 256,
    },
    httpsAgent: {
      keepAlive: true,
      freeSocketKeepAliveTimeout: 4000,
      maxSockets: Number.MAX_SAFE_INTEGER,
      maxFreeSockets: 256,
    },
  };

  /**
   * The option of `meta` middleware
   *
   * @member Config#meta
   * @property {Boolean} enable - enable meta or not, default is true
   * @property {Boolean} logging - enable logging start request, default is false
   */
  config.meta = {
    enable: true,
    logging: false,
  };

  /**
   * core enable middlewares
   * @member {Array} Config#middleware
   */
  config.coreMiddleware = [
    'meta',
    'bodyParser',
  ];

  /**
   * emit `startTimeout` if worker don't ready after `workerStartTimeout` ms
   * @member {Number} Config.workerStartTimeout
   */
  config.workerStartTimeout = 10 * 60 * 1000;

  return config;
};