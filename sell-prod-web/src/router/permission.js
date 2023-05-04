import router from '@/router';
import store from '@/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Notification } from 'element-ui';

NProgress.configure({ showSpinner: false }); // 关闭右侧转轮

// 登录页面路由
const loginRoutePath = '/login';
// 不重定向白名单
const whiteRouteList = ['login'];

/**
 * 全局路由前置守卫
 */
router.beforeEach((to, from, next) => {
  console.log('路由-开始');
  NProgress.start();

  // 用户已登录
  if (store.state.userModule.userToken) {
    if (to.path === loginRoutePath) {
      next({ path: '/' });
    } else {
      if (store.state.userModule.userPermissionList.length === 0) {
        // 拉取个人信息
        store.dispatch('userModule/fetchUserInfoAction')
          .then(res => {
            // 生成动态路由
            store.dispatch('permissionModule/generateAsyncRouteAction', { userPermissionObjList: res })
              .then(() => {
                // 添加动态路由
                router.addRoutes(store.state.permissionModule.asyncRouteList);
                next({ ...to, replace: true });
              });
          })
          .catch(error => {
            Notification.error({ title: '错误', message: '请求用户信息失败，请重试' });
            // 获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('userModule/userLogoutAction').then(() => {
              if (router.currentRoute.name !== 'login') {
                next({ path: loginRoutePath, query: { redirect: to.fullPath } }); // 进入登录页面
              }
            });
          });
      } else {
        next();
      }
    }
  } else {
    // 在免登录路由名单，直接进入
    if (whiteRouteList.includes(to.name)) {
      next();
    } else {
      // 无 token 情况下则进入登录页面
      next({ path: loginRoutePath, query: { redirect: to.fullPath } });
      NProgress.done();
    }
  }
});

/**
 * 全局路由后置钩子
 */
router.afterEach(() => {
  console.log('路由-结束');
  NProgress.done();
});
