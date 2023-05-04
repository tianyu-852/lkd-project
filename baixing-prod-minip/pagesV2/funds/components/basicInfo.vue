<template>
	<view>
		<view class="cell flex-row" v-if="hideimg">
			<text class="left">姓名</text>
			<u-input v-model="nickname" :clearable="false" height="56" placeholder="请输入您的姓名" class="center" />
		</view>
		<view class="cell flex-row" v-if="hideimg">
			<text class="left">常用手机号</text>
			<u-input height="56" :clearable="false" type="number" maxlength="11" placeholder="请输入您的手机号" class="center" v-model="mobile" />
			<text class="right" @tap="getCode">{{tips}}</text>
			<u-verification-code @end="end" @start="start" ref="uCode" change-text="重新发送(Xs)" @change="codeChange">
			</u-verification-code>
		</view>
		<view class="cell flex-row" v-if="hideimg">
			<text class="left">验证码</text>
			<u-input v-model="code" :clearable="false" height="56" type="number" maxlength="6" placeholder="验证码" class="center" />
		</view>
		<view class="cell flex-row" v-if="!hideLawyer">
			<text class="left">指定代理律师</text>
			<u-input v-model="lawyerInfo.nickname" :clearable="false" height="56" type="number" placeholder="指定代理律师(选填)" class="center" disabled/>
			<image src="/pagesV2/static/images/ic_ck.svg" class="rightImg" @click="toFindLawyer"></image>
		</view>
		<view class="flex-row imgList" v-show="!hideimg">
			<u-upload :header="header" name="image" height="235" width="318" :action="action1" max-count="1" :file-list="showList1"
				@on-success="upload1" del-bg-color="rgba(0, 0, 0, 0.36)" :custom-btn="true">
				<view slot="addBtn" class="slot-btn">
					<image src="/static/images/khba_image.svg" mode=""></image>
					<text>上传身份证人像面</text>
				</view>

			</u-upload>
			<u-upload :header="header" name="image" height="235" width="318" :action="action2" max-count="1" :file-list="showList2"
				@on-success="upload2" del-bg-color="rgba(0, 0, 0, 0.36)" :custom-btn="true">
				<view slot="addBtn" class="slot-btn">
					<image src="/static/images/khba_image.svg" mode=""></image>
					<text>上传身份证国徽面</text>
				</view>
			</u-upload>
		</view>
	</view>
</template>

<script>
	import {
		sendFRLitigantSMS,
		sendFRLitigantCreatorSMS
	} from "@/api/apis.js";
	import {
		server
	} from "@/request.js"
	export default {

		props: {
			type: String,
			id_card_back_image:String,
			id_card_front_image:String,
			hideimg:Boolean,
			hideLawyer:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				header: {
					"Authorization": uni.getStorageSync('token')
				},
				tips: '',
				mobile: '',
				nickname: '',
				code: '',
				action1: this.type == '创建人' ? `${server}api/fundraising-registration/id-card/front` :
					`${server}api/common/image`,
				action2: this.type == '创建人' ? `${server}api/fundraising-registration/id-card/back` :
					`${server}api/common/image`,
				showList1:this.id_card_front_image==''||this.id_card_front_image==undefined?[]:[{url:this.id_card_front_image}],
				showList2:this.id_card_back_image==''||this.id_card_back_image==undefined?[]:[{url:this.id_card_back_image}],
				fileList1: [],
				fileList2: [],
				lawyerInfo:{}
			}
		},
		methods: {
			toFindLawyer(){
				uni.navigateTo({
					url: "/pagesV2/findLawyer/findLawyer",
					events: {
						setLawyer: data => {
							console.log(JSON.stringify(data))
							this.lawyerInfo = data
						}
					}
				
				})
			},
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.mobile.length < 11) {
					this.$u.toast('请填写正确手机号');
					return
				}
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					if (this.type == "当事人") {
						sendFRLitigantSMS({
							mobile: this.mobile
						}).then(res => {
							uni.hideLoading();
							if (res.data.code == 0) {
								this.$u.toast('验证码已发送');
								// 通知验证码组件内部开始倒计时
								this.$refs.uCode.start();
							} else {
								this.$u.toast('验证码发送失败请重试');
								console.log(res)
							}
						}, res => {
							uni.hideLoading();
							this.$u.toast('验证码发送失败请重试');
						})

					} else if (this.type == "创建人") {
						sendFRLitigantCreatorSMS({
							mobile: this.mobile
						}).then(res => {
							uni.hideLoading();
							if (res.data.code == 0) {
								this.$u.toast('验证码已发送');
								// 通知验证码组件内部开始倒计时
								this.$refs.uCode.start();
							} else {
								this.$u.toast('验证码发送失败请重试');
								console.log(res)
							}
						}, res => {
							uni.hideLoading();
							this.$u.toast('验证码发送失败请重试');
						})
					}
					// setTimeout(() => {
					// 	uni.hideLoading();
					// 	// 这里此提示会被this.start()方法中的提示覆盖
					// 	this.$u.toast('验证码已发送');
					// 	// 通知验证码组件内部开始倒计时
					// 	this.$refs.uCode.start();
					// }, 2000);
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
			end() {
				// this.$u.toast('倒计时结束');
			},
			start() {
				// this.$u.toast('倒计时开始');
			},
			upload1(data, index, lists, name) {
				console.log(index, lists, name)
				if (data.code == 1009) {
					uni.navigateTo({
						url: "/pagesV1/common/login"
					})
				} else {
					this.fileList1[0] = lists[0].response.data.url
					this.$emit("upload", this.fileList1.concat(this.fileList2))
				}

			},

			upload2(data, index, lists, name) {
				console.log(data,index, lists, name)
				
				if (data.code == 1009) {
					uni.navigateTo({
						url: "/pagesV1/common/login"
					})
				} else {

					this.fileList2[0] = lists[0].response.data.url
					this.$emit("upload", this.fileList1.concat(this.fileList2))
				}

			}
		},
		mounted() {

		}
	}
</script>

<style scoped lang="scss">
	
	/deep/ .u-preview-wrap {
		// border: 0px !important;
		margin: 0 !important;
	}

	.imgList {
		margin: 16upx 0 0 14upx;

		.u-list-item {
			margin: 0 !important;
		}

		.slot-btn {
			height: 235upx;
			width: 318upx;

			image {
				height: 235upx;
				width: 340upx;
			}

			text {
				display: block;
				text-align: center;
				font-size: 26upx;
				color: #888D98;
				margin-top: -15upx;
			}
		}
	}

	.cell {
		margin: 0 32upx;
		padding: 21upx 0;
		font-size: 30upx;
		 
		color: #222222;
		border-bottom: 1px solid #ECEFF4;
		line-height: 56upx;

		.left {
			width: 208upx;
			opacity: 1;
		}
		.rightImg{
			width: 14upx;
			height: 22upx;
			margin: auto;
		}
		.center {
			// margin-left: 38upx;
			display: block;
			line-height: 56upx;
			flex: 1;
		}

		.right {
			padding: 0 14upx;
			min-width: 148upx;
			// display: block;
			text-align: center;
			line-height: 56upx;
			height: 56upx;
			background: #0061FF;
			opacity: 1;
			font-size: 24upx;
			color: #FFFFFF;
			border-radius: 4upx;
		}
	}
</style>
