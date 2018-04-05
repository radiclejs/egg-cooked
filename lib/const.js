// 转换请求参数
exports.BOOL_TRANSFER = {
  'true': true,
  'false': false
}

exports.RESULT_CODE = {
    /* 成功状态码 */
    SUCCESS: {
      code: 1,
      msg: '成功'
    },

    /* 参数错误：10001-19999 */
    PARAM_IS_INVALID: {
      code: 10001,
      msg: '参数无效'
    },

    PARAM_IS_BLANK: {
      code: 10002,
      msg: '参数为空'
    },

    PARAM_TYPE_BIND_ERROR: {
      code: 10003,
      msg: '参数类型错误'
    },
  
    PARAM_NOT_COMPLETE: {
      code: 10004,
      msg: '参数缺失'
    },

    /* 用户错误：20001-29999*/
    USER_NOT_LOGGED_IN: {
      code: 20001,
      msg: '用户未登录'
    },

    USER_LOGIN_ERROR: {
      code: 20002,
      msg: '账号不存在或密码错误'
    },

    USER_ACCOUNT_FORBIDDEN: {
      code: 20003,
      msg: '账号已被禁用'
    },

    USER_NOT_EXIST: {
      code: 20004,
      msg: '用户不存在'
    },

    USER_HAS_EXISTED: {
      code: 20005,
      msg: '用户已存在'
    },

    /* 业务错误：30001-39999 */

    /* 系统错误：40001-49999 */
    SYSTEM_INNER_ERROR: {
      code: 40001,
      msg: '系统繁忙，请稍后重试'
    },

    /* 数据错误：50001-599999 */
    RESULE_DATA_NONE: {
      code: 50001,
      msg: '数据未找到'
    },

    DATA_IS_WRONG: {
      code: 50002,
      msg: '数据有误'
    },

    DATA_ALREADY_EXISTED: {
      code: 50003,
      msg: '数据已存在'
    },

    /* 接口错误：60001-69999 */
    INTERFACE_INNER_INVOKE_ERROR: {
      code: 60001,
      msg: '内部系统接口调用异常'
    },
    INTERFACE_OUTTER_INVOKE_ERROR: {
      code: 60002,
      msg: '外部系统接口调用异常'
    },

    INTERFACE_FORBID_VISIT: {
      code: 60003,
      msg: '该接口禁止访问'
    },

    INTERFACE_ADDRESS_INVALID: {
      code: 60004,
      msg: '接口地址无效'
    },

    INTERFACE_REQUEST_TIMEOUT: {
      code: 60005,
      msg: '接口请求超时'
    },

    INTERFACE_EXCEED_LOAD: {
      code: 60006,
      msg: '接口负载过高'
    },

    /* 权限错误：70001-79999 */
    PERMISSION_NO_ACCESS: {
      code: 70001,
      msg: '无访问权限'
    }
}
