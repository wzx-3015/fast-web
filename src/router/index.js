/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-11 14:40:40
 * @LastEditTime: 2021-09-14 18:26:07
 * @LastEditors: @Xin (834529118@qq.com)
 */
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

import constRoutes from './constRoutes'

const router = createRouter({
  history: createWebHashHistory('/'),
  routes: constRoutes,
})

export default router
