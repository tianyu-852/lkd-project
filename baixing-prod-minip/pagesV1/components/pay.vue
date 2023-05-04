<template>
	<view>
		<u-popup v-model="status" mode="bottom" border-radius="40" @close="down">
			<view class="payBox">
				<image src="/static/images/nav_tj_icon.png" class="close" @click="status=false" mode=""></image>
				<view class="h2 font36 bold center">请输入支付金额</view>
				<view class="font32">输入金额</view>
				<input type="digit" placeholder="输入金额" class="input" @input="oninput" :maxlength="moneyMaxLeng" :adjust-position="false" @focus="onFocus" @blur="onBlur" v-model="val"/>
				<view class="font28">可用余额{{balance}}元</view>
				<textarea class="textarea martop20" placeholder="添加备注(50字以内)" @focus="onFocus" @blur="onBlur" :adjust-position="false" maxlength="50" v-model="remark" placeholder-style="color:#B7BFD1"/>
				<view class="martop40 flex between relative">
					<view class="button gary" @click="toLink('/my/walletPay')">充值</view>
					<view class="button blue" @click="getMoney">支付</view>
					<view class="tag">限时补贴</view>
				</view>
				<view :style="{height:input.height+'px'}" v-if="input.status"></view>
			</view>
		</u-popup>
		<u-popup mode="center" v-model="password.status" border-radius="56">
			<view class="passwordBox relative">
				<image src="/static/images/nav_tj_icon.png" class="close" mode="widthFix" @click="password.status=false"></image>
				<view class="passWordText center" v-if="is_set_deal_password==0">{{password.code1?'请再次输入密码':'请设置支付密码'}}</view>
				<view class="passWordText center" v-if="is_set_deal_password==1">请输入支付密码</view>
				<view class="passWordNum center" v-if="is_set_deal_password==1">￥<text>{{val}}</text></view>
				<u-message-input :maxlength="6" dot-fill :focus="password.inputStatus" @finish="setCode"></u-message-input>
				<view class="passWordHint" v-if="is_set_deal_password==0">{{passWordHint}}</view>
				<view class="passWordLink font30 bold" v-if="is_set_deal_password==1" @click="toLink('/my/settings/setPassword')">忘记密码？</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getPay,
		getPayLawOrder,
		getMyData,
		setTransactionPassword
	} from "@/api/apis.js"
	export default {
		// name:"pay",
		props:{
			userId:String,
		},
		data() {
			return {
				status: false,
				inputStatus: false,
				balance:'',
				moneyMaxLeng:5,
				val: null,
				passWordHint:'请输入六位不同数字的密码',
				is_set_deal_password: 0,
				remark: '',
				input:{
					status: false,
					height: 0
				},
				password: {
					status: false,
					inputStatus: false,
					code1: null,
					code2: null,
					value: '',
				}

			};
		},
		methods:{
			toLink(e){
				uni.navigateTo({
					url:e
				})
			},
			down(){
				this.$emit('close',0);
			},
			setCode(e) {
				console.log(e)
				if(this.is_set_deal_password){//有设置过密码
					getPayLawOrder({transferred_user_id:this.userId,transfer_money:this.val,remark:this.remark}).then(res=>{
						if(res.data.code==0){
							getPay({
								type:0,
								order_no:res.data.data.order_no,
								deal_password:e
							}).then(res=>{
								if(res.data.code==0){
									uni.$u.toast('支付成功')
									this.password.status = false;
									this.status = false;
									this.val='';
									this.getBalance()
									this.$emit('close',1);
								}else{
									uni.$u.toast(res.data.message)
								}
							})
						}else{
							uni.$u.toast(res.data.message)
						}
					})
					return
				}
				if (!this.password.code1) {
					console.log('再次输入')
					this.password.status = false;
					this.password.code1 = e;
					this.passWordHint='请再次输入密码'
					setTimeout(()=>{
						this.password.status = true;
					},500)
					return
				}
				this.password.status = false;
				if (this.password.code1 == e) {
					setTransactionPassword({
						deal_password:e
					}).then(res => {
						console.log(res)
						this.is_set_deal_password = true;
						uni.setStorage({
						    key: 'is_set_deal_password',
						    data: 1,
						    success: function () {
								uni.$u.toast('设置成功')
						    }
						});
					})
					this.password.code1 = null
					return
				}
				this.password.code1 = null
				this.passWordHint='两次密码不一致'
				uni.$u.toast('两次密码不一致')
			},
			getMoney() {
				// if(!uni.getStorageSync('is_auth')){
				// 	uni.$u.toast('请下载APP完成实名认证')
				// 	return
				// }
				if(!this.val){
					uni.$u.toast('请输入支付金额')
					return
				}
				if(this.val<=0){
					uni.$u.toast('提现金额不能少于0元')
					return
				}
				if(parseInt(this.balance)<parseInt(this.val)){
					uni.$u.toast('余额不足,请充值')
					return
				}
				uni.getStorage({
					key: 'is_set_deal_password',
					complete: res => {
						this.is_set_deal_password = res.data;
						this.password.status = true;
						setTimeout(() => {
							// this.getBalance();
							this.password.inputStatus = true;
						}, 100)
						if (res.data) { //有交易密码
							
							return
						}
					}
				});
			},
			getBalance(){
				getMyData().then(res=>{
					if(res.data.code==0){
						this.balance=res.data.data.balance
						uni.setStorage({
							key: "balance",
							data: res.data.data.balance
						})
					}
				})
			},
			onFocus(e){
				console.log(e)
				this.input.status=true
				this.input.height=e.detail.height
			},
			onBlur(e){
				this.input.status=false
			},
			oninput(e) {
				this.$nextTick(() => {
					let val = e.target.value.toString();
					val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
					val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
					val = val.replace(/^0+\./g, '0.');
					val = val.match(/^0+[1-9]+/) ? val = val.replace(/^0+/g, '') : val
					val = (val.match(/^\d*(\.?\d{0,2})/g)[0]) || ''
			
					if (val.includes(".")) {
						let numDian = val.toString().split(".")[1].length;
						if (numDian === 2) {
							this.moneyMaxLeng = val.length;
						}
					} else {
						this.moneyMaxLeng = 8;
					}
					this.val = val;
				});
			}
		},
		onReady() {
			this.balance=uni.getStorageSync('balance')
		}
	}
