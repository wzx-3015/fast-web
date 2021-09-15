/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-15 10:07:26
 * @LastEditTime: 2021-09-15 10:34:29
 * @LastEditors: @Xin (834529118@qq.com)
 */
import { reactive } from 'vue'
import { injectKey } from './injectKey'

class DuserStore {
  constructor () {
    this.userState = reactive({
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
    })
  }

  install (app) {
    app.provide(injectKey, this)
    app.config.globalProperties.$DusetStore = this
  }

  setUserState (userState) {
    if (Object.prototype.toString.call(userState) !== '[object Object]') {
      console.error(`[dfsj/userStore] Cannot convert undefined or null to object`)

      return
    }

    Object.keys(userState).forEach(k => {
      if (this.userState.hasOwnProperty(k)) {
        this.userState[k] = userState[k]
      }
    })
  }
}

export function createDuserStore () {
  return new DuserStore()
}
