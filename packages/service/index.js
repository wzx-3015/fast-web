/*
 * @Description: 登录、注销、退出等全局请求
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-05-06 11:04:15
 * @LastEditTime: 2021-09-15 18:41:58
 * @LastEditors: @Xin (834529118@qq.com)
 */
import axios from 'axios'
import {
  handleRequestTokenElMessageBoxConfirm,
  localStorageSetLoginToken,
  localStorageReomveLoginToken,
} from '../utils/index'

import { ElMessage } from 'element-plus'

/**
 * @description:   登录接口
 * @param {Object} params
 * @param {String} params.ak
 * @return {Promise}
 */
export const login = (params, loginPath, systemName) => {
  return axios.get('/api/default/login', {
    params
  }).then(response => {
    const { data: res } = response

    if (res.data === 200) {
      localStorageSetLoginToken(res.data.value)
      return res
    } else {
      return Promise.reject(res)
    }
  }).catch(err => {
    handleRequestTokenElMessageBoxConfirm({
      message: err.message || '请尝试重新登录！',
      loginPath,
      systemName,
      url: window.location.href.replace(/\?ak=(\S*)/, ''),
    })
  })
}

/**
 * @description:  获取用户信息
 * @param {null}
 * @return {Promise}
 */
export const getUserInfo = (loginPath, systemName) => {
  return axios.get('/api/default/user-info').then(response => {
    const { data: res } = response
    if (res.code === 200) {
      return res
    } else {
      return Promise.reject(res)
    }
  }).catch(err => {
    localStorageReomveLoginToken()

    handleRequestTokenElMessageBoxConfirm({
      message: err.message,
      loginPath,
      url: window.location.href.replace(/\?ak=(\S*)/, ''),
      systemName,
    })
  })
}

/**
 * @description: 登出(退出)
 * @param {null}
 * @return {Promise}
 */
export const logout = () => {
  return axios.post('/api/default/logout').then(response => {
    const { data: res } = response

    if (res.code === 200) {
      localStorageReomveLoginToken()
      openLoginPage(window.location.href)
      return res
    } else {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 1500,
      })
      return Promise.reject(res)
    }

  })
}
