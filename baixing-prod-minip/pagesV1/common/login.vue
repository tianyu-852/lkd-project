<template>
	<view>
		<!-- #ifndef MP-TOUTIAO -->
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" back-icon-color="#fff" immersive title="登录" title-color="#333" :background="{ backgroundColor: 'transparent' }">
      <view class="navbar-slot">
        <u-icon name="arrow-left" color="#333" size="40" :custom-style="{ padding: '0 24rpx;' }" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>
    <!-- #endif -->

		<view class="page hcenter flexcenter flex">
			<view class="center col100">
				<view class="">
					<image class="logo" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202317-1673068488073-pxS4H5.png" />
				</view>
				
				<view class="marlr32" style="margin: 0 60rpx;">
					<!-- #ifdef MP-TOUTIAO -->
					<button class="sys_btn" open-type="getPhoneNumber" lang="zh_CN" @getphonenumber="userLogin">授权手机号快捷登录</button>
					<!-- #endif -->

					<!-- #ifdef MP-WEIXIN -->
					<button class="sys_btn" open-type="getPhoneNumber" lang="zh_CN" @getphonenumber="userLogin">授权手机号快捷登录</button>
					<!-- #endif -->
					
					<!-- #ifdef MP-KUAISHOU -->
					<button class="sys_btn" open-type="getPhoneNumber" lang="zh_CN" @getphonenumber="userLogin">授权手机号快捷登录</button>
					<!-- #endif -->
					
					<!-- #ifdef H5  -->
					<button class="sys_btn" :disabled="disabled" @click="userLogin">登录授权</button>
					<!-- #endif -->
				</view>

				<view class="foot color888D98 center widthAll">
					<text>登录代表您已同意</text>
					<text style="color: #0085FF;" @click="routerToWebView(appConfigInfo.user_service)">《百姓律师用户协议》</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {
	getOpenId,
	//#ifdef H5
	getH5Login,
	//#endif
	//#ifdef MP-WEIXIN
	getwxLogin,
	//#endif
	//#ifdef MP-TOUTIAO
	getTTLogin,
	//#endif
	//#ifdef MP-KUAISHOU
	getksLogin,
	//#endif
	getMyData
} from "@/api/apis.js"
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
	data() {
		return {
			code:'', // 小程序 code
			url:'', // 用户协议
			disabled: true
		}
	},
	computed: {
		...mapState(['appConfigInfo', 'leagueSellerInfo']),
	},
	onLoad() {
		// #ifndef H5
		this.url = getApp().globalData.protocol.user_service
		this.getCode();
		// #endif

		// #ifdef H5
		this.isWeixin = this.isWechat()
		if(this.isWeixin) {
			console.log("微信浏览器")
			this.checkWeChatCode()//通过微信官方接口获取code之后，会重新刷新设置的回调地址【redirect_uri】
		}
		// #endif
	},
	methods: {
		// #ifndef H5
		/**
		 * 获取小程序 code
		 */
		getCode() {
			uni.getProvider({
				service: "oauth",
				success: serve => {
					uni.login({
						provider: serve.provider[0],
						success: code => {
							this.code = code;
						},
						fail: error => {
							console.log(error)
						}
					})
				}
			});
		},
		/**
		 * 获取用户信息
		 */
		getInfo(login, param) {
			login(param).then(res => {
				this.setInfo(res)
			})
		},
		// #endif
		/**
		 * 用户登录
		 */
		userLogin(e) {
			uni.showLoading({ title: '登录中' })
			console.log(e)
			//#ifdef MP-WEIXIN
			if(!e.detail.encryptedData || !e.detail.iv) {
				uni.$u.toast('请重新授权登录')
				this.getCode();
				return
			}
			// 获取小程序 openid 
			getOpenId({ code: this.code.code }).then(openId => {
				// console.log(openId, 'code信息')
				const param = {
					session_key: openId.data.data.session_key,
					openid: openId.data.data.openid,
					unionid: openId.data.data.unionid,
					mobile_encrypted: e.detail.encryptedData,
					mobile_iv: e.detail.iv,
					sales_user_id: this.leagueSellerInfo.leagueSellerId || '',
				}
				// 小程序登录
				this.getInfo(getwxLogin, param)
			})
			//#endif

			// #ifdef MP-KUAISHOU
			if(!e.detail.encryptedData||!e.detail.iv) {
				uni.$u.toast('请重新授权登录')
				this.getCode();
				return
			}
			const param = {
				encrypted: e.detail.encryptedData,
				iv: e.detail.iv,
				code: this.code.code
			}
			getksLogin(param).then(res => {
				if (!res.data.code) {
					console.log(res,'快手登录返回')
					this.setInfo(res)
				}
			})
			// #endif

			//#ifdef MP-TOUTIAO
			uni.getUserInfo({
				success: res => {
					const param = {
						encrypted: e.detail.encryptedData,
						iv: e.detail.iv,
						code: this.code.code,
						avatar: res.userInfo.avatarUrl,
						nickname: res.userInfo.nickName
					}
					this.getInfo(getTTLogin, param)
				},
				fail:res=> {
					console.log('获取用户信息失败',res)
				}
			})
			//#endif

			//#ifdef H5
			this.getWeChatCode()
			//#endif
		},
		/**
		 * 缓存登录成功后的 用户信息
		 */
		setInfo(res) {
			if (!res.data.code) {
				// console.log(res,'微信登录返回')
				// 设置用户 token
				uni.setStorage({ key: "token", data: res.data.data.access_token })
				// 设置融云 token
				uni.setStorage({ key: "rong_cloud_token", data: res.data.data.rong_cloud_token })
				// 设置用户 id
				uni.setStorage({ key: "user_id", data: res.data.data.user_id })

				// #ifndef MP-KUAISHOU
				getApp().globalData.imF(this);
				// #endif

				// 登录后的用户token 存入 vuex & storage | dev: 韩宇
				this.$store.dispatch('userModule/setUserToken', res.data.data.access_token);

				setTimeout(() => {
					getMyData().then(res => {
						// 登录后的用户info 存入 vuex & storage | dev: 韩宇
						this.$store.dispatch('userModule/setUserInfoAction', res.data.data);

						//年会员=2，月会员=1
						uni.setStorage({ key: "is_vip", data: res.data.data.is_vip?res.data.data.is_year_vip + 1 : 0 })
						uni.setStorage({ key: "is_customer", data: res.data.data.is_customer })
						uni.setStorage({ key: "photo", data: res.data.data.avatar, })
						uni.setStorage({ key: "weChat", data: res.data.data.wechat_number, })
						uni.setStorage({ key: "type", data: res.data.data.type, })
						uni.setStorage({ key: "nickname", data: res.data.data.nickname })
						uni.setStorage({ key: "balance", data: res.data.data.balance })
						uni.setStorage({ key: "is_set_deal_password", data: res.data.data.is_set_deal_password })
						uni.setStorage({ key: "mobile", data: res.data.data.mobile })
						uni.setStorage({ key: "is_enterprise", data: res.data.data.is_write_enterprise })

						this.$commonUtil.backPage();
						uni.$emit('toastEvt', { evtType: 'loginSuc', msg: '登录成功' }); // 触发全局的 toast 事件
					})
					
					uni.hideLoading()
					return
				}, 500);
			}
			// console.log(res)
			//登录失败重新获取code
			this.getCode();
		},
		// #ifdef H5
		//用来判断是否是微信内置的浏览器
		isWechat() {
			return String(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) === "micromessenger";
		},
		// 用来提取code
		getUrlCode(name) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1]
				.replace(/\+/g, '%20')) || null
		},
		//检查浏览器地址栏中微信接口返回的code
		checkWeChatCode() {
			let code = this.getUrlCode('code')
			console.log('code',code)
			if (code) {
				this.getOpenidAndUserinfo(code)
			}else{
				this.disabled=false
			}
		},
		/**
		 * h5 请求微信接口，用来获取code 
		 */
		getWeChatCode() {
			let local = window.location.href; //获取当前页面地址作为回调地址
			let appid = 'wx52fd45d6c9c8f35a'
			// local=local.substring(0,local.length-2)
			console.log(local)
			uni.hideLoading()
			//通过微信官方接口获取code之后，会重新刷新设置的回调地址【redirect_uri】
			window.location.href =
				"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
				appid + 
				"&redirect_uri=" +
				local +
				"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
		},
		/**
		 * h5 把code传递给后台接口，静默登录
		 */
		getOpenidAndUserinfo(code) {
			getH5Login({code:code}).then(res => {
				console.log(res)
				if (res.data.code == 0) {
					this.setInfo(res)
				}else{
					this.$u.toast(res.data.message)
				}
			})
		},
		// #endif
		/**
		 * 前往用户协议
		 */
		toWebView(){
			uni.navigateTo({
				url:'/pagesV1/common/webview?url=' + encodeURIComponent(this.url)
			})
		},

		/**
     * 导航进入 webview
     */
    routerToWebView(webUrl) {
      if (!webUrl) return;
      this.$commonUtil.routeNavToWebView(webUrl);
    },
	}
}
</script>

<style lang="scss" scoped>
.page {
	height: 100vh;
}

.logo {
	@include element-size(206rpx, 243rpx, 0);
}

.sys_btn {
	background: #0085FF;
	border-radius: 100rpx;
	color: #FFFFFF;
	margin-top: 200rpx;
}

.foot {
	position: absolute;
	bottom: 100rpx;
}
</style>
