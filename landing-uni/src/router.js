// router.js
import { RouterMount, createRouter } from 'uni-simple-router';

const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,  
	routes: [
		{
			name:'index',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/index/index",    
			aliasPath: '/', 
		},{
			name:'lawyer',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/index/lawyer",    
			aliasPath: '/landing/lawyer', 
		},{
			name:'landing',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/index/userindex",    
			aliasPath: '/landing', 
		},{
			name:'freeLanding',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/index/freeLanding",
			aliasPath: '/landing/freeLanding', 
		},{
			name:'empty',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/index/empty",
			aliasPath: '/empty', 
		},{
			name:'dsbEmpty',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/dsb/empty",
			aliasPath: '/dsbEmpty', 
		},{
			name:'userindex',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/dsb/userindex",
			aliasPath: '/userindex', 
		},{
			name:'dsbfreeLanding',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/dsb/freeLanding",
			aliasPath: '/dsbfreeLanding', 
		},{
			name:'dsbLanding',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/dsb/landing",
			aliasPath: '/dsbLanding', 
		},{
			name:'sincerityPlanUser',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/dsb/sincerityPlanUser",
			aliasPath: '/sincerityPlanUser', 
		},{
			name:'sincerityPlanLawyer',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/dsb/sincerityPlanLawyer",
			aliasPath: '/sincerityPlanLawyer', 
		},{
			name:'register',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/lfy/register",
			aliasPath: '/register', 
		},{
			name:'upgrade',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/lfy/upgrade",
			aliasPath: '/upgrade', 
		},{
			name:'link',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/lfy/link",
			aliasPath: '/link', 
		},{
			name:'safeguard',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/lfy/safeguard",
			aliasPath: '/safeguard', 
		},{
			name:'explanation',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/lfy/explanation",
			aliasPath: '/explanation', 
		},{
			name:'about',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/lfy/about",
			aliasPath: '/about',
		},{
			name:'logoutPolicy',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/lfy/logoutPolicy",
			aliasPath: '/logoutPolicy',
		},{
			name:'privacyPolicy',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/lfy/privacyPolicy",
			aliasPath: '/privacyPolicy',
		},{
			name:'userPolicy',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/lfy/userPolicy",
			aliasPath: '/userPolicy',
		},{
			name:'consult',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/lfy/consult",
			aliasPath: '/consult',
		},{
			name:'service',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/lfy/service",
			aliasPath: '/service',
		},{
			name:'qylyadd',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/qyly/register",
			aliasPath: '/qylyadd',
		},{
			name:'lfyadd',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/lfy/add",
			aliasPath: '/lfyadd',
		},{
			name:'link2',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/lfy/link2",
			aliasPath: '/link2',
		},{
			name:'qylyPrivacyPolicy',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/qyly/privacyPolicy",
			aliasPath: '/qylyPrivacyPolicy',
		},{
			name:'qylyUserPolicy',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/qyly/userPolicy",
			aliasPath: '/qylyUserPolicy',
		},{
			name:'qrcode',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/qyly/qrcode",
			aliasPath: '/qrcode',
		},{
			name:'qylyAbout',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/qyly/about",
			aliasPath: '/qylyAbout',
		},{
			name:'lawyerPage',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/qyly/lawyerPage",
			aliasPath: '/lawyerPage',
		},{
			name:'addLawyer',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/index/addlawyer",
			aliasPath: '/addLawyer',
		},{
			name:'orderDescription',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/index/orderDescription",
			aliasPath: '/orderDescription',
		},{
			name:'upload',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/index/upload",
			aliasPath: '/upload',
		},{
			name:'vipRoom',
			//为了兼容其他端，此时的path不能少，必须和 pages.json中的页面路径匹配
			path: "/pages/index/vipRoom",
			aliasPath: '/vipRoom',
		},
		{
			name:'downloadAppBaixing',
			path: "/pages/download/download-app-baixing/download-app-baixing",
			aliasPath: '/download-app-baixing',
		},
		{
			name:'downloadAppBxls',
			path: "/pages/download/download-app-bxls/download-app-bxls",
			aliasPath: '/xzbxls',
		},
		{
			name:'downloadAppBaixing2',
			path: "/pages/download/download-app-baixing2/download-app-baixing2",
			aliasPath: '/download-app-baixing2',
		},
		{
			name:'downloadAppLawyer',
			path: "/pages/download/download-app-lawyer/download-app-lawyer",
			aliasPath: '/download-app-lawyer',
		},
		{
			name:'downloadAppLawyer2',
			path: "/pages/download/download-app-lawyer2/download-app-lawyer2",
			aliasPath: '/download-app-lawyer2',
		},
		{
			name:'downloadAppLawyer3',
			path: "/pages/download/download-app-lawyer3/download-app-lawyer3",
			aliasPath: '/download-app-lawyer3',
		},
		{
			name:'downloadAppLawyer4',
			path: "/pages/download/download-app-lawyer4/download-app-lawyer4",
			aliasPath: '/lawyerapp',
		},
		{
			name:'openAppLawyerList',
			path: "/pages/module-common/open-lawyerClient-list/open-lawyerClient-list",
			aliasPath: '/open-lawyerClient-list',
		},
		{
			name: 'downloadAppQiye',
			path: "/pages/download/download-app-qiye/download-app-qiye",
			aliasPath: '/download-app-qiye',
		},
		{
			name: 'shareDownloadQiyeApp',
			path: "/pages/download/share-download-qiye/share-download-qiye",
			aliasPath: '/share-download-qiye',
		},
		// 抢单说明
		{
			name: 'grabOrderExplain',
			path: "/pages/module-common/grab-order-explain/grab-order-explain",
			aliasPath: '/grab-order-explain',
		},
		// 律师端隐私协议
		{
			name: 'lawyerPrivacyProtocol',
			path: "/pages/module-common/lawyer-privacy-protocol/lawyer-privacy-protocol",
			aliasPath: '/lawyer-privacy-protocol',
		},
		// 律师端用户协议
		{
			name: 'lawyerUserProtocol',
			path: "/pages/module-common/lawyer-user-protocol/lawyer-user-protocol",
			aliasPath: '/lawyer-user-protocol',
		},
		// 律师端认证协议
		{
			name: 'lawyerApproveProtocol',
			path: "/pages/module-common/lawyer-approve-protocol/lawyer-approve-protocol",
			aliasPath: '/lawyer-approve-protocol',
		},
		// 企业认证常见问题
		{
			name: 'enpristerApproveRemitIssue',
			path: "/pages/module-common/enprister-approve-remitIssue/enprister-approve-remitIssue",
			aliasPath: '/enprister-approve-remitIssue',
		},
		// 企业认证常见问题详情
		{
			name: 'enpristerApproveRemitIssueDetail',
			path: "/pages/module-common/enprister-approve-remitIssueDetail/enprister-approve-remitIssueDetail",
			aliasPath: '/enprister-approve-remitIssueDetail',
		},
		// 百姓律师帖子发布规则
		{
			name: 'baixingDynPublishRule',
			path: "/pages/module-common/baixing-dyn-publishRule/baixing-dyn-publishRule",
			aliasPath: '/baixing-dyn-publishRule',
		},
		// 百姓律师帖子发布规则
		{
			name: 'baixingEntrustPublishRule',
			path: "/pages/module-common/baixing-entrust-publishRule/baixing-entrust-publishRule",
			aliasPath: '/baixing-entrust-publishRule',
		},
		// 律师端收益规则
		{
			name: 'lawyerIncomeRule',
			path: "/pages/module-common/lawyer-income-rule/lawyer-income-rule",
			aliasPath: '/lawyer-income-rule',
		},
		{
			name: 'protocolTmp',
			path: "/pages/module-common/protocol-tmp/protocol-tmp",
			aliasPath: '/protocol-tmp',
		},
		{
			name: 'causeSourceUnion',
			path: "/pages/module-common/cause-source-union/cause-source-union",
			aliasPath: '/cause-source-union',
		},
	]
});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
	next();
});

// 全局路由后置守卫
router.afterEach((to, from) => {
	console.log('跳转结束')
})

export {
	router,
	RouterMount
}
