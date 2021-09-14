/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-13 18:42:26
 * @LastEditTime: 2021-09-14 17:58:57
 * @LastEditors: @Xin (834529118@qq.com)
 */
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default ({ router, asyncRoutes, loginPath, systemName }) => {
  const open =  openLoginPage(loginPath)

  router.beforeEach((to, from, next) => {
    NProgress.start()

    next()
  })

  router.afterEach(() => {
    NProgress.done()
  })
}
