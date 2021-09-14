/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-03 11:00:24
 * @LastEditTime: 2021-09-14 18:35:33
 * @LastEditors: @Xin (834529118@qq.com)
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { dfsjAuthPermission } from '../packages/index.js'
import store from './store'
import asyncRoutes from './router/asyncRoutes'

const app = createApp(App)

app.use(router).use(store).use(dfsjAuthPermission, {
  loginAuth: true,
  asyncRoutes,
  loginPath: 'http://192.168.10.148:9081/#/login'
}).mount('#app')

