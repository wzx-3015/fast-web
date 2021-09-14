/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-11 16:05:46
 * @LastEditTime: 2021-09-14 18:16:28
 * @LastEditors: @Xin (834529118@qq.com)
 */
// 静态配置路由默认已加载(且不需要登录即可访问)
export const constRoutes = [
  {
    path: '/',
    redirect: '/demo',
  },
  {
    path: '/demo',
    component: import('../views/index.vue'),
    name: 'Demo',
  },
]

export default constRoutes;
