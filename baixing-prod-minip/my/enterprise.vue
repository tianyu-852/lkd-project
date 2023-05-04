<template>
	<view class="">
		<view class="userBox relative">
			<u-navbar title="企业信息" :border-bottom="false" :background="{'background':'transparent'}"></u-navbar>
			<view class="flex hcenter between box">
				<image :src="form.avatar || 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022826-1661502222227-96HA03.png'" class="photo" mode="aspectFill"></image>
				<view class="btn flex hcenter" @click="setPhoto">
					<image src="/static/images/sctp_icon2.png" class="width32" mode="widthFix"></image>
					<text class="left8">上传头像</text>
				</view>
			</view>
		</view>
		<view class="backfff overfHidden">
			<view class="martop80 title bottom32">
				<view class="icon"></view>
				<text>企业基本信息</text>
				<view class="link flex hcenter" @click="upLoadCover">
					<image src="/static/images/sczp_icon3.png" class="width32" mode="widthFix"></image>
					<text class="left8">上传营业执照识别</text>
				</view>
			</view>
			<view class="item flex hcenter">
				<view class="label">公司名称</view>
				<input type="text" placeholder="上传执照后识别名称" v-model="form.nickname" />
			</view>
			<view class="item flex hcenter">
				<view class="label">公司法人</view>
				<input type="text" placeholder="上传执照后识别法人" v-model="form.legal_person" />
			</view>
			<view class="item flex hcenter">
				<view class="label">企业地址</view>
				<input type="text" placeholder="上传执照后识别地址" disabled @click="toMap" v-model="form.enterprise_address"/>
			</view>
			<view class="item flex hcenter">
				<view class="label">信用代码</view>
				<input type="text" placeholder="上传执照后识别信用码" v-model="form.credit_code" />
			</view>
			<view class="center overfHidden" v-if="!form.business_license_image">
				<!-- <view class="top28 bottom32 font32 bold">营业执照</view> -->
				<!-- <image :src="form.business_license_image" class="img" mode=""></image> -->
				<view class="upLoadBox center flex hcenter flexcenter" @click="upLoadCover">
					<view class="" v-if="!form.business_license_image">
						<image src="/static/images/sctp9_icon.svg" class="width64 bottom16 top40" mode="widthFix"></image>
						<view>上传营业执照识别</view>
					</view>
					<image :src="form.business_license_image" class="widthAll" v-else mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="backfff martop12 overfHidden">
			<!-- <view class="flex hcenter between button marlr32 center">
				<view v-for="(item,index) in price" :class="['btn',priceIndex==index?'blue':'']" @click="onPrice(index,item.enterprise_vip_id)">
					<text>{{item.price}}元/{{item.title}}</text>
					<view class="tag" v-if="item.remark">{{item.remark}}</view>
				</view>
			</view> -->
			<view class="martop28 title bottom32">
				<view class="icon"></view>
				<text>使用人资料</text>
			</view>
			<view class="item flex hcenter">
				<view class="label">名字</view>
				<input type="text" placeholder="请输入使用人名称" v-model="form.represent_nickname" />
			</view>
			<view class="item flex hcenter relative">
				<view class="label">手机号码</view>
				<input type="text" class="minWidth" placeholder="请输入手机号码" disabled v-model="form.mobile" />
				<!-- <view class="codeBtn" @click="bind">换绑</view> -->
			</view>
			<!-- <view class="marlr32 flex between item1 hcenter bottom48">
				<view class="flex hcenter codeInput">
					<input type="number" placeholder="请输入验证码" v-model="form.code"/>
				</view>
				<view class="codeBtn">
					<u-verification-code ref="uCode" @change="codeChange" @end="end"></u-verification-code>
					<view :class="['Countdown',timeStatus?'activeCountdown':'']" @click="startCode">{{tips}}</view>
				</view>
			</view> -->
		</view>
		<view class="backfff martop12 overfHidden ">
			<view class="marlr32 submit center font36" @click="submit">提交认证</view>
			<view class="martop36 center bottom120">无法认证，<text class="color0061FF under" @click="toDetail">联系客服</text></view>
		</view>
		<!-- <u-popup v-model="show" mode="center" border-radius="56">
			<view class="popBox relative">
				<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_yrz_image.png" class="widthAll" mode="widthFix"></image>
				<view class="center btn absolute widthAll">
					<view class="blue" @click="toIndex(0)">立即前往律企圈</view>
					<view @click="show=0">稍后再说</view> 
				</view>
			</view>
		</u-popup> -->
		<!-- <u-popup v-model="show" mode="center" border-radius="56">
			<view class="popBox relative">
				<view class="colse" @click="show=0"></view>
				<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_zccg_image.png" v-if="popType==0" class="width600" mode="widthFix"></image>
				<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_yzc_image.png" v-if="popType==1" class="width600" mode="widthFix"></image>
				<view class="btnBox flex between">
					<button class="mask-btn" open-type="share">邀请用户支付</button>
					<view class="mask-btn on" @click="toPay">代支付</view>
				</view>
			</view>
		</u-popup> -->
		<enterprisePop ref="enterprise" :type="1"></enterprisePop>
	</view>
