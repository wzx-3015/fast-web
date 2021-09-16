/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-11 16:06:23
 * @LastEditTime: 2021-09-16 10:31:51
 * @LastEditors: @Xin (834529118@qq.com)
 */
const asyncRoutes = [
  {
    name: 'demo01',
    path: '/demo01',
    component: () => import('../views/demo1.vue')
  }
]

export default asyncRoutes
