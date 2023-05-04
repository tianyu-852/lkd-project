<script>
	// #ifndef MP-KUAISHOU
	import { imF } from "im/im.js"
	// #endif
	import { getConfig, getUserProtocol, getLocation } from "api/apis.js"
	import { initHeader } from "request.js"
	import { mapState, mapGetters, mapActions } from 'vuex';
	import { initEid } from '@/pages/module-common/mp_ecard_sdk/main';

	export default {
		globalData: {
			list: [],
			// #ifndef MP-KUAISHOU
			imF: imF,
			// #endif
			there: null, //当选择地址，
			config: {},
			protocol: {},
			location: null, //当前所在城市
		},
		onLaunch() {
			// #ifndef MP-WEIXIN
			uni.hideTabBar()
			// #endif
			
			// #ifdef MP-WEIXIN
			this._checkUpdateApp();
			// #endif
			this.getSystemInfoAction(); // 获取系统信息
			this.getAppConfigInfoAction(); // 获取 app 配置信息
			// 初始化腾讯 人脸核身 E证通
			initEid();

			// 监听全局的轻提示事件
			uni.$on('toastEvt', data => {
				const { evtType, msg } = data;
				msg && this.$u.toast(data.msg);
				
				// 登录成功后从新调取上个页面的 onload 方法
				if (evtType === 'loginSuc') {
					const pages = getCurrentPages();
					const lastpage = pages[pages.length - 2];
					lastpage.onLoad();
				}
			});

			// 获取 app 配置信息
			getConfig().then(res => {
				getApp().globalData.config = res.data.data
			})
			
			getUserProtocol().then(res => {
				getApp().globalData.protocol = res.data.data
			})
			
			uni.getProvider({
				service: "oauth",
				success: serve => {
					uni.setStorage({
						key: 'provider',
						data: serve.provider[0]
					})
				}
			});

			// #ifndef MP-KUAISHOU
			uni.getStorageSync('token') ? imF(this) : null;
			// #endif
			
			uni.addInterceptor('uploadFile', {
				invoke(args) {
					const start = args.url.indexOf('api')
					args.header = initHeader(args.url.substr(start),args.formData,args.header)
					// console.log(args)
				},
				success(args) {
				}
			})

			uni.addInterceptor('navigateBack', {
			  invoke(args) { },
			  success(args) {
					console.log(JSON.stringify(args))
			  },
			  fail(err){
				 uni.switchTab({
				 	url:'/pages/v1/index'
				 })
			  }
			})

			let last = ''
			uni.addInterceptor('navigateTo', {
			  invoke(args) {
				// navigateTo 触发前拼接 url 
				// last = getCurrentPages().slice(-1)[0].$page.fullPath
				
				console.log(JSON.stringify(args),last)
				if(last == args.url || getCurrentPages().slice(-1)[0].$page.fullPath == args.url){
					console.log(getCurrentPages().slice(-1)[0].$page.fullPath)
					args.url = ''
				}
				last = args.url
			  },
			  success(args) {
				setTimeout(res => {
					last = ''
				},200)
				console.log(JSON.stringify(args))
			  }, 
			  fail(err) {
			  }, 
			  complete(res) {
			  }
			})

			// #ifndef H5
			uni.getSetting({
				scope:'scope.userLocation',
				success:res =>{
					if(res.authSetting['scope.userLocation'])
						uni.getLocation({
							success: res => {
								getLocation({
									lng: res.longitude,
									lat: res.latitude
								}).then(res => {
									var there = {
										province_id:res.data.data.provinceId,
										city_id:res.data.data.cityId,
										city:res.data.data.city
									}
									uni.setStorage({
										key: 'there',
										data: there,
									});
									uni.setStorage({
										key: 'provinceId',
										data: res.data.data.provinceId,
									});
									uni.setStorage({
										key: 'cityId',
										data: res.data.data.cityId,
									});
									uni.setStorage({
										key: 'cityName',
										data: res.data.data.city,
									});
									this.$scope.location = {
										province_id:res.data.data.provinceId,
										city_id:res.data.data.cityId,
										city:res.data.data.city
									}
									// console.log(this.$scope.location)
								})
							}
						})
				}
			})
			// #endif
		},
		onShow(query) {
			// 小程序二维码扫码进入
			if (query.query.scene) {
				const leagueSellerId = query.query.scene;
				// 设置加盟商销售 id
				this.setLeagueSellerInfoAction({ leagueSellerId })
			}
		},
		methods: {
			...mapActions(['getSystemInfoAction', 'getAppConfigInfoAction', 'setLeagueSellerInfoAction']),
			/**
			 * 检查更新小程序
			 */
			_checkUpdateApp() {
				const updateManager = uni.getUpdateManager(); // 版本更新管理器
				if (uni.canIUse('getUpdateManager')) {
					// 监听向微信后台请求检查更新结果事件
					updateManager.onCheckForUpdate(res => {
						if (res.hasUpdate) {
							// 新的版本下载成功后回调
							updateManager.onUpdateReady(() => {
								uni.showModal({
									title: '更新提示',
									content: '新版本已经准备好，是否重启应用？',
									confirmText: '立即体验',
									confirmColor: '#2F84EB',
									cancelColor: '#666',
									success: res => {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										res.confirm && updateManager.applyUpdate();
									}
								});
							});
							// 新的版本下载失败回调
							updateManager.onUpdateFailed(() => {
								uni.showModal({ title: '新版本上线啦', content: '请您删除当前小程序, 重新搜索打开哟', confirmColor: '#2F84EB', showCancel: false });
							});
						}
					});
				} else {
					uni.showModal({ title: '提示', content: '当前微信版本过低, 无法使用该功能, 请升级到最新微信版本后重试', confirmColor: '#2F84EB', showCancel: false });
				}
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
	@import "@/common/style/common.scss";
</style>
