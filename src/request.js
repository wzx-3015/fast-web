/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-07 14:12:49
 * @LastEditTime: 2021-09-11 09:55:39
 * @LastEditors: @Xin (834529118@qq.com)
 */
import axiosRequest from './request/index'
import { ref } from 'vue'

const useState = initValue => {
  const state = ref(initValue)
  const setState = value => {
    state.value = value
    return value
  }

  return [state, setState]
}

const instance = axiosRequest({
  baseURL: '/rest'
})

// instance.interceptors.response.use(response => {
//   const res = response.data

//   return res
// }, err => {
//   console.dir(err)
// })


const request = config => {
  return instance.request(config)
  return new Promise(async (resolve, reject) => {
    const res = await instance.request(config)
    if (res.data.code === 200) {
      reject(res)
    }

    console.log('==================================================')

    resolve(res)
  })
  // return new Promise((resolve, reject) => {
  //   instance.request(config).then(res => {
  //     if (res.data.code !== 200) {
  //       return Promise.reject(new Error(res))
  //     }
  //     resolve(res)
  //   }).catch(err => {
  //     return reject(err)
  //   })
  // })
}

export const get = (url, params, config) => {
  const getConfig = {
    url,
    method: 'get',
    params,
    ...config
  }

  return request(getConfig)
}
