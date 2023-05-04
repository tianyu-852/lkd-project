import Layout from '@/layout/layout';
import CommerView from '@/layout/commer-view';

/**
 * 静态路由
 */
export const constantRouterMap = [
  { path: '/', redirect: '/home' },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login'),
    meta: { title: '登录' }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/404')
  }
];

/**
 * 动态路由
 */
export const asyncRouterMap = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/home'),
        meta: { title: '首页', icon: 'el-icon-s-home', permission: ['home'] },
      },
      // 合同管理
      {
        path: '/contract',
        name: 'contract',
        component: CommerView,
        redirect: '/contract/list',
        meta: { title: '合同管理', icon: 'el-icon-s-promotion', permission: ['contract'] },
        children: [
          {
            path: 'list',
            name: 'contractList',
            component: () => import('@/views/module-contract/contract-list/contract-list'),
            meta: { title: '合同列表', permission: ['contract_list'] },
          }
        ]
      },
      // 用户管理
      {
        path: '/user',
        name: 'user',
        component: CommerView,
        redirect: '/user/list/aaa-333',
        meta: { title: '用户管理', icon: 'el-icon-camera-solid', permission: ['user'] },
        children: [
          {
            path: 'list',
            name: 'userList',
            component: CommerView,
            meta: { title: '用户列表', permission: ['user_list'] },
            children: [
              {
                path: 'aaa-3',
                name: 'userList',
                component: () => import('@/views/module-user/user-list/user-list'),
                meta: { title: '用户列表-2层', }
              },
              {
                path: 'bbb-3',
                name: 'userDetail',
                component: () => import('@/views/module-user/user-detail/user-detail'),
                // hidden: true,
                meta: { title: '用户详情-2层', permission: ['user_detail'] }
              },
            ]
          },
          {
            path: 'detail',
            name: 'userDetail',
            component: () => import('@/views/module-user/user-detail/user-detail'),
            meta: { title: '用户详情', permission: ['user_detail'] },
            // hidden: true
          },
        ]
      },
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];
