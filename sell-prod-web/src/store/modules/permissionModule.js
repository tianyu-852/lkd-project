import { constantRouterMap, asyncRouterMap } from '@/router/routes';

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 * @param route router.config.js 文件中的 asyncRouterMap 数组的元素
 * @param permissionList 后端返回的路由权限路由
 * @returns {boolean}
 *
 * 解释：根据 router.config.js 文件中的 asyncRouterMap 数组中的 permission(权限数组)
 * 和 后端接口用户角色路由列表
 */
const _hasPermission = (route, permissionList) => {
  if (route.meta && route.meta.permission) {
    let flag = false;
    for (let i = 0, len = permissionList.length; i < len; i++) {
      flag = route.meta.permission.includes(permissionList[i]);
      if (flag) {
        return true; // 退出函数
      }
    }
    return false;
  }
  return true;
};

/**
 * 过滤数组路由
 * @param {*} routerMap router.config.js 文件中的 asyncRouterMap 列表
 * @param {*} userRoles 后端返回的角色权限列表
 * @returns
 */
const _filterAsyncRouter = (routerMap, userPermissionAry) => {
  const accessedRouters = routerMap.filter(route => {
    if (_hasPermission(route, userPermissionAry)) {
      if (route.children && route.children.length) {
        route.children = _filterAsyncRouter(route.children, userPermissionAry);
      }
      return true;
    }
    return false;
  });

  return accessedRouters;
};

const state = {
  constRouteList: constantRouterMap,
  asyncRouteList: [], // 动态路由列表
};

const getters = {
  // 侧边栏菜单列表
  slidebarMenuList: state => {
    const routes = state.asyncRouteList.find(item => item.path === '/');
    const _menuList = (routes && routes.children) || [];
    return _menuList;
  }
};

const mutations = {
  // 设置动态路由
  SET_ASYNC_ROUTE: (state, routerList) => {
    state.asyncRouteList = routerList;
  }
};

const actions = {
  /**
   * 生成动态路由
   */
  generateAsyncRouteAction({ commit }, data) {
    return new Promise(resolve => {
      const { userPermissionObjList } = data;

      const userPermissionList = userPermissionObjList.map(permissionObjItem => permissionObjItem.permissionId);
      const accessedRouters = _filterAsyncRouter(asyncRouterMap, userPermissionList);
      commit('SET_ASYNC_ROUTE', accessedRouters);
      // console.log('动态路由', accessedRouters);

      resolve();
    });
  },
};

export default { namespaced: true, state, getters, mutations, actions };
