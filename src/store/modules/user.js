/*
 * @Description: 用户信息存储模块
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-05-06 11:02:11
 * @LastEditTime: 2021-05-25 18:09:11
 * @LastEditors: @Xin (834529118@qq.com)
 */
import { login, getUserInfo, logout } from '@/service/index'
import { asyncRoutes } from '@/router/index'
import { markRaw } from '@vue/reactivity'
import {
  openLoginPage,
  handleModules,
  flatAsyncRoute,
  mergeRoutes,
  handleMenu,
  localStorageSetLoginToken,
  localStorageReomveLoginToken,
} from '@/utils/index'

const getState = () => {
  return {
    login: false,
    username: '', // 登录名
    realname: '', // 用户名(姓名)
    roles: [], // 角色信息
    modules: [], // 路由信息模块
    id: null,
    mobile: '', // 手机号
    gender: '', // 性别
    resources: [], // 资源
    addRoutes: [], // 路由信息
    menus: [], // 导航栏信息
    flatMenus: [], // 扁平化的导航栏信息(方便数据处理)
  }
}

const mutations = {
  // 修改登录状态
  SET_LOGIN(state, login) {
    state.login = login
  },
  // 修改路由信息
  SET_ROUTES(state, routes) {
    state.addRoutes = routes
  },
  // 修改导航栏信息
  SET_MENUS(state, menus) {
    state.menus = menus
  },
  // 修改flatMenus数据
  SET_FLATMENUS(state, menus) {
    state.flatMenus = menus
  },
  // 修改用户信息
  SET_USER_INFO(state, userInfo) {
    const exclude = ['login', 'addRoutes', 'menus']
    Object.keys(state).forEach(k => {
      if (!exclude.includes(k)) {
        state[k] = userInfo[k]
      }
    })
  },
  // 清除用户信息
  CLEAR_USER_INFO(state) {
    const data = getState()
    Object.keys(state).forEach(k => (state[k] = data[k]))
  },
}

const actions = {
  // 登录
  Login(context, params) {
    return login(params).then(res => {
      localStorageSetLoginToken(res.data.value)
      return res
    })
  },
  // 获取用户信息
  GetUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      return getUserInfo()
        .then(res => {
          const { modules } = res.data

          // 路由的合并(处理路由格式)
          const addRoutes = mergeRoutes(handleModules(modules), flatAsyncRoute(asyncRoutes))

          // 生成导航栏信息(处理导航栏信息)
          const menus = handleMenu(addRoutes)

          commit('SET_LOGIN', true)
          commit('SET_USER_INFO', res.data)
          commit('SET_ROUTES', markRaw(addRoutes))
          commit('SET_MENUS', menus)

          commit('SET_FLATMENUS', flatAsyncRoute(menus))

          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 退出登录
  Logout({ commit }) {
    return logout().then(() => {
      commit('CLEAR_USER_INFO')
      localStorageReomveLoginToken()
      openLoginPage(window.location.href)
    })
  },
}

export default {
  namespaced: true,
  state: getState,
  mutations,
  actions,
}
