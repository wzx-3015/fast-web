/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-13 18:42:26
 * @LastEditTime: 2021-09-15 18:43:48
 * @LastEditors: @Xin (834529118@qq.com)
 */
import { createDuserStore } from './userStore/index'

export const dfsjAuthSelfPermission = (app, {
  loginAuth = true,
  asyncRoutes = [],
}) => {
  if (asyncRoutes && !isArray(asyncRoutes)) {
    throw Error('[dfsj-auth-module]：「asyncRoutes is not Array」')
  }

  const DuserStore = createDuserStore()

  app.use(DuserStore)

  const router = app.config.globalProperties.$router

  const asynLogincRoutesPath = Array.from(
    new Set(
      flatAsyncRoute(asyncRoutes)
        .map(v => v.path)
        .filter(v => v)
    )
  )

  addRoutes(router, defaultRoute)
}
