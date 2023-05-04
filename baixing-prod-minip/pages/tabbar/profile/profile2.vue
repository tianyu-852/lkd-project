<template>
	<view class="index" :style="{ paddingBottom: sysSafeAreaHeight + 50 + 5 + 'px' }">
		<u-navbar :is-back="false" :is-fixed="false" :background="{ backgroundColor: 'transparent' }" :border-bottom="false"></u-navbar>

		<view class="cell marlr32 flex">
			<view class="relative photo" @click="toLink('/my/client/heLookPage?id='+userId)">
				<image :src="token ? info.avatar : 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022826-1661502222227-96HA03.png'" mode="aspectFill"></image>
				<view class="edit" v-if="token"><u-icon name="edit-pen-fill" color="#fff"></u-icon></view>
			</view>

			<view class="left20" style="width: calc(100% - 160rpx);">
				<view class="flex between hcenter" style="height: 100%;">
					<view class="" :style="{ 'width':'calc(100% - '+ (info.is_need_write_enterprise ? 148 : 0) + 'rpx)'}">
						<view class="name line1 bottom8" @click="toLink('/my/client/mypage')">{{ token ? info.nickname : '马上登录' }}</view>
						<view class="color6E7695" v-if="token">
							<text class="" @click.stop="toFans(0)">关注</text>
							<text class="left8 color222 heavy" @click.stop="toFans(0)">{{ info.follow_number }}</text>
							<text class="left32" @click.stop="toFans(1)">粉丝</text>
							<text class="left8 color222 heavy" @click.stop="toFans(1)">{{ info.fans_number }}</text>
						</view>
					</view>
					<view class="btn colorFFF font24" v-if="info.is_need_write_enterprise">企业认证</view>
				</view>
			</view>
		</view>

		<view class="vipBox marlr32 flex between font26" v-if="info.vip_expired_time&&token&&isVip">
			<text>服务到期{{info.vip_expired_time}}</text>
			<view class="flex hcenter" @click="toLink('/my/payVip')">
				<text class="bold">{{isVip==1?'升级权益':'续费'}}</text>
				<image src="/static/images/sj_icon.png" class="width22 left8" mode="widthFix"></image>
			</view>
		</view>

		<!-- <view class="navBox backfff" v-if="token">
			<u-row gutter="16">
				<u-col span="4" v-for="(item,index) in nav" :key="index">
					<view v-if="(level&&index==3)||index==2||index==1||(token&&index==0)" class="nav-item center relative" @click="toLink(item.url)">
						<view class="sub" v-if="index==0&&info.pending_order_number">{{info.pending_order_number}}</view>
						<image :src="item.icon" class="width80" mode="widthFix"></image>
						<view class="martop20">{{item.name}}</view>
					</view>
				</u-col>
			</u-row>
		</view> -->

		<view v-if="token" class="menu-module">
			<view v-for="(nItem, nIndex) in nav" :key="nIndex" class="menu-item" @click="toLink(nItem.url)">
				<image class="menu-icon" mode="widthFix" :src="nItem.icon" />
				<view class="menu-name">{{ nItem.name }}</view>
			</view>
		</view>

		<view class="backfff hidden">
			<view v-if="token">
				<customerBox ref="customer"></customerBox>
			</view>
			<!-- #ifndef MP-KUAISHOU -->
			<view class="wallet flex hcenter between" @click="toLink('/my/wallet')" v-if="token">
				<view>
					<view class="color6E7695 bottom12">钱包余额(元)</view>
					<view class="font36 bold">{{ info.balance || 0 }}</view>
				</view>
				<view class="flex hcenter">
					<text class="font24 color6E7695">立即查看</text>
					<image src="/static/images/dj_icon.png" class="width16 left8" mode="widthFix"></image>
				</view>
			</view>
			<!-- #endif -->
			<view class="navBox">
				<!-- 导航 -->
				<view class="flex between left32">
					<view class="flex hcenter">
						<image src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022829-1661738300778-wFxkG2.png" class="width32 " mode="widthFix"></image>
						<text class="font32 bold left8">更多服务</text>
					</view>
				</view>

				<!-- 服务菜单项 -->
				<view class="menu-wrap">
					<!-- 邀请律师 -->
					<template v-if="userInfo.sales_affair && userInfo.sales_affair.user_id">
						<view class="nav-item center" @click="navToLawyerVipPage">
							<image src="/static/images/wd_kf_icon.png" class="width80 martop32" mode="widthFix" />
							<view class="font26 line1">优选邀请支付</view>
						</view>
						<!-- <view class="nav-item center" @click="navToCaseSourceVipPage">
							<image class="width80 martop32" mode="widthFix" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202319-1673228408747-45jJ7W.png" />
							<view class="font26 line1">案源邀请支付</view>
						</view> -->
					</template>
					<view v-for="(item, index) in mode" :key="index" class="menu-item">
						<button v-if="item.url == 'share'" class="nav-item center" open-type="share" :data-data="item.url">
							<image :src="item.image" class="width80 martop32" mode="widthFix" />
							<view class="font26 line1">{{ item.name }}</view>
						</button>
						<!-- 其他 -->
						<view v-else class="nav-item center" @click="toLink(item.url)">
							<image :src="item.image" class="width80 martop32" mode="widthFix" />
							<view class="font26 line1">{{ item.name }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<tab-bar :selected="4" />
	</view>
</template>

<script>
	import { jumpToUrl } from '@/common/util.js';
	import { getMyData, getCustomerGroup, getCustomerPhone, getEnterpriseCustomer, getCustomerService, getEnterpriseUser } from "@/api/apis.js";
	import customerBox from "@/components/customerBox.vue"
	import { mapState, mapGetters } from 'vuex';

	export default {
		components: {
			customerBox
		},
		data() {
			return {
				userEnterpriseInfo: {}, // 用户企业信息

				title: '我的',
				token: '',
				userId:'',
				info: {},
				config: {},
				customer:{},
				isVip: false,
				level: '',
				nav: [
					{ id: 1, url: '/my/client/orderForm', icon: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022826-1661502637399-ykbd0E.png', name: '我的订单' },
					{ id: 2, url: '/my/community', icon: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022826-1661502792672-ZTMY8W.png', name: '我的问答' },
					// { id: 3, url: '/my/payVip', icon: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022826-1661502722274-7JXxa5.png', name: '会员权益' }
				],
				mode: [
					// { id:2, image: "/static/images/wdls_icon.png", name: "认证律师", vip: 0, url: "authLawyer", },
					{ image: "https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202295-1662344687250-xsDFz2.jpg", name: "企业认证", vip: 0, url: "authEnterprise", },
					// { id: 2, image: "/static/images/wd_kf_icon.png", name: "邀请律师", vip: 0, url: "addLawyer", },
					// { id: 3, image: "/static/images/xzs_icon.png", name: "我的客服", vip: 0, url: "customer", },
					{ id: 5, image: "/static/images/icon_fx.png", name: "分享应用", vip: 0, url: "share", },
					// { id: 1, image: "/static/images/hykt_icon.png", name: "开通会员", vip: 0, url: "/my/payVip", },
					{ id: 6, image: "/static/images/hmd_icon.png", name: "黑名单", vip: 0, url: "/my/blacklist", },
					{ id: 4, image: "/static/images/yjfk_icon.png", name: "意见反馈", vip: 0, url: "/my/settings/reaction", },
					// { id:7, image: "/static/images/fp_icon.png", name: "发票", vip: 1, url: "bill", },
					// { id:8, image: "/static/images/dd_icon2.png", name: "申请合同", vip: 1, url: "deal", }
				],
			}
		},
		computed: {
			...mapState('userModule', ['userInfo']),

			...mapGetters([ 'sysSafeAreaHeight' ]),
		},
		onLoad() {},
		onShow() {
			// #ifndef MP-WEIXIN
			uni.hideTabBar()
			// #endif

			this.isVip = uni.getStorageSync('is_vip');
			this.token = uni.getStorageSync('token');
			this.userId = uni.getStorageSync('user_id');
			this.level = uni.getStorageSync('level');
			this.customer = uni.getStorageSync('customer');

			if(this.token) {
				// 获取个人信息
				this.getUserInfo();
				// 获取企业信息
				this._getEnterpriseInfo();
			}
			
			if(this.token&&this.$refs.customer) this.$refs.customer.getUnreadCount()
			// #ifndef MP-KUAISHOU
			if(this.token && !this.customer) this.getCustomer()
			// #endif
		},
		onShareAppMessage(e) {
			return {
				title:'一站式普惠法律服务',
				path: '/pages/tabbar/index/index',
				imageUrl:'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/main-share.png?324324324'
			}
		},
		methods: {
			error(e){
				console.log('公众号提示：', e.detail.errMsg);
			},
			onJump(type,id){
				uni.navigateTo({ url:'/pages/index/webview?url=https://h5.lawkd.com/service' });
			},
			/**
			 * 跳转粉丝页
			 */
			toFans(i) {
				uni.navigateTo({ url: "/my/faceAndAttention?index=" + i });
			},
			async toLink(e) {
				if(!this.token) e = '/pagesV1/common/login'

				// 我的客服
				if (e=='customer') {
					// #ifndef MP-KUAISHOU
					e='/pagesV1/info/infoDetails?id=new_1&name=官方客服'
					// #endif

					// #ifdef MP-KUAISHOU
					getCustomerPhone({ user_id: 'new_1' }).then(res=>{
						if(res.data.code==0){
							uni.makePhoneCall({ 
								phoneNumber: res.data.data.mobile
							})
						}
					})
					return
					// #endif
				}
				if (e =='deal' || e == 'bill') {
					this.toCustomerService(e=='deal'?1:0)
					return
				}
				// 认证律师
				if (e == 'authLawyer') {
					e = '/pagesV1/common/webview?color=#4a75ff&url='+encodeURIComponent('https://h5.lawkd.com/register?type=1')
				}

				// 认证企业
				if (e === 'authEnterprise') {
					if (this.userEnterpriseInfo.is_certification) {
						e = '/pages/module-profile/profile-enterprise-approveIdentity/profile-enterprise-approveIdentity'
					// step = 1, 填写完企业信息
					} else if (this.userEnterpriseInfo.step === 1) {
						e = '/pages/module-profile/profile-enterprise-approveIdentity/profile-enterprise-approveIdentity'
					// step = 2, 填写打款认证信息
					} else if (this.userEnterpriseInfo.step === 2) {
						try {
							const { data: enterpriseBankVerifyData } = await this.$api.getEnterpriseBankVerifyInfo();
							// 人脸认证方式
							if (enterpriseBankVerifyData.cert_type === 2) {
								e = '/pages/module-profile/profile-enterprise-approveIdentity/profile-enterprise-approveIdentity?verifyTypeIndex=1'
							} else {
								// 打款认证方式
								e = '/pages/module-profile/profile-enterprise-approveVerify/profile-enterprise-approveVerify'
							}
						} catch (error) {
							console.log(error);
						}
						
					} else {
						e = '/pages/module-profile/profile-enterprise-approve/profile-enterprise-approve'
					}
				}

				uni.navigateTo({ url: e });
			},

			/**
			 * 导航进入律师套餐 页面
			 */
			navToLawyerVipPage() {
				uni.navigateTo({ url: '/pages/module-common/vip-lawyer-serve/vip-lawyer-serve' });
			},

			/**
			 * 导航进入案源套餐 页面
			 */
			navToCaseSourceVipPage() {
				uni.navigateTo({ url: '/pages/module-common/vip-caseSource-serve/vip-caseSource-serve' });
			},

			toCustomerService(type){
				getCustomerService({type:type}).then(res=>{
					if(res.data.code==0){
						var data=res.data.data
						uni.navigateTo({
							url:`/pagesV1/info/infoDetails?id=${data.user_id}&name=${data.nickname}`
						})
					}
				})
			},
			getCustomer(){
				getEnterpriseCustomer().then(res=>{
					if(res.data.code==0){
						this.customer=res.data.data
						uni.setStorage({
							key:'customer',
							data:res.data.data
						})
					}
				})
			},
			/**
			 * 获取个人信息
			 */
			getUserInfo() {
				getMyData().then(res => {
					if (res.data.code==0) {
						this.info = res.data.data
						console.log(this.info);
						
						if (this.info.is_vip) {
							var date=new Date(res.data.data.vip_expired_time*1000)
							this.info.vip_expired_time=date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日'
							console.log(date.getMinutes())
						}
						
						if ((res.data.data.vip_expired_time&&!this.isVip)||(!res.data.data.vip_expired_time&&this.isVip)){
							this.isVip = res.data.data.is_vip ? res.data.data.is_year_vip + 1 :0
							uni.setStorage({ key: "is_vip", data: res.data.data.is_vip?res.data.data.is_year_vip+1:0 })
						}
					}
				})
			},
			/**
			 * 获取用户企业信息
			 */
			async _getEnterpriseInfo() {
				try {
					const { data: enterpriseData } = await this.$api.getEnterpriseInfo();
					this.userEnterpriseInfo = enterpriseData;
				} catch (error) {
					console.log(error);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
