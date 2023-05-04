import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
// import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// import { i18nRender } from '@/locales'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 路由白名单 | no redirect allowList
const allowList = ['login', 'register', 'registerResult']
// 登录页面路由
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard/workplace'

// 加盟商后台域名
const leagueHouTaiHostname = 'abc.com'

/**
 * 全局前置守卫
 */
router.beforeEach((to, from, next) => {
  const hostname = window.location.hostname
  if (hostname === leagueHouTaiHostname) {
    document.title = '加盟商管理'
  } else {
    document.title = '百姓律师'
  }

  NProgress.start() // start progress bar
  // to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
  /* has token */
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // 缓存中存在 token 下，先获取用户信息中的 角色 | check login user.roles is nul
      if (store.getters.roles.length === 0) {
        // 执行 user module 获取用户信息 action
        store
          .dispatch('GetInfo')
          .then(res => {
            const roles = res.data && res.data.role
            // console.log('角色：', res)
            // generate dynamic router 根据 roles 权限生成可访问的路由表
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)

              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              const redirect = decodeURIComponent(from.query.redirect || to.path)

              if (to.path === redirect) {
                // 针对 pc 销售人员账号跳转客户列表
                // if (store.state.user?.info?.seller?.is_customer && ['/', '/404'].includes(to.path)) {
                //   next({ path: '/sell/clientList' })
                // // 针对 加盟商 账号跳转 加盟商销售
                // } else if (store.state.user?.info?.alliance?.is_alliance && ['/', '/404'].includes(to.path)) {
                //   const leagueId = store.state.user?.info?.alliance.info.alliance_business_id
                //   next({ name: 'sellPlatformLeagueSell', params: { leagueId } })
                // } else {
                  // next({ ...to, replace: true })
                  // 路径为 '/'、'/404' 直接进入「账号路由权限」中第一个路由
                  if (['/', '/404'].includes(to.path)) {
                    const firstRoute = store.getters.addRouters[0].children[0]
                    next({ path: firstRoute.path, replace: true })
                  } else {
                    next({ ...to, replace: true })
                  }
                // }
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            notification.error({ message: '错误', description: '请求用户信息失败，请重试' })
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then(() => {
              if (router.currentRoute.name !== 'login') {
                // 进入登录页面
                next({ path: loginRoutePath, query: { redirect: to.fullPath } })
              }
            })
          })
      } else {
        next()
      }
    }
  } else {
    // 在免登录名单，直接进入
    if (allowList.includes(to.name)) {
      next()
    } else {
      // 无 token 情况下则进入登录页面
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
