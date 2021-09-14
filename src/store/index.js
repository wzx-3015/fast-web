/*
 * @Description: Store 入口文件
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-04-19 10:05:00
 * @LastEditTime: 2021-09-11 15:09:26
 * @LastEditors: @Xin (834529118@qq.com)
 */
import { createStore } from 'vuex'

// const modulesFiles = require.context('./modules', true, /\.js$/)

// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   // 获取文件名称 ./app.js => app
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')

//   // 获取文件内容
//   const value = modulesFiles(modulePath)

//   modules[moduleName] = value.default || {}

//   return modules
// }, {})

export default createStore({
  getters: {
    /**
     * @description:   获取指定name的导航数据
     * @param {String} name  路由Name属性
     * @return {Array}
     */
    getChildrenMenus: state => name => {
      const menu = state.user.flatMenus.find(v => v.name === name)
      return menu ? menu.children || [] : []
    },
    /**
     * @description: 获取导航菜单
     * @param {*}
     * @return {*}
     */
    getMenus: state => {
      return state.user.menus
    },
    getTodoById: () => () => {
      return ''
    },
  },
  modules: {},
})
