// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { customerService, chatRecord } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

/**
 * 需要用户权限的路由表 | 动态路由
 *
 * 注：
 * permission 字段是判断路由权限的字段；需要配合后端用户信息接口中 role.permissionList 做判断
 * 无 permission 字段的 meta 路由是无权限限制路由，都可访问
 */
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout, // 基本布局组件
    meta: { title: 'menu.home' },
    redirect: '/dashboard/analysis',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/analysis',
        component: RouteView,
        meta: { title: '系统首页', icon: 'home', permission: ['index'] },
        children: [
          {
            path: '/dashboard/Analysis/:pageNo([1-9]\\d*)?',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '系统首页', permission: ['index_statistics'] }
          },
          // {
          //   path: '/dashboard/AnalysisLawyerMap',
          //   name: 'AnalysisLawyerMapRoute',
          //   component: () => import('@/views/dashboard/Analysis-lawyerMap'),
          //   meta: { title: '律师分布地图' }
          //   // meta: { title: '律师分布地图', permission: ['lawyer_map'] }
          // },
          {
            path: '/dashboard/AnalysisLawyer',
            name: 'AnalysisLawyer',
            component: () => import('@/views/dashboard/AnalysisLawyer'),
            meta: { title: '律师活跃数据', permission: ['lawyer_active'] }
          },
          {
            path: '/dashboard/AnalysisUser',
            name: 'AnalysisUser',
            component: () => import('@/views/dashboard/AnalysisUser'),
            meta: { title: '用户活跃数据', permission: ['user_active'] }
          }
        ]
      },
      {
        path: '/statistics',
        name: 'statistics',
        redirect: '/statistics/page',
        component: RouteView,
        meta: { title: '分销统计', icon: 'bar-chart', permission: ['statistics'] },
        children: [
          {
            path: '/statistics/page',
            name: 'Statistics',
            component: () => import('@/views/statistics/StatisticsList'),
            meta: { title: '分销统计', permission: ['statistics_index'] }
          },
          {
            path: '/statistics/channel',
            name: 'StatisticsChannel',
            component: () => import('@/views/statistics/StatisticsChannel'),
            meta: { title: '渠道管理', permission: ['statistics_channel'] }
          },
          {
            path: '/statistics/ElectricPinList',
            name: 'ElectricPinList',
            component: () => import('@/views/statistics/ElectricPinList'),
            meta: { title: '电销管理', permission: ['statistics_channel'] }
          },
          {
            path: '/statistics/ElectricPinRegisterList/:promotionChannelId',
            name: 'ElectricPinRegisterList',
            component: () => import('@/views/statistics/ElectricPinRegisterList'),
            meta: { title: '电销管理-注册列表', permission: ['statistics_channel'] },
            hidden: true
          }
        ]
      },
      {
        path: '/Launch',
        name: 'Launch',
        redirect: '/Launch/page',
        component: RouteView,
        meta: { title: '投放管理', icon: 'profile', permission: ['statistics'] },
        children: [
          {
            path: '/Launch',
            name: 'LaunchList',
            component: () => import('@/views/Launch/LaunchList'),
            meta: { title: '投放列表', permission: ['statistics_index'] }
          },
          {
            path: '/LaunchOrderList',
            name: 'LaunchOrderList',
            component: () => import('@/views/Launch/LaunchOrderList'),
            meta: { title: '投放订单列表', permission: ['statistics_index'] }
          },
          {
            path: '/Launch/LaunchDetail/:advertisementId',
            name: 'LaunchDetail',
            component: () => import('@/views/Launch/LaunchDetail'),
            meta: { title: '投放详情', permission: ['statistics_channel'] },
            hidden: true
          },
          {
            path: '/Launch/LaunchAdministration',
            name: 'LaunchAdministration',
            component: () => import('@/views/Launch/LaunchAdministration'),
            meta: { title: '投放页面管理', permission: ['statistics_channel'] }
          }
        ]
      },
      {
        path: '/advert',
        name: 'Advert',
        redirect: '/advert/lawyer',
        component: RouteView,
        meta: { title: '广告管理', icon: 'profile', permission: ['advert'] },
        children: [
          {
            path: '/advert/lawyer',
            name: 'AdvertLawyerListRoute',
            component: () => import('@/views/advert/advertLawyerList'),
            meta: { title: '律师广告(旧)', permission: ['advert_lawyer'] }
          },
          {
            path: '/advert/lawyerSeat',
            name: 'AdvertLawyerSeatRoute',
            component: () => import('@/views/advert/advertLawyerSeat'),
            meta: { title: '律师广告位', permission: ['advert_lawyer'] }
          },
          {
            path: '/advert/offic',
            name: 'AdvertOfficRoute',
            component: () => import('@/views/advert/advertOffic'),
            meta: { title: '官方广告位', permission: ['advert_lawyer'] }
          },
          {
            path: '/advert/lawyer-add',
            name: 'AdvertLawyerAddRoute',
            component: () => import('@/views/advert/advertLawyerAdd'),
            meta: { title: '新增律师广告', },
            hidden: true
          },
          {
            path: '/advert/offic-signup',
            name: 'AdvertOfficSignupListRoute',
            component: () => import('@/views/advert/advertOfficSignupList'),
            meta: { title: '律师报名列表' },
            hidden: true
          },
          {
            path: '/advert/offic-visit',
            name: 'AdvertOfficVisitListRoute',
            component: () => import('@/views/advert/advertOfficVisitList'),
            meta: { title: '律师访问列表' },
            hidden: true
          },
          {
            path: '/advert/lawyerSeat-point',
            name: 'AdvertLawyerSeatPointRoute',
            component: () => import('@/views/advert/advertLawyerSeatPoint'),
            meta: { title: '律师访问列表' },
            hidden: true
          },
          // {
          //   path: '/advert/page',
          //   name: 'AdvertList',
          //   component: () => import('@/views/advert/advertList'),
          //   meta: { title: '广告列表', permission: ['advert_list'] }
          // },
          // {
          //   path: '/advert/position',
          //   name: 'AdvertPosition',
          //   component: () => import('@/views/advert/advertPosition'),
          //   meta: { title: '广告位置', }
          // },
        ]
      },
      {
        path: '/user',
        name: 'user',
        redirect: '/user/page',
        component: RouteView,
        meta: { title: '用户管理', icon: 'user', permission: ['user'] },
        children: [
          {
            path: '/user/page',
            name: 'UserPage',
            component: () => import('@/views/user/UserList'),
            meta: { title: '用户管理', permission: ['user_index'] }
          },
          {
            path: '/user/vipList',
            name: 'vipList',
            component: () => import('@/views/user/userVipList'),
            meta: { title: '会员列表', permission: ['user_index']},
          },
          // {
          //   path: '/user/member',
          //   name: 'MemberList',
          //   component: () => import('@/views/user/MemberList'),
          //   meta: {title: '会员管理', permission: ['user_index']},
          // },
          {
            path: '/user/CancelledList',
            name: 'CancelledList',
            component: () => import('@/views/user/CancelledList'),
            meta: { title: '已注销列表', permission: ['user_index'] }
          },
          {
            path: '/user/CancellationList',
            name: 'CancellationList',
            component: () => import('@/views/user/CancellationList'),
            meta: { title: '用户注销审核', permission: ['user_index'] }
          },
          // {
          //   path: '/user/enterpriseSearchLog',
          //   name: 'EnterpriseSearchLog',
          //   component: () => import('@/views/user/enterpriseSearchLog'),
          //   meta: { title: '企业搜索埋点', permission: ['user_index'] }
          // },
          // {
          //   path: '/user/intendedUserList',
          //   name: 'intendedUserList',
          //   component: () => import('@/views/user/intendedUserList'),
          //   meta: {title: '意向用户管理', permission: ['user_index']},
          // },
          {
            path: '/user/detail/:userId([1-9]\\d*)?',
            name: 'UserDetail',
            component: () => import('@/views/user/UserDetail'),
            meta: { title: '用户详情' },
            hidden: true
          },
          {
            path: '/user/member/:userId([1-9]\\d*)?',
            name: 'MemberDetail',
            component: () => import('@/views/user/MemberDetail'),
            meta: { title: '会员详情' },
            hidden: true
          }
        ]
      },
      {
        path: '/lawyer',
        name: 'lawyer',
        redirect: '/lawyer/index',
        component: RouteView,
        // meta: { title: '律师管理', icon: 'robot', permission: ['lawyer'] },
        meta: { title: '律师管理', icon: 'robot', permission: ['lawyer_index'] },
        children: [
          {
            path: '/lawyer/index',
            name: 'Lawyer',
            component: () => import('@/views/lawyer/lawyerIndex'),
            meta: { title: '律师首页', permission: ['lawyer_index'] }
          },
          {
            path: '/lawyer/auth',
            name: 'LawyerAuth',
            component: () => import('@/views/lawyer/LawyerAuth'),
            meta: { title: '律师审核', permission: ['lawyer_check'] }
          },
          {
            path: '/lawyer/best',
            name: 'LawyerBest',
            component: () => import('@/views/lawyer/lawyerBest'),
            meta: { title: '优选律师', permission: ['lawyer_best'], keepAlive: true, }
          },
          {
            path: '/lawyer/specialIncomeSet',
            name: 'LawyerSpecialIncomeSetList',
            component: () => import('@/views/lawyer/lawyerSpecialIncomeSetList'),
            meta: { title: '律师收益设置', permission: ['lawyer_distribution'] }
          },
          {
            path: '/lawyer/withdrawSet',
            name: 'LawyerWithdrawSetListPage',
            component: () => import('@/views/lawyer/lawyerWithdrawSetList'),
            meta: { title: '律师提现设置', permission: ['lawyer_distribution'] }
          },
          {
            path: '/lawyer/bestMenu',
            name: 'LawyerBestMenu',
            component: () => import('@/views/lawyer/lawyerBestMenu'),
            meta: { title: '优选套餐', permission: ['lawyer_distribution'] }
          },
          // {
          //   path: '/lawyer/orderCheckout',
          //   name: 'LawyerOrderCheckout',
          //   component: () => import('@/views/lawyer/lawyerOrderCheckout'),
          //   meta: { title: '订单结算', }
          // },
          {
            path: '/lawyer/readyAuthList',
            name: 'LawyerRadyAuthRoute',
            component: () => import('@/views/lawyer/lawyerReadyAuth'),
            meta: { title: '预认证律师', permission: ['ready_auth_lawyer'] }
          },
          {
            path: '/lawyer/promote',
            name: 'LawyerPromoteRoute',
            component: () => import('@/views/lawyer/lawyerPromote'),
            meta: { title: '推广大使', permission: ['lawyer_promote'], keepAlive: true }
          },
          {
            path: '/lawyer/prevent',
            name: 'LawyerPrevent',
            component: () => import('@/views/lawyer/lawyerPrevent'),
            meta: { title: '发单屏蔽律师', permission: ['lawyer_prevent'] }
          },
          {
            path: '/lawyer/Distribution',
            name: 'LawyerDistribution',
            component: () => import('@/views/lawyer/LawyerDistribution'),
            meta: { title: '律师分布', permission: ['lawyer_distribution'] }
          },
          {
            path: '/lawyer/EmptyNumber',
            name: 'LawyerEmptyNumber',
            component: () => import('@/views/lawyer/LawyerEmptyNumber'),
            meta: { title: '可疑空号律师', permission: ['lawyer_empty_number'] }
          },
          {
            path: '/lawyer/DoubtfulCharges',
            name: 'LawyerDoubtfulCharges',
            component: () => import('@/views/lawyer/LawyerDoubtfulCharges'),
            meta: { title: '可疑收费律师', permission: ['lawyer_charges'] }
          },
          {
            path: '/lawyer/label',
            name: 'LawyerLabel',
            component: () => import('@/views/lawyer/lawyerLabel'),
            meta: { title: '律师标签', permission: ['lawyer_charges'] }
          },
          {
            path: '/lawyer/detail/:userId([1-9]\\d*)?',
            name: 'LawyerDetail',
            component: () => import('@/views/lawyer/LawyerDetail'),
            meta: { title: '律师详情' },
            hidden: true
          },
          {
            path: '/lawyer/bestContinue',
            name: 'LawyerBestContinue',
            component: () => import('@/views/lawyer/lawyerBestContinue'),
            meta: { title: '优选会员续费' },
            hidden: true
          },
          {
            path: '/lawyer/bestClock',
            name: 'LawyerBestClock',
            component: () => import('@/views/lawyer/lawyerBestClock'),
            meta: { title: '定时开通优选会员' },
            hidden: true
          },
          {
            path: '/lawyer/promote-income',
            name: 'LawyerPromoteIncomeRoute',
            component: () => import('@/views/lawyer/lawyerPromoteIncome'),
            meta: { title: '推广大使收益' },
            hidden: true
          },
          {
            path: '/lawyer/bestPush',
            name: 'LawyerBestPush',
            component: () => import('@/views/lawyer/lawyerBestPush'),
            meta: { title: '优选推送表单' },
            hidden: true
          },
          {
            path: '/lawyer/bestDetail',
            name: 'LawyerBestDetail',
            component: () => import('@/views/lawyer/lawyerBestDetail'),
            meta: { title: '权益详情' },
            hidden: true
          },
          {
            path: '/lawyer/bestRightsSet',
            name: 'LawyerBestRightsSetRoute',
            component: () => import('@/views/lawyer/lawyerBestRightsSet'),
            meta: { title: '权益设置' },
            hidden: true
          },
          {
            path: '/lawyer/expenseRecord',
            name: 'LawyerExpenseRecordRoute',
            component: () => import('@/views/lawyer/lawyerExpenseRecord'),
            meta: { title: '律师消费记录' },
            hidden: true
          },
          // {
          //   path: '/lawyer/bestExperience',
          //   name: 'LawyerBestExperience',
          //   component: () => import('@/views/lawyer/lawyerBestExperience'),
          //   meta: { title: '优选体验期列表' },
          //   hidden: true
          // },
          // {
          //   path: '/lawyer/bestNoExperience',
          //   name: 'LawyerBestNoExperience',
          //   component: () => import('@/views/lawyer/lawyerBestNoExperience'),
          //   meta: { title: '优选非体验期列表' },
          //   hidden: true
          // },
          {
            path: '/lawyer/auth/detail/:lawyerAuthId([1-9]\\d*)?',
            name: 'LawyerAuthDetail',
            component: () => import('@/views/lawyer/LawyerAuthDetail'),
            meta: { title: '律师审核详情' },
            hidden: true
          }
        ]
      },
      {
        path: '/causeSource',
        name: 'CauseSource',
        redirect: '/causeSource/page',
        component: RouteView,
        meta: { title: '案源管理', icon: 'profile', permission: ['cause_source'] },
        children: [
          {
            path: '/causeSource/page',
            name: 'CauseSourceList',
            component: () => import('@/views/cause-source/causeSourceList'),
            meta: { title: '用户案源', permission: ['cause_source_user'] }
          },
          {
            path: '/causeSource/nativeVip',
            name: 'CauseSourceNativeVipRoute',
            component: () => import('@/views/cause-source/causeSourceNativeVip'),
            meta: { title: '案源会员', permission: ['cause_source_vip'] }
          },
          {
            path: '/causeSource/cityUnionLawyer',
            name: 'CauseSourceCityUnionRoute',
            component: () => import('@/views/cause-source/causeSourceCityUnion'),
            meta: { title: '一城一律', permission: ['cause_source_vip'] }
          },
          {
            path: '/causeSource/native',
            name: 'CauseSourceNativeRoute',
            component: () => import('@/views/cause-source/causeSourceNative'),
            meta: { title: '本地案源', permission: ['cause_source_native'] }
          },
          {
            path: '/causeSource/match',
            name: 'CauseSourceMatch',
            component: () => import('@/views/cause-source/causeSourceUnion'),
            meta: { title: '案源合作', permission: ['cause_source_match'] }
          },
          // {
          //   path: '/causeSource/match',
          //   name: 'CauseSourceMatch',
          //   component: () => import('@/views/cause-source/causeSourceMatch'),
          //   meta: { title: '案源匹配会员', permission: ['cause_source_match'] }
          // },
          // {
          //   path: '/causeSource/matchRegion',
          //   name: 'CauseSourceMatchRegion',
          //   component: () => import('@/views/cause-source/causeSourceMatchRegion'),
          //   meta: { title: '案源匹配地区', permission: ['cause_source_match_region'] }
          // },
          // {
          //   path: '/causeSource/menu',
          //   name: 'CauseSourceMenu',
          //   component: () => import('@/views/cause-source/causeSourceMatchMenu'),
          //   meta: { title: '案源匹配套餐', permission: ['cause_source_menu'] }
          // },
          {
            path: '/causeSource/clue',
            name: 'CauseSourceClue',
            component: () => import('@/views/cause-source/causeSourceClue'),
            meta: { title: '线索列表', keepAlive: true, permission: ['cause_source_clue'] }
          },
          {
            path: '/causeSource/clueLabel',
            name: 'CauseSourceClueLabel',
            component: () => import('@/views/cause-source/causeSourceClueLabel'),
            meta: { title: '线索标签', permission: ['cause_source_label'] }
          },
          {
            path: '/causeSource/vipRecord',
            name: 'causeSourceMatchVipRecordRoute',
            component: () => import('@/views/cause-source/causeSourceMatchVipRecord'),
            meta: { title: '案源匹配开通记录' },
            hidden: true
          },
          {
            path: '/causeSource/useRecord',
            name: 'causeSourceMatchUseRecordRoute',
            component: () => import('@/views/cause-source/causeSourceMatchUseRecord'),
            meta: { title: '案源匹配使用记录' },
            hidden: true
          },
          {
            path: '/causeSource/matchClue',
            name: 'CauseSourceMatchClueRoute',
            component: () => import('@/views/cause-source/causeSourceMatchClue'),
            meta: { title: '案源匹配线索' },
            hidden: true
          },
          {
            path: '/causeSource/nationClue',
            name: 'CauseSourceNationClueRoute',
            component: () => import('@/views/cause-source/causeSourceNationClue'),
            meta: { title: '全国地区线索' },
            hidden: true
          },
          {
            path: '/causeSource/nationClueData',
            name: 'CauseSourceNationClueDataRoute',
            component: () => import('@/views/cause-source/causeSourceNationClueData'),
            meta: { title: '全国新增线索数据' },
            hidden: true
          },
          {
            path: '/causeSource/nativeGetSet',
            name: 'CauseSourceNativeSetRoute',
            component: () => import('@/views/cause-source/causeSourceNativeSet'),
            meta: { title: '本地案源免费领取设置' },
            hidden: true
          },
          {
            path: '/causeSource/vipUseRecord',
            name: 'CauseSourceVipUseRecordRoute',
            component: () => import('@/views/cause-source/causeSourceVipUseRecord'),
            meta: { title: '本地案源免费领取设置' },
            hidden: true
          },
          {
            path: '/causeSource/cityUnionLawyerDetail',
            name: 'CauseSourceCityUnionDetailRoute',
            component: () => import('@/views/cause-source/causeSourceCityUnionDetail'),
            meta: { title: '一城一律合作案源详情' },
            hidden: true
          },
        ]
      },
      {
        path: '/order',
        name: 'order',
        redirect: '/order/page',
        component: RouteView,
        meta: { title: '订单管理', icon: 'money-collect', permission: ['order'] },
        children: [
          {
            path: '/order/page-free',
            name: 'OrderPageFree',
            component: () => import('@/views/order/OrderFreeList'),
            meta: { title: '电话咨询', permission: ['order_index'] }
          },
          {
            path: '/order/lawyerPage',
            name: 'OrderLawyerList',
            component: () => import('@/views/order/OrderLawyerList'),
            meta: { title: '评价管理', permission: ['order_index'] }
          },
          {
            path: '/order/page',
            name: 'OrderPage',
            component: () => import('@/views/order/OrderList'),
            meta: { title: '订单管理(详情)', permission: ['order_index'] }
          },
          {
            path: '/order/pages',
            name: 'OrderPageBoss',
            component: () => import('@/views/order/OrderListBoss'),
            meta: { title: '订单管理(审核)', permission: ['order_index'] }
          },
          {
            path: '/order/detail/:orderId',
            name: 'OrderDetail',
            component: () => import('@/views/order/OrderDetail'),
            meta: { title: '订单详情', permission: ['order_index'] },
            hidden: true
          },
          {
            path: '/order/DemandOrderList',
            name: 'DemandOrderList',
            component: () => import('@/views/order/DemandOrderList'),
            meta: { title: '需求订单(详情)', permission: ['order_index'] }
          },
          {
            path: '/order/DemandOrderListBoss',
            name: 'DemandOrderListBoss',
            component: () => import('@/views/order/DemandOrderListBoss'),
            meta: { title: '需求订单(审核)', permission: ['order_index'] }
          },
          {
            path: '/order/orderException',
            name: 'OrderException',
            component: () => import('@/views/order/orderException'),
            meta: { title: '异常订单', permission: ['order_index'] }
          },
          {
            path: '/order/OrderListApply',
            name: 'OrderListApply',
            component: () => import('@/views/order/OrderListApply'),
            meta: { title: '电话咨询申请列表', permission: ['order_index'] }
          },
          // {
          //   path: '/order/orderRefund',
          //   name: 'OrderRefund',
          //   component: () => import('@/views/order/order-refund'),
          //   meta: { title: '订单退款', permission: ['order_index'] }
          // },
          {
            path: '/order/DemandDetail/:demandId',
            name: 'DemandDetail',
            component: () => import('@/views/order/DemandDetail'),
            meta: { title: '需求订单详情', permission: ['order_index'] },
            hidden: true
          },
          {
            path: '/order/DemandDetailBoss/:demandId',
            name: 'DemandDetailBoss',
            component: () => import('@/views/order/DemandDetailBoss'),
            meta: { title: '需求订单详情(审核)', permission: ['order_index'] },
            hidden: true
          }
        ]
      },
      // 企业管理
      {
        path: '/client',
        name: 'client',
        redirect: '/client/clientPersonList',
        component: RouteView,
        meta: { title: '企业管理', icon: 'user', permission: ['client'] },
        children: [
          {
            path: '/client/clientCompanyList',
            name: 'clientCompanyList',
            component: () => import('@/views/client/clientCompanyList'),
            meta: { title: '企业客户', permission: ['client_company'] }
          },
          // {
          //   path: '/client/clientPersonList',
          //   name: 'clientPersonList',
          //   component: () => import('@/views/client/clientPersonList'),
          //   meta: { title: '个人客户', keepAlive: true, permission: ['client_person'] }
          // },
          {
            path: '/client/edit',
            name: 'clientCompanyEdit',
            component: () => import('@/views/client/clientCompanyEdit'),
            meta: { title: '企业套餐' },
            hidden: true
          },
          {
            path: '/client/clientOrderDetail',
            name: 'clientOrderDetail',
            component: () => import('@/views/client/clientOrderDetail'),
            meta: { title: '订单详情' },
            hidden: true
          },
          {
            path: '/client/expenseRecord',
            name: 'ClientExpenseRecordRoute',
            component: () => import('@/views/client/clientExpenseRecord'),
            meta: { title: '企业消费记录' },
            hidden: true
          },
        ]
      },
      {
        path: '/point',
        name: 'pointLog',
        redirect: '/point/legalPointLog',
        component: RouteView,
        meta: { title: '埋点管理', icon: 'user', permission: ['client'] },
        children: [
          {
            path: '/point/userPointLog',
            name: 'userPointList',
            component: () => import('@/views/point-log/userPointLog'),
            meta: { title: '律师认证埋点', permission: ['client_company'] },
          },
          {
            path: '/point/lawyerAdvertPointLog',
            name: 'lawyerAdvertPoint',
            component: () => import('@/views/point-log/lawyerAdvertPointLog'),
            meta: { title: '律师广告埋点', permission: ['client_company'] },
          },
          {
            path: '/point/legalPointLog',
            name: 'legalPointLog',
            component: () => import('@/views/point-log/legalPointLog'),
            meta: { title: '企业法务埋点', permission: ['client_company'] },
          },
          {
            path: '/point/userToLawyerBill',
            name: 'userToLawyerBillRoute',
            component: () => import('@/views/user/userToLawyerBill'),
            meta: { title: '' },
            hidden: true
          }
        ]
      },
      // {
      //   path: '/law-serve',
      //   name: 'lawServe',
      //   redirect: '/lawServe/page',
      //   component: RouteView,
      //   meta: { title: '企业套餐', icon: 'profile', permission: ['enterprise_vip_menu'] },
      //   children: [
      //     {
      //       path: '/lawServe/page',
      //       name: 'enterpriseServeList',
      //       component: () => import('@/views/law-serve/enterpriseServeList'),
      //       meta: { title: '企业会员', permission: ['enterprise_vip_list'] }
      //     },
      //     {
      //       path: '/lawServe/role',
      //       name: 'enterpriseServeRole',
      //       component: () => import('@/views/law-serve/enterpriseServeRole'),
      //       meta: { title: '编辑权限', permission: ['enterprise_vip_permission'] }
      //     },
      //     {
      //       path: '/lawServe/edit',
      //       name: 'enterpriseServeEdit',
      //       component: () => import('@/views/law-serve/enterpriseServeEdit'),
      //       meta: { title: '企业录入' },
      //       hidden: true
      //     }
      //   ]
      // },
      {
        path: '/question',
        name: 'question',
        redirect: '/question/page',
        component: RouteView,
        meta: { title: '社区管理', icon: 'team', permission: ['question'] },
        children: [
          {
            path: '/question/page',
            name: 'QuestionPage',
            component: () => import('@/views/question/QuestionList'),
            meta: { title: '社区管理', permission: ['question_index'] }
          },

          {
            path: '/question/detail/:questionId([1-9]\\d*)?',
            name: 'QuestionDetail',
            component: () => import('@/views/question/QuestionDetail'),
            meta: { title: '帖子详情' },
            hidden: true
          }
        ]
      },
      {
        path: '/service',
        name: 'service',
        redirect: '/service/List',
        component: RouteView,
        meta: { title: '客服管理', icon: customerService, permission: ['customer'] },
        children: [
          {
            path: '/service/List',
            name: 'serviceList',
            component: () => import('@/views/service/customerServiceList'),
            meta: { title: '客服列表', permission: ['customer_list'] }
          },
          {
            path: '/service/Commission',
            name: 'commissionList',
            component: () => import('@/views/service/commissionList'),
            meta: { title: '客服提成', permission: ['customer_commission'], keepAlive: true }
          }
        ]
      },
      {
        path: '/lawManager',
        name: 'LawManager',
        redirect: '/lawManager/law',
        component: RouteView,
        meta: { title: '法务管理', icon: 'user', permission: ['law_manager'] },
        children: [
          {
            path: '/lawManager/law',
            name: 'LawManagerList',
            component: () => import('@/views/law-manager/lawManagerList'),
            meta: { title: '律师管家', permission: ['law_manager_list'] }
          },
          {
            path: '/lawManager/affairs',
            name: 'AffairsManagerList',
            component: () => import('@/views/law-manager/affairsManagerList'),
            meta: { title: '法务管家', permission: ['law_manager_list'] }
          },
          {
            path: '/lawManager/case',
            name: 'caseManagerRoute',
            component: () => import('@/views/law-manager/caseManager'),
            meta: { title: '案源法务', permission: ['law_manager_list'] }
          },
        ]
      },
      // 销售管理
      {
        path: '/sell',
        name: 'sell',
        redirect: '/sell/serviceList',
        component: RouteView,
        meta: { title: '销售管理', icon: customerService, permission: ['sell'] },
        children: [
          {
            path: '/sell/serviceList',
            name: 'sellServiceList',
            component: () => import('@/views/sell/sellServiceList'),
            meta: { title: '销售人员', keepAlive: true, permission: ['sell_list'] }
          },
          {
            path: '/sell/clientList',
            name: 'sellClientList',
            component: () => import('@/views/sell/sellClientList'),
            meta: { title: '客户列表', keepAlive: true, permission: ['sell_client_list'] }
          },
          {
            path: '/sell/clientVipList',
            name: 'sellClientVipList',
            component: () => import('@/views/sell/sellClientVipList'),
            meta: { title: '客户会员列表' },
            hidden: true
          },
          {
            path: '/sell/setLabel',
            name: 'sellSetLabel',
            component: () => import('@/views/sell/sellSetLabel'),
            meta: { title: '标签管理', permission: ['sell_set_label'] }
          },
          {
            path: '/sell/commissionDetail',
            name: 'sellCommissionDetail',
            component: () => import('@/views/sell/sellCommissionDetail'),
            meta: { title: '销售提成', keepAlive: true },
            hidden: true
          }
          // {
          //   path: '/sell/openAccount',
          //   name: 'sellOpenAccount',
          //   component: () => import('@/views/sell/sellOpenAccount'),
          //   meta: { title: '开户列表', permission: ['sell_set_label'] },
          //   meta: { title: '开户列表' },
          //   hidden: true,
          // },
        ]
      },
      // 销售端管理
      {
        path: '/sellPlatform',
        name: 'sellPlatform',
        redirect: '/sellPlatform/contract',
        component: RouteView,
        meta: { title: '加盟商管理', icon: 'team', permission: ['sell_platform'] },
        children: [
          {
            path: '/sellPlatform/contract',
            name: 'sellPlatformContract',
            component: () => import('@/views/sell-platform/sellPlatformContract'),
            meta: { title: '合同管理', permission: ['sell_platform_contract'] }
          },
          {
            path: '/sellPlatform/league',
            name: 'sellPlatformLeague',
            component: () => import('@/views/sell-platform/sellPlatformLeague'),
            meta: { title: '加盟商列表', permission: ['sell_platform_league'] }
          },
          {
            path: '/sellPlatform/leagueSell/:leagueId',
            name: 'sellPlatformLeagueSell',
            component: () => import('@/views/sell-platform/sellPlatformLeagueSell'),
            meta: { title: '加盟商销售', permission: ['sell_platform_league_seller'] }
          },
          {
            path: '/sellPlatform/openOrder/:sellUserId',
            name: 'sellPlatformOpenOrder',
            component: () => import('@/views/sell-platform/sellPlatformOpenOrder'),
            meta: { title: '开单详情' },
            hidden: true
          },
          {
            path: '/sellPlatform/vipShare/:sellUserId',
            name: 'sellPlatformVipShare',
            component: () => import('@/views/sell-platform/sellPlatformVipShare'),
            meta: { title: '套餐分享' },
            hidden: true
          },
          {
            path: '/sellPlatform/role',
            name: 'sellPlatformRole',
            component: () => import('@/views/sell-platform/sellPlatformRole'),
            meta: { title: '内部账号', keepAlive: true, permission: ['sell_platform_inner'] }
          }
        ]
      },
      {
        path: '/app',
        name: 'App',
        redirect: '/app/version',
        component: RouteView,
        meta: { title: 'APP管理', icon: 'pull-request', permission: ['app'] },
        children: [
          {
            path: '/app/set',
            name: 'appSet',
            component: () => import('@/views/app/appSet'),
            meta: { title: 'APP设置', permission: ['app_set'] }
          },
          {
            path: '/app/version',
            name: 'AppVersion',
            component: () => import('@/views/app/appVersion'),
            meta: { title: 'APP版本', permission: ['app_version'] }
          },
          {
            path: '/app/protocol',
            name: 'AppProtocol',
            component: () => import('@/views/app/appProtocol'),
            meta: { title: '协议管理', permission: ['app_protocol'] }
          },
          {
            path: '/app/protocolEdit',
            name: 'AppProtocolEdit',
            component: () => import('@/views/app/appProtocolEdit'),
            meta: { title: '协议详情', },
            hidden: true
          },
        ]
      },
      {
        path: '/suggest',
        name: 'suggest',
        redirect: '/suggest/page',
        component: RouteView,
        meta: { title: '意见反馈', icon: 'sound', permission: ['suggest'] },
        children: [
          {
            path: '/suggest/page',
            name: 'SuggestPage',
            component: () => import('@/views/suggest/SuggestList'),
            meta: { title: '意见反馈', permission: ['suggest_index'] }
          },
          {
            path: '/suggest/ComplaintList',
            name: 'ComplaintList',
            component: () => import('@/views/suggest/ComplaintList'),
            meta: { title: '投诉举报', permission: ['suggest_index'] }
          }
        ]
      },
      {
        path: '/message',
        name: 'message',
        redirect: '/message/page',
        component: RouteView,
        meta: { title: '消息管理', icon: 'message', permission: ['suggest'] },
        children: [
          {
            path: '/message/page',
            name: 'messagePage',
            component: () => import('@/views/message/messagePush'),
            meta: { title: '系统信息推送', permission: ['suggest_index'] }
          }
        ]
      },
      {
        path: '/chatRecord',
        name: 'chatRecord',
        redirect: '/chatRecord/page',
        component: RouteView,
        meta: { title: '聊天管理', icon: chatRecord, permission: ['suggest'] },
        children: [
          {
            path: '/chatRecord/page',
            name: 'chatRecordPage',
            component: () => import('@/views/chatRecord/chatRecordList'),
            meta: { title: '聊天记录列表', permission: ['suggest_index'] }
          }
        ]
      },
      {
        path: '/money',
        name: 'money',
        redirect: '/money/page',
        component: RouteView,
        meta: { title: '资金管理', icon: 'wallet', permission: ['money'] },
        children: [
          {
            path: '/money/money',
            name: 'moneyPage',
            component: () => import('@/views/money/money'),
            meta: { title: '资金管理', permission: ['money_index'] }
          },
          {
            path: '/money/detail',
            name: 'moneyDetail',
            component: () => import('@/views/money/detail'),
            meta: { title: '资金流水', permission: ['index_statistics'] },
            hidden: true
          },
          {
            path: '/money/pay',
            name: 'pay',
            component: () => import('@/views/money/pay'),
            meta: { title: '支付记录', permission: ['payment'] }
          },
          {
            path: '/money/transferAccountRecord',
            name: 'transferAccountRecord',
            component: () => import('@/views/money/transferAccountRecord'),
            meta: { title: '转账记录', permission: ['transfer_account_record'] }
          },
          {
            path: '/money/transfer',
            name: 'transfer',
            component: () => import('@/views/money/transferCheck'),
            meta: { title: '审核记录', permission: ['transfer'] }
          }
        ]
      },
      {
        path: '/question/reward',
        name: 'rewardQuestion',
        redirect: '/question/reward/page',
        component: RouteView,
        meta: { title: '活动管理', icon: 'schedule', permission: ['activity'] },
        children: [
          {
            path: '/question/reward/page',
            name: 'QuestionRewardPage',
            component: () => import('@/views/rewardQuestion/QuestionRewardList'),
            meta: { title: '悬赏问答', permission: ['question_reward'] }
          },
          {
            path: '/question/reward/detail/:questionId([1-9]\\d*)?',
            name: 'QuestionRewardDetail',
            component: () => import('@/views/rewardQuestion/QuestionRewardDetail'),
            meta: { title: '帖子详情' },
            hidden: true
          }
        ]
      },
      {
        path: '/Fundraising',
        redirect: '/Fundraising/',
        component: RouteView,
        meta: { title: '众筹管理', icon: 'reconciliation', permission: ['fundraise'] },
        children: [
          {
            path: '/fundraising/fundraisingList',
            name: 'FundraisingList',
            component: () => import('@/views/fundraising/FundraisingList'),
            meta: { title: '筹款案件列表', permission: ['fundraising'] }
          },
          {
            path: '/fundraising/fundraisingCheck',
            name: 'FundraisingCheck',
            component: () => import('@/views/fundraising/FundraisingCheck'),
            meta: { title: '众筹案件审核', permission: ['fundraising_check'] }
          },
          {
            path: '/fundraising/fundraisingOperate',
            name: 'FundraisingOperate',
            component: () => import('@/views/fundraising/FundraisingOperate'),
            meta: { title: '运营列表', permission: ['fundraising_operate'] }
          },
          {
            path: '/fundraising/fundraisingService',
            name: 'FundraisingService',
            component: () => import('@/views/fundraising/FundraisingService'),
            meta: { title: '客服订单页面', permission: ['fundraising_service'] }
          },
          {
            path: '/fundraising/fundraisingIntervention',
            name: 'FundraisingIntervention',
            component: () => import('@/views/fundraising/FundraisingIntervention'),
            meta: { title: '申请平台介入审核列表', keepAlive: true },
            hidden: true
          },

          {
            path: '/fundraising/fundraisingProgressList',
            name: 'FundraisingProgressList',
            component: () => import('@/views/fundraising/FundraisingProgressList'),
            meta: { title: '案件进度审核列表', permission: ['fundraising_progress'] }
          },
          {
            path: '/fundraising/fundraisingRecommendList',
            name: 'FundraisingRecommendList',
            component: () => import('@/views/fundraising/FundraisingRecommendList'),
            meta: { title: '申请推荐审核列表', permission: ['fundraising_recommend'] }
          },
          {
            path: '/fundraising/fundraisingAnnouncement',
            name: 'FundraisingAnnouncement',
            component: () => import('@/views/fundraising/FundraisingAnnouncement'),
            meta: { title: '平台公告', keepAlive: true },
            hidden: true
          },
          {
            path: '/fundraising/FundraisingDetailsService/:fundraisingProgressId',
            name: 'FundraisingDetailsService',
            component: () => import('@/views/fundraising/FundraisingDetailsService'),
            meta: { title: '审核详情' },
            hidden: true
          },
          {
            path: '/fundraising/FundraisingDetailsCheck/:fundraisingProgressId',
            name: 'FundraisingDetailsCheck',
            component: () => import('@/views/fundraising/FundraisingDetailsCheck'),
            meta: { title: '审核详情' },
            hidden: true
          },
          {
            path: '/fundraising/fundraisingProgress/:fundraisingProgressItemAuthId',
            name: 'FundraisingProgress',
            component: () => import('@/views/fundraising/FundraisingProgress'),
            meta: { title: '筹款进度' },
            hidden: true
          },
          {
            path: '/fundraising/fundraisingInitiate/:fundraisingId',
            name: 'FundraisingInitiate',
            component: () => import('@/views/fundraising/FundraisingInitiate'),
            meta: { title: '筹款进度' },
            hidden: true
          },
          {
            path: '/fundraising/fundraisingSelect/:fundraisingRegistrationId',
            name: 'FundraisingSelect',
            component: () => import('@/views/fundraising/FundraisingSelect'),
            meta: { title: '发起筹款' },
            hidden: true
          }
        ]
      },
      {
        path: '/permission',
        name: 'permission',
        redirect: '/permission/page',
        component: RouteView,
        meta: { title: '权限管理', icon: 'laptop', permission: ['auth'] },
        children: [
          {
            path: '/permission/page',
            name: 'PermissionAdmin',
            component: () => import('@/views/permission/permission-admin'),
            meta: { title: '后台账号', permission: ['auth_index'] }
          },
          // {
          //   path: '/permissions/record',
          //   name: 'PermissionsRecord',
          //   component: () => import('@/views/permissions/record'),
          //   meta: { title: '操作日志', permission: ['auth_log'] }
          // }
        ]
      },
      {
        path: '/test',
        name: 'test',
        component: () => import('@/views/test'),
        meta: { title: '测试' },
        hidden: true
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由 不需要用户权限的路由表
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/Login')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
