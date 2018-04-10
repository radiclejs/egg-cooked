'use strict';

const accepts = require('accepts');

const PROTOCOL = Symbol('PROTOCOL');
const HOST = Symbol('HOST');
const ACCEPTS = Symbol('ACCEPTS');
const IPS = Symbol('IPS');

// 注意这里覆写/新增了koa上的方法和属性, 在context有把这些方法和属性代理到context上去
module.exports = {
  /**
   * Parse the "Host" header field host
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   * @member {String} Request#host
   * @example
   * ip + port
   * ```js
   * this.request.host
   * => '127.0.0.1:7001'
   * ```
   * or domain
   * ```js
   * this.request.host
   * => 'demo.eggjs.org'
   * ```
   */
  get host() {
    if (this[HOST]) return this[HOST];

    let host;
    if (this.app.config.proxy) {
      host = getFromHeaders(this, this.app.config.hostHeaders);
    }
    host = host || this.get('host') || '';
    this[HOST] = host.split(/\s*,\s*/)[0];
    return this[HOST];
  },

  /**
   * @member {String} Request#protocol
   * @example
   * ```js
   * this.request.protocol
   * => 'https'
   * ```
   */
  get protocol() {
    if (this[PROTOCOL]) return this[PROTOCOL];
    // detect encrypted socket
    if (this.socket && this.socket.encrypted) {
      this[PROTOCOL] = 'https';
      return this[PROTOCOL];
    }
    // get from headers specified in `app.config.protocolHeaders`
    if (this.app.config.proxy) {
      const proto = getFromHeaders(this, this.app.config.protocolHeaders);
      if (proto) {
        this[PROTOCOL] = proto.split(/\s*,\s*/)[0];
        return this[PROTOCOL];
      }
    }
    // use protocol specified in `app.conig.protocol`
    this[PROTOCOL] = this.app.config.protocol || 'http';
    return this[PROTOCOL];
  },

  /**
   * Get all pass through ip addresses from the request.
   * Enable only on `app.config.proxy = true`
   *
   * @member {Array} Request#ips
   * @example
   * ```js
   * this.request.ips
   * => ['100.23.1.2', '201.10.10.2']
   * ```
   */
  get ips() {
    if (this[IPS]) return this[IPS];

    // return empty array when proxy=false
    if (!this.app.config.proxy) {
      this[IPS] = [];
      return this[IPS];
    }

    const val = getFromHeaders(this, this.app.config.ipHeaders) || '';
    this[IPS] = val ? val.split(/\s*,\s*/) : [];
    return this[IPS];
  },

  /**
   * Request remote IPv4 address
   * @member {String} Request#ip
   * @example
   * ```js
   * this.request.ip
   * => '127.0.0.1'
   * => '111.10.2.1'
   * ```
   */
  get ip() {
    if (this._ip) {
      return this._ip;
    }
    const ip = this.ips[0] || this.socket.remoteAddress;
    // will be '::ffff:x.x.x.x', should conver to standard IPv4 format
    // https://zh.wikipedia.org/wiki/IPv6
    this._ip = ip && ip.indexOf('::ffff:') > -1 ? ip.substring(7) : ip;
    return this._ip;
  },

  /**
   * Set the remote address
   * @param {String} ip - IPv4 address
   */
  set ip(ip) {
    this._ip = ip;
  },

  get accept() {
    let accept = this[ACCEPTS];
    if (accept) {
      return accept;
    }
    accept = this[ACCEPTS] = accepts(this.req);
    return accept;
  },
};

function getFromHeaders(ctx, names) {
  if (!names) return '';
  names = names.split(/\s*,\s*/);
  for (const name of names) {
    const value = ctx.get(name);
    if (value) return value;
  }
  return '';
}
