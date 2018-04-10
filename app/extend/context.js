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
    const { RESULT_CODE } = this.app;
    if (obj.key === 'SUCCESS') {
      this.success(obj.data)
    } else {
      this.error(obj.key, obj.msg)
    }
  }
};
