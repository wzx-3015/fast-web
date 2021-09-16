/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-15 17:09:40
 * @LastEditTime: 2021-09-16 10:54:41
 * @LastEditors: @Xin (834529118@qq.com)
 */
export const defaultRoutes = [
  {
    path: '/403',
    component: () => import('../Exception/403.vue'),
    name: '403',
  },
  {
    alias: ['/404'],
    path: '/:pathMatch(.*)*',
    component: () => import('../Exception/404.vue'),
    name: '404',
  },
]
