import { asyncRouterMap, constantRouterMap } from '@/config/router.config'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 * @param permission 后端返回的路由权限路由
 * @param route router.config.js 文件中的 asyncRouterMap 数组的元素
 * @returns {boolean}
 * 
 * 解释：根据 router.config.js 文件中的 asyncRouterMap 数组中的 permission(权限数组) 
 * 和 后端接口用户角色路由列表
 */
function hasPermission (permission, route) {
  if (route.meta && route.meta.permission) {
    let flag = false
    for (let i = 0, len = permission.length; i < len; i++) {
      flag = route.meta.permission.includes(permission[i])
      if (flag) {
        return true
      }
    }
    return false
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
// function hasRole(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return route.meta.roles.includes(roles.id)
//   } else {
//     return true
//   }
// }

/**
 * 过滤一步路由
 * @param {*} routerMap router.config.js 文件中的 asyncRouterMap 列表
 * @param {*} roles 后端返回的角色权限列表
 * @returns 
 */
function filterAsyncRouter (routerMap, roles) {
  const accessedRouters = routerMap.filter(route => {
    // console.log(route)
    if (hasPermission(roles.permissionList, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap, // 用户常量路由 + 权限路由
    addRouters: [] // 用户权限路由
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    // 生成动态路由
    GenerateRoutes ({ commit, state }, data) {
      return new Promise(resolve => {
        const { roles } = data
        const accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
