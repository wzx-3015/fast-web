/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-09-11 15:13:05
 * @LastEditTime: 2021-09-16 10:34:36
 * @LastEditors: @Xin (834529118@qq.com)
 */
/*
 * @Description: 请输入当前文件描述
 * @Author: @Xin (834529118@qq.com)
 * @Date: 2021-05-10 10:42:46
 * @LastEditTime: 2021-06-04 14:58:14
 * @LastEditors: @Xin (834529118@qq.com)
 */
import { defaultsDeep } from 'lodash-es'
import { ElMessageBox } from 'element-plus'

// 系统名称
const LOGINGSTATUS = 'loginToken'

/**
 * @description:   设置TOKEN
 * @param {String} TOKEN
 * @return {*}
 */
export const localStorageSetLoginToken = TOKEN => {
  TOKEN && localStorage.setItem(LOGINGSTATUS, TOKEN)
}

/**
 * @description:  移除TOKEN
 * @param {*}
 * @return {*}
 */
export const localStorageReomveLoginToken = () => {
  localStorage.removeItem(LOGINGSTATUS)
}

/**
 * @description: 获取TOKEN
 * @param {null}
 * @return {String || null} TOKEN
 */
export const localStorageGetLoginToken = () => {
  return localStorage.getItem(LOGINGSTATUS)
}

/**
 * @description:  跳转登录页(可指定携带参数跳转地址,默认获取携带当前地址跳转)
 * @param {String}  loginPath 登录页面路径
 * @return {Function}
 */
export const openLoginPage = (path, SYSTEM_NAME, url) => {
  if (!path) {
    throw new Error('[openLoginPage]: path is not is not defined')
  }

  const { href } = window.location

  if (url) {
    window.location.replace(`${loginPath}?callbackUrl=${encodeURIComponent(url)}&name=${escape(SYSTEM_NAME)}`)
    return
  }

  window.location.replace(`${loginPath}?callbackUrl=${encodeURIComponent(href)}&name=${escape(SYSTEM_NAME)}`)
}

/**
 * @description: 将模块信息转化为路由信息
 * @param {Array}  Modules
 * @return {Array} routes
 */
export const handleModules = Modules => {
  return Modules.map(({ childs, url, resources, name, view, leaf, id }) => {
    if (childs) {
      return {
        children: handleModules(childs),
        name: url,
        beforeEnter(route) {
          document.title = `${SYSTEM_NAME}-${route.meta.title}`
        },
        meta: {
          id,
          resources,
          title: name,
          view,
          leaf,
        },
      }
    } else {
      return {
        name: url,
        beforeEnter(route) {
          document.title = `${SYSTEM_NAME}-${route.meta.title}`
        },
        meta: {
          id,
          resources,
          title: name,
          view,
          leaf,
        },
      }
    }
  })
}

/**
 * @description:    将嵌套动态路由散列为单层路由
 * @param {Array} asyncRoutes  本地配置需要动态加载的路由模块
 * @return {Array} routes
 */
export const flatAsyncRoute = asyncRoutes => {
  return asyncRoutes.reduce((acc, current) => {
    if (current.children && current.children.length) {
      const { children, ...rest } = current
      acc.push({ ...rest, children })
      acc.push(...flatAsyncRoute(children))
    } else {
      acc.push(current)
    }
    return acc
  }, [])
}

/**
 * @description: 合并路由信息(获取modules 和 asyncRoute的交集路由)
 * @param {Array} modulRoues  后端获取modules模块(已转换为路由信息)
 * @param {Array} asyncRoute  本地配置需要动态加载的异步路由组件
 * @return {Array} route
 */
export const mergeRoutes = (modulRoues, asyncRoute) => {
  return modulRoues.map(v => {
    if (v.children && v.children.length) {
      const findRoute = asyncRoute.find(f => f.name === v.name)

      if (findRoute) {
        return defaultsDeep(v, {
          ...findRoute,
          children: mergeRoutes(v.children, asyncRoute),
        })
      } else {
        console.error('未找到权限管理系统中与之路由名对应的模块,请检查配置项!', v)
        throw new Error('未找到权限管理系统中与之路由名对应的模块,请检查配置项!')
      }
    } else {
      const findRoute = asyncRoute.find(f => f.name === v.name)
      if (findRoute) {
        return defaultsDeep(v, findRoute)
      } else {
        console.error('未找到权限管理系统中与之路由名对应的模块,请检查配置项!', v)
        throw new Error('未找到权限管理系统中与之路由名对应的模块,请检查配置项!')
      }
    }
  })
}

/**
 * @description:  生成导航栏
 * @param {*} routes  路由信息
 * @return {Array} Menus
 */
export const handleMenu = routes => {
  return routes.reduce((acc, current) => {
    const { children, ...rest } = current
    if (children && children.length) {
      if (current.meta && current.meta.view) {
        acc.push({
          ...rest,
          component: null,
          children: handleMenu(children),
        })
      } else {
        acc.push(...handleMenu(children))
      }
    } else {
      if (current.meta && current.meta.view) {
        acc.push({ ...rest, component: null })
      }
    }
    return acc
  }, [])
}

/**
 * @description: Token失效  异常弹窗告警
 * @param {String} Object.message
 * @param {String} Object.title
 * @param {String} Object.loginPath
 * @param {String} Object.systemName
 * @param {String} Object.url
 * @return {*}
 */
export const handleRequestTokenElMessageBoxConfirm = ({
  message = '请尝试重新登录！',
  title = '登录异常',
  loginPath = '',
  systemName = '',
  url = ''
}) => {
  ElMessageBox.confirm(message, title, {
    confirmButtonText: '确定',
    showClose: false,
    type: 'warning',
    showCancelButton: false,
    callback: () => {
      localStorageReomveLoginToken()
      openLoginPage(loginPath, systemName, url)
    },
  })
}

/**
 * @description:  添加路由
 * @param {Router} Router 路由实例
 * @param {Array} routes 路由列表
 * @return {null}
 */
export const addRoutes = (Router, routes) => {
  routes.forEach(v => {
    Router.addRoute(v)
  })

  return Promise.resolve('success')
}