</script>

<style lang="scss" scoped>
	.payBox {
		padding: 32rpx 32rpx 56rpx;
		.close{
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			top: 32rpx;
			left: 32rpx;
		}
		.input{
			height: 69rpx;
			font-size: 56rpx;
			font-weight: bold;
			color: #222222;
			padding-bottom: 28rpx;
			margin: 14rpx 0 20rpx;
			border-bottom: 1px solid #ECEFF4;
		}
		.textarea{
			width: calc(100% - 64rpx);
			height: 152rpx;
			background: #F5F7FA;
			border-radius: 8rpx;
			padding: 24rpx 32rpx;
		}
		.h2 {
			margin-bottom: 56rpx;
		}
		.button{
			width: calc(50% - 15rpx);
			height: 88rpx;
			line-height: 88rpx;
			font-size: 32rpx;
			text-align: center;
			border-radius: 20rpx;
		}
		.tag{
			width: 148rpx;
			height: 36rpx;
			line-height: 36rpx;
			text-align: center;
			color: #fff;
			font-size: 20rpx;
			background: linear-gradient(39deg, #FB1A5A 0%, #FE8D2E 100%);
			border-radius: 16rpx 2rpx 16rpx 4rpx;
			position: absolute;
			top: -22rpx;
			left: -16rpx;
		}
		.blue{
			color: #FFFFFF;
			background: linear-gradient(270deg, #2A68F9 0%, #5191FF 100%);
			box-shadow: 0px 4rpx 16rpx rgba(0, 44, 220, 0.3);
		}
		.gary{
			color: #3764FF;
			background: #EFF1FF;
		}
	}
	.passwordBox {
		padding: 32rpx 36rpx 42rpx;
		.close{
			width: 48rpx;
			position: absolute;
			top: 32rpx;
			left: 24rpx;
		}
		.passWordText {
			font-size: 34rpx;
			font-weight: bold;
			margin-bottom: 80rpx;
			color: #14284A;
		}
		.passWordHint{
			font-size: 30rpx;
			font-weight: bold;
			color: #5B6A91;
			margin: 80rpx 0;
			text-align: center;
		}
		.passWordNum{
			font-size: 50rpx;
			font-weight: 800;
			padding-bottom: 80rpx;
			border-bottom: 1rpx solid #ECEFF4;
			margin-bottom: 40rpx;
			text{
				font-size: 80rpx;
				font-weight: 500;
			}
		}
		.passWordLink{
			color: #5B6A91;
			text-align: right;
			margin-top: 50rpx;
		}
	}
</style>
