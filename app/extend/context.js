'use strict';

module.exports = {
  success(data) {
    const { RESULT_CODE } = this.app;
    this.body = {
      ret: RESULT_CODE.SUCCESS,
      data,
      msg: ''
    };
  },

  error(code, msg) {
    const { RESULT_CODE } = this.app;
    this.body = {
      ret: code,
      data: null,
      msg: msg || RESULT_CODE[code]
    }
  },

  done(obj) {
    obj = obj || {}
    const { RESULT_CODE } = this.app;
    if (obj.code === RESULT_CODE.SUCCESS) {
      this.success(obj.data)
    } else {
      this.error(obj.code, obj.msg)
    }
  }
};
