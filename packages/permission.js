/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-11 14:36:02
 * @LastEditTime: 2021-09-16 10:58:31
 * @LastEditors: @Xin (834529118@qq.com)
 */
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { addRoutes, flatAsyncRoute, handleModules, handleMenu, mergeRoutes, localStorageGetLoginToken } from './utils/index'
import { createDuserStore } from './userStore/index'
import { isArray } from 'lodash-es'
import { defaultRoutes } from './router/index'
import { login, getUserInfo } from './service/index'

/**
 * @description:  重定向路由（解决动态添加路由第一次不生效）
 * @param {*}
 * @return {*}
 */
const routeReplace = (routes, to, path = null) => {
  if (path) {
    return { path }
  }

  const findRoute = routes.find(route => route.path === to.path)

  const { query: { ak, ...rest }, params } = to

  // 如果动态路由中存在次路径 && vue-router 没有匹配到则进行刷新
  if (findRoute && !to.matched.length) {
    return { path: to.fullPath, replace: true, query: { ...rest }, params: params }
  } else if (!to.name) {
    // to.name 不存在应指向404
    return { path: '/404', replace: true }
  }

  return true
}

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

  router.beforeEach(async to => {
    NProgress.start()

    const { ak } = to.query
    
    // 开发模式开放所有路由
    if (!loginAuth) {
      const routes = [].concat(asyncRoutes, defaultRoutes)

      let menus = []
      try {
        menus = handleMenu(asyncRoutes)
      } catch (error) {
        console.error(error)
      }

      DuserStore.setUserState({
        menus,
        flatMenus: flatAsyncRoute(menus),
      })

      await addRoutes(router, routes)

      NProgress.done()

      return routeReplace(routes, to)
    }

    /**
     * @desription:  处理后端module数据
     * @param {*} modules
     * @return {*}
     */    
    const handleRequestModule = async modules => {
      const addRoutes = mergeRoutes(handleModules(modules), flatAsyncRoute(asyncRoutes))

      const menus = handleMenu(addRoutes)

      DuserStore.setUserState({
        login: true,
        ...res.data,
        addRoutes,
        menus,
        flatMenus: flatAsyncRoute(menus),
      })

      const addroutesArray = [].concat(addRoutes, defaultRoutes)

      await addRoutes(router, addroutesArray)

      NProgress.done()

      return routeReplace(addroutesArray, to)
    }

    // 访问权限模块
    if (asynLogincRoutesPath.includes(to.path)) {
      // login 不存在代表未登录或者刷新
      if (!DuserStore.userState.login) {
        // ak参数存在  处理登录逻辑
        if (ak) {
          await login({ ak }, loginPath, systemName)

          const res = await getUserInfo(loginPath, systemName)
          
          const { modules } = res.data

          return handleRequestModule(modules)
        } else {
          await addRoutes(router, defaultRoutes)

          NProgress.done()
          // TOKEN 不存在代表为第一次登录
          if (!localStorageGetLoginToken()) {
            await addRoutes(router, defaultRoutes)

            return routeReplace(defaultRoutes, to, '/403')
          } else {
            const res = await getUserInfo(loginPath, systemName)
            
            const { modules } = res.data

            return handleRequestModule(modules)
          }
        }
      } else {
        NProgress.done()

        if (to.params.pathMatch && !router.hasRoute(to.params.pathMatch[0])) {
          return { name: '403', query: { voidStatus: 1 }, replace: true }
        }

        return true
      }
    } else {
      NProgress.done()
      return true
    }
  })

  router.afterEach(() => {
    NProgress.done()
  })
}
