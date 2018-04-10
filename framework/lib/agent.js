'use strict';

const path = require('path');
const EggApplication = require('./egg');
const AgentWorkerLoader = require('./loader').AgentWorkerLoader;

const EGG_LOADER = Symbol.for('egg#loader');
const EGG_PATH = Symbol.for('egg#eggPath');

/**
 * Singleton instance in Agent Worker, extend {@link EggApplication}
 * @extends EggApplication
 */
class Agent extends EggApplication {
  /**
   * @constructor
   * @param {Object} options - see {@link EggApplication}
   */
  constructor(options = {}) {
    options.type = 'agent';

    super(options);

    if (process.env.EGG_SERVER_ENV === 'local') {
      global.agent = this;
    }

    this.loader.load();

    // keep agent alive even it don't have any io tasks
    setInterval(() => {}, 24 * 60 * 60 * 1000);

    this._uncaughtExceptionHandler = this._uncaughtExceptionHandler.bind(this);
    process.on('uncaughtException', this._uncaughtExceptionHandler);
  }

  _uncaughtExceptionHandler(err) {
    if (!(err instanceof Error)) {
      err = new Error(String(err));
    }
    /* istanbul ignore else */
    if (err.name === 'Error') {
      err.name = 'unhandledExceptionError';
    }
    this.coreLogger.error(err);
  }

  get [EGG_LOADER]() {
    return AgentWorkerLoader;
  }

  get [EGG_PATH]() {
    return path.join(__dirname, '..');
  }

  close() {
    process.removeListener('uncaughtException', this._uncaughtExceptionHandler);
    return super.close();
  }

}

module.exports = Agent;