</template>

<script>
	import { getEnterpriseInfo, setEnterpriseInfo, upLoadLicense, getGroups, getImUserEnterprise, getPasswordSmsCode, } from "@/api/apis.js"
	import { server } from "@/request.js"
	const chooseLocation = requirePlugin('chooseLocation');
	import enterprisePop from "./components/enterprisePop.vue"

	export default {
		components: {
			enterprisePop
		},
		data() {
			return {
				// tips: null,
				// timeStatus: false,
				// show:0,
				// popType:0,
				customer:{},
				user_id:'',
				form:{}
			}
		},
		methods: {
			getUserInfo(){
				getEnterpriseInfo().then(res=>{
					if(res.data.code==0){
						this.form=res.data.data
						return
						if(this.form){
							console.log(1)
							this.form.mobile=res.data.data.mobile
						}else{
							console.log(2)
							this.form=res.data.data
						}
					}
				})
			},
			submit(){
				if(!this.form.mobile){
					uni.$u.toast('请输入手机号')
					return
				}
				if(this.form.mobile.length!=11){
					uni.$u.toast('请输入正确的手机号')
					return
				}
				setEnterpriseInfo(this.form).then(res=>{
					if(!res.data.code){
						// this.show=1
						this.$refs.enterprise.show=1
						uni.setStorage({
							key: "is_enterprise",
							data: 1
						})
						// uni.$u.toast('提交成功')
					}else{
						uni.$u.toast(res.data.message)
					}
				})
			},
			toMap(e){
				const key = 'WPHBZ-VTMW3-QWC3L-YQ2XM-5GOT7-GBBIH'; //使用在腾讯位置服务申请的key
				const referer = '企业律云'; //调用插件的app的名称
				// const location = JSON.stringify({
				// 	latitude: res.latitude,
				// 	longitude: res.longitude
				// });
				// const category = '生活服务,娱乐休闲';
				uni.navigateTo({
					url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer
				});
			},
			toDetail(){
				uni.navigateTo({
					url:`/pagesV1/info/infoDetails?id=${this.customer.user_id}&name=${this.customer.nickname}`
				})
			},
			bind(){
				uni.navigateTo({
					url: '/pages/my/bind',
					events:{
						over:res=>{
							this.form.mobile=res
						}
					}
					
				});
			},
			setPhoto() { //修改头像
				uni.chooseImage({
					count: 1,
					success: blob => {
						uni.uploadFile({
							url: `${server}api/common/image`,
							filePath: blob.tempFilePaths[0],
							header: {
								"Authorization": "test",
							},
							name: "image",
							success: res => {
								this.$set(this.form, "avatar", JSON.parse(res.data).data.url);
							}
						})
					}
				})
			},
			upLoadCover(){
				uni.chooseImage({
					count: 1,
					success: blob => {
						uni.uploadFile({
							url: `${server}api/common/image`,
							filePath: blob.tempFilePaths[0],
							header: {
								"Authorization": "test",
							},
							name: "image",
							success: res => {
								var result=JSON.parse(res.data).data.url
								this.form.business_license_image=result
								console.log(result)
								upLoadLicense({business_license_image:result}).then(res=>{
									if(res.data.code==0){
										uni.$u.toast('上传成功')
										this.form.nickname=res.data.data.nickname
										this.form.enterprise_address=res.data.data.enterprise_address
										this.form.legal_person=res.data.data.legal_person
										this.form.credit_code=res.data.data.credit_code
									}
								})
							}
						})
					}
				})
			},
			// toIndex(is){
			// 	getImUserEnterprise({is_lawyer_letter:is}).then(res=>{
			// 		if(res.data.code==0){
			// 			this.show=0
			// 			var data=JSON.stringify(res.data.data)
			// 			if(is){
			// 				uni.navigateTo({
			// 					url:`/pagesV1/info/infoDetails?id=${data.user_id}&name=${data.nickname}`
			// 				})
			// 			}else{
			// 				uni.switchTab({
			// 					url:`/pages/v1/index`
			// 				})
			// 			}
			// 		}else{
			// 			uni.$u.toast(res.data.message)
			// 		}
			// 	})
			// }
			// end() {
			// 	this.timeStatus = false
			// },
			// codeChange(text) {
			// 	this.tips = text;
			// },
			// startCode() {
			// 	if(this.form.mobile.length!=11){
			// 		uni.$u.toast('请输入正确的手机号')
			// 		return
			// 	}
			// 	if (this.$refs.uCode.canGetCode) {
			// 		this.$refs.uCode.start();
			// 		this.timeStatus = true;
			// 		getPasswordSmsCode({mobile:this.form.mobile});
			// 	}
			
			// },
			// confirm(){
			// 	this.$refs.pop.show=false
			// }
		},
		onLoad() {
			console.log(this.form)
			this.customer=uni.getStorageSync('customer')
			this.getUserInfo()
		},
		onShow() {
			const location = chooseLocation.getLocation();
			console.log(location)
			if(location){
				this.form.enterprise_address=location.address
				this.form.enterprise_lng=location.longitude
				this.form.enterprise_lat=location.latitude
			}
		},
		onShareAppMessage(e) {
			if (e.from === 'button') { // 来自页面内分享按钮
				var user_id=uni.getStorageSync('user_id')
				var share=uni.getStorageSync('share')
				console.log(user_id)
				console.log(share)
				return {
					title: share.title,
					path: `/pages/index/payVip?id=${user_id}`,
					imageUrl:share.wechat_mini_program.cover_image
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F9F9FB;
	}
	.title{
		font-size: 32rpx;
		line-height: 45rpx;
		font-weight: 900;
		padding-left: 32rpx;
		position: relative;
		.icon{
			width: 16rpx;
			height: 28rpx;
			background: #5C90F9;
			border-radius: 0rpx 6rpx 6rpx 0rpx;
			position: absolute;
			left: 0;
			top: 8rpx;
		}
		.link{
			font-size: 28rpx;
			font-weight: bold;
			color: #0061FF;
			position: absolute;
			right: 32rpx;
			bottom: 0;
		}
	}
	.userBox{
		width: 100%;
		height: 400rpx;
		padding: 0 64rpx 0 32rpx;
		background-image: url('https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/lfy_office_sy_bg.png');
		background-size: 100%;
		background-repeat: no-repeat;
		// position: absolute;
		// top:0;
		.box{
			width: calc(100vw - 96rpx);
			position: absolute;
			bottom: -32rpx;
		}
		.photo{
			width: 200rpx;
			height: 200rpx;
			border: 8rpx solid #FFFFFF;
			box-shadow: 0rpx 8rpx 20rpx rgba(0, 44, 148, 0.18);
			border-radius: 40rpx;
			background: #fff;
		}
		.btn{
			color: #fff;
			line-height: 72rpx;
			padding: 0 24rpx;
			background: linear-gradient(306deg, #4576FB 0%, #6995FE 100%);
			box-shadow: 0rpx 4rpx 16rpx rgba(0, 44, 220, 0.3);
			border-radius: 100rpx;
		}
	}
	.upLoadBox{
		width: calc(100% - 64rpx);
		height: 300rpx;
		margin: 0 auto 36rpx;
		border: 2rpx dotted #B7BFD1;
		border-radius: 8rpx;
		overflow: hidden;
		color: #6E7695;
		.widthAll{
			width: 100%;
			height: 100%;
		}
	}
	// .popBox{
	// 	.colse{
	// 		width: 70rpx;
	// 		height: 70rpx;
	// 		position: absolute;
	// 		right: 0;
	// 		top: 0;
	// 	}
	// 	.btnBox{
	// 		position: absolute;
	// 		bottom: 50rpx;
	// 		left: 36rpx;
	// 		right: 36rpx;
	// 	}
	// 	.mask-btn{
	// 		width: calc(50% - 8rpx);
	// 		background: #BEF9E0;
	// 		border-radius: 100rpx;
	// 		font-size: 34rpx;
	// 		font-weight: bold;
	// 		line-height: 90rpx;
	// 		color: #0FB56E;
	// 		text-align: center;
	// 		padding: 0;
	// 	}
	// 	.on{
	// 		color: #FFFFFF;
	// 		background: linear-gradient(90deg, #0DB46C 0%, #3ECC8F 100%);
	// 		box-shadow: 0rpx 6rpx 16rpx rgba(0, 212, 35, 0.32);
	// 	}
	// }
	
	.item{
		font-size: 28rpx;
		font-weight: 500;
		color: #14284A;
		padding: 16rpx 36rpx;
		margin: 0 32rpx 24rpx;
		border-radius: 8rpx;
		background-color: #F5F7FA;
		// &:last-child{
		// 	border-bottom: none;
		// }
		input{
			width: calc(100% - 152rpx);
		}
		.label{
			width: 132rpx;
			margin-right: 20rpx;
			border-right: 1rpx solid #B2C2DB;
		}
		.minWidth{
			width: calc(100% - 260rpx);
		}
		.codeBtn{
			color: #fff;
			line-height: 54rpx;
			padding: 0 26rpx;
			background: linear-gradient(126deg, #4B95FF 0%, #2A79FE 100%);
			border-radius: 100rpx;
			position: absolute;
			right: 24rpx;
			z-index: +1;
		}
	}
	// .button{
	// 	padding: 30rpx 0;
	// 	border-bottom: 1rpx solid #ECEFF4;
	// 	.btn{
	// 		width: 320rpx;
	// 		line-height: 56rpx;
	// 		color: #3764FF;
	// 		border: 2rpx solid #3764FF;
	// 		border-radius: 8rpx;
	// 		position: relative;
	// 	}
	// 	.blue{
	// 		color: #fff;
	// 		background: linear-gradient(306deg, #4576FB 0%, #6995FE 100%);
	// 		border: none;
	// 	}
	// 	.tag{
	// 		position: absolute;
	// 		right: -15rpx;
	// 		top: -28rpx;
	// 		padding: 0 30rpx;
	// 		line-height: 36rpx;
	// 		background: linear-gradient(39deg, #FB1A5A 0%, #FE8D2E 100%);
	// 		border-radius: 16rpx 2rpx 16rpx 4rpx;
	// 		color: #fff;
	// 		font-size: 22rpx;
	// 	}
	// }
	// .activeCountdown {
	// 	color: #CBD5E5 !important;
	// 	border: 2rpx solid #CBD5E5 !important;
	// }
	
	// .Countdown {
	// 	font-size: 24rpx;
	// 	color: #fff;
	// 	// border: 2rpx solid #5B9BFB;
	// 	background-color: #3764FF;
	// 	border-radius: 8rpx;
	// 	padding: 8rpx 12rpx;
	// }
	
	// .item1 {
	// 	height: 72rpx;
	// 	background: #F5F7FA;
	// 	border-radius: 8rpx;
	// 	padding: 0 8rpx 0 24rpx;
	// 	input{
	// 		height: 72rpx;
	// 	}
	// 	.codeInput{
	// 		width: calc(100% - 180upx);
	// 		input{
	// 			width: calc(100% - 200upx);
	// 		}
	// 	}
	// 	.codeBtn{
	// 		max-width: 180upx; 
	// 	}
	// }
	.submit{
		line-height: 100rpx;
		color: #fff;
		background: #3764FF;
		box-shadow: 0px 12rpx 32rpx rgba(9, 58, 255, 0.4);
		border-radius: 100rpx;
		margin-top: 48rpx;
	}
</style>
