/*
 * @Description: 自定一请求的封装处理(全局异常的处理以及登录权限的处理)未完成
 * 默认无法进行一个请求的重复发送(可通过请求参数allowedRepeat 进行单独配置)
 * 默认全局处理异常告警(可通过请求参数handlerErr 进行单独配置)
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-04-20 09:14:52
 * @LastEditTime: 2021-09-15 11:13:17
 * @LastEditors: @Xin (834529118@qq.com)
 */
import Axios from 'axios'
import { ElMessage } from 'element-plus'
import { handleRequestTokenElMessageBoxConfirm } from './index'
import { ref } from 'vue'
                       
// 全局告警提示弹窗停留时间
const ElMessage_duration = 1500

// 等待中的请求
let requestPending = new Map()
const CancelToken = Axios.CancelToken

/**
 * 创建Axios实例,统一配置
 */
export const instance = Axios.create({
  baseURL: VUE_APP_REQUEST_API,
  timeout: 3000,
  // 自定义请求头
  headers: {
    common: {
      'ProductInfo-NAME': '',
      'ProductInfo-VERSION': VUE_APP_VERSION,
    },
  },
})

/**
 * @description:  请求参数进行编码
 * @param {Object} config
 * @return {String}
 */
const getRequestIdentify = config => {
  const { method, url, data, params } = config
  // data存在时编码url + method + data数据
  if (data) {
    /**
     * 解决响应拦截时data为String请求拦截时为Object
     * 引发的无法在requestPending 栈信息中查找对应的值key值
     */
    return typeof data === 'object' ? encodeURIComponent(`${url}${method}${JSON.stringify(data)}`) : encodeURIComponent(`${url}${method}${data}`)
  }
  // params存在时编码url + method + params数据
  if (params) {
    return encodeURIComponent(`${url}${method}${JSON.stringify(params)}`)
  }

  // 默认编码url和method
  return encodeURIComponent(`${url}${method}`)
}

/**
 * @description:   移除requestPending栈中的请求信息
 * @param {Object} config
 * @return {*}
 */
const removeRequestPending = config => {
  const requestData = getRequestIdentify(config)
  if (requestPending.has(requestData)) {
    return requestPending.delete(requestData)
  }
  return false
}

/**
 * @description:   请求拦截器
 * @param {*}
 * @return {*}
 */
instance.interceptors.request.use(config => {
  const requestData = getRequestIdentify(config)

  /**
   * allowedRepeat 属性存在时
   * 可以一个请求重复的发送(需要每个请求都添加该参数)
   * ===================TWO==============================
   * 或者每个请求增加一个动态的time时间参数也可以进行请求的重复发送
   */
  if (!config.allowedRepeat) {
    // 如果存在则移除该次请求并进行告警
    if (requestPending.has(requestData)) {
      config.cancelToken = new CancelToken(c => {
        c('禁止频繁操作!')
      })
    } else {
      config.cancelToken = new CancelToken(c => {
        requestPending.set(requestData, c)
      })
    }

    // 删除无用参数
    delete config.allowedRepeat
  }

  return config
})

/**
 * @description:  响应拦截器(进行全局异常的处理以及登录权限的校验)
 * @param {*}
 * @return {*}
 */
instance.interceptors.response.use(
  response => {
    const { config, data: res } = response

    /**
     * handlerErr 此参数存在时
     * 不进行此次请求的异常告警处理
     */
    const { handlerErr } = config

    // 请求完成移除 requestPending 栈信息
    removeRequestPending(config)

    if (res.code !== 200) {
      // 未登录and掉线状态
      if (res.code === 401) {
        handleRequestTokenElMessageBoxConfirm('请重新登录', '登录状态已过期')
      } else {
        !handlerErr &&
          ElMessage({
            message: res.message || 'Error',
            type: 'error',
            duration: ElMessage_duration,
          })
      }

      return Promise.reject(res)
    }

    return res
  },
  error => {
    const { config, message, handlerErr } = error

    // 异常 移除 requestPending 栈信息
    config && removeRequestPending(config)

    !handlerErr &&
      ElMessage({
        message: message,
        type: 'error',
        duration: ElMessage_duration,
      })

    return Promise.reject(error)
  }
)
/**
 * @description:      自定义get请求简化使用方式
 * @param {String} url     请求地址
 * @param {Object} params  URLSearchParams对象
 * @param {Object} config  其他配置项
 * @return {Promise} Promise
 */
export const get = (url, params, config) =>
  instance.get(url, {
    params,
    ...config,
  })

/**
 * @description: 请求函数封装处理（增加loading）
 * @param {Function} 请求函数
 * @return {*}
 */
export const useRequest = RequestFn => {
  const loading = ref(false)

  const run = (...rest) => {
    try {
      loading.value = true
      return RequestFn(...rest).finally(() => (loading.value = false))
    } catch (error) {
      loading.value = false
      return Promise.reject(error)
    }
  }

  return [loading, run]
}

// 导出对应的POST  PUT  DELETE 请求快捷方式
export const post = instance.post
export const put = instance.put
export const del = instance.delete

// 默认导出request请求
export default instance.request

export default axios
