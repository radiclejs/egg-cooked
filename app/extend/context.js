'use strict';

module.exports = {
  success(data) {
    const { RESULT_CODE } = this.app;
    this.body = {
      ret: RESULT_CODE.SUCCESS.code,
      data,
      msg: ''
    };
  },

  error(key, msg) {
    const { RESULT_CODE } = this.app;
    this.body = {
      ret: RESULT_CODE[key].code,
      data: null,
      msg: msg || RESULT_CODE[key].msg
    }
  },

  done(obj) {
    obj = obj || {}

    if (!obj.code && !obj.msg) {
      return this.success(obj)
    }

    if (obj.key === 'SUCCESS') {
      this.success(obj.data)
    } else {
      this.error(obj.key, obj.msg)
    }
  }
};
