/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-07 13:51:23
 * @LastEditTime: 2021-09-11 09:59:22
 * @LastEditors: @Xin (834529118@qq.com)
 */
import Axios from 'axios'
// 等待中的请求
let requestPending = new Map()
const CancelToken = Axios.CancelToken

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
 * @description:  处理拦截重复的请求
 * @param {*}
 * @return {*}
 */
const handleRepeatRequest = config => {
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
}

export default function request (config) {
  const defaultConfig = {
    baseURL: '/',
    timeout: 3000,
    headers: {}
  }

  Object.assign(defaultConfig, config)

  const instance = Axios.create({
    baseURL: defaultConfig.baseURL,
    timeout: defaultConfig.timeout,
    // 自定义请求头
    headers: defaultConfig.headers,
  })

  /**
   * @description:   请求拦截器
   * @param {*}
   * @return {*}
   */
  instance.interceptors.request.use(handleRepeatRequest)

  /**
   * @description:  响应拦截器(进行全局异常的处理以及登录权限的校验)
   * @param {*}
   * @return {*}
   */
instance.interceptors.response.use(
    response => {
      console.log('======interceptors', response)
      // 请求完成移除 requestPending 栈信息
      removeRequestPending(config)
      if (response.data === 200) {
        return response.data
      }

      return Promise.reject(new Error(JSON.stringify(response.data)))
    },
    error => {
      const { config } = error

      console.log('interceptorscatch', error)

      // 异常 移除 requestPending 栈信息
      config && removeRequestPending(config)

      return Promise.reject(error)
    }
  )

  return instance
}

