/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-11 14:36:02
 * @LastEditTime: 2021-09-15 18:45:35
 * @LastEditors: @Xin (834529118@qq.com)
 */
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { addRoutes, flatAsyncRoute, handleModules, handleMenu, mergeRoutes, localStorageGetLoginToken } from './utils/index'
import { createDuserStore } from './userStore/index'
import { isArray } from 'lodash-es'
import { defaultRoute } from './router/index'
import { login, getUserInfo } from './service/index'

export const dfsjAuthPermission = (app, {
  loginAuth = true,
  asyncRoutes = [],
  loginPath = '',
  systemName = ''
}) => {
  console.log(`[dfsj-auth-module]:「接入权限管理系统」`)

  if (loginAuth && !loginPath) {
    throw Error('[dfsj-auth-module]：「已开启权限校验，请设置登录跳转地址！」')
  }

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

  router.beforeEach((to, from, next) => {
    NProgress.start()

    // 开发模式开放所有路由
    if (!loginAuth) {
      NProgress.done()

      if (asyncRoutes.length) {
        const menus = handleMenu(addRoutes)

        DuserStore.setUserState({
          menus,
          flatMenus: flatAsyncRoute(menus),
        })

        addRoutes(router, asyncRoutes).then(() => {
          next({ path: to.path, query: { ...rest }, params: to.params, replace: true })
        })
      } else {
        next()
      }

      return true
    }

    // 访问权限模块
    if (asynLogincRoutesPath.includes(to.path)) {
      // login 不存在代表未登录或者刷新
      if (!store.state.user.login) {
        // ak参数存在  处理登录逻辑
        if (to.query.ak) {
          const { ak, ...rest } = to.query

          login({ ak }, loginPath, systemName).then(() => {
            getUserInfo(loginPath, systemName).then(res => {
              const { modules } = res.data
              const addRoutes = mergeRoutes(handleModules(modules), flatAsyncRoute(asyncRoutes))

              // 生成导航栏信息(处理导航栏信息)
              const menus = handleMenu(addRoutes)

              DuserStore.setUserState({
                login: true,
                ...res.data,
                addRoutes,
                menus,
                flatMenus: flatAsyncRoute(menus),
              })

              addRoutes(router, store.state.user.addRoutes).then(() => {
                NProgress.done()
                next({ path: to.path, query: { ...rest }, params: to.params, replace: true })
              })
            })
          })
        } else {
          // TOKEN 不存在代表为第一次登录
          if (!localStorageGetLoginToken()) {
            next({ name: '403' })
          } else {
            getUserInfo(loginPath, systemName).then(res => {
              const { modules } = res.data
              const addRoutes = mergeRoutes(handleModules(modules), flatAsyncRoute(asyncRoutes))

              // 生成导航栏信息(处理导航栏信息)
              const menus = handleMenu(addRoutes)

              DuserStore.setUserState({
                login: true,
                ...res.data,
                addRoutes,
                menus,
                flatMenus: flatAsyncRoute(menus),
              })

              NProgress.done()
              addRoutes(router, store.state.user.addRoutes).then(() => {
                next({ path: to.path, query: { ...rest }, params: to.params, replace: true })
              })
            })
          }
        }
      } else {
        NProgress.done()
        if (to.params.pathMatch && !router.hasRoute(to.params.pathMatch[0])) {
          next({ name: '403', query: { voidStatus: 1 }, replace: true })
          return true
        }
        next()
      }
    } else {
      next()
    }
  })

  router.afterEach(() => {
    NProgress.done()
  })
}
