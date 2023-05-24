<template>
	<view class="page relative">
		<view class="safe-content">1.如何计算服务时间  订单支付成功不会开始算时间只有律师确认受理订单，首次文字聊天、首次通话才开始算时间的。1天是指24小时</view>
		<view class="safe-hint">举例: 8点订单支付成功，8点过5分律师受理订单，24小时后是第二天的8点过5分到期</view>
		<view class="safe-content">2.律师未接单、未提供服务前，经申请同意后，平台根据服务态度、法律解答专业度、及时性 等标准衡量，同意后可以更换律师，直到满意为止。原服务律师不支付费用</view>
		<view class="safe-content">3.服务结束，用户点击验收按钮。若未点击，24小时后系统自动验收</view>
		<view class="safe-content">4.用户不满意退款，需律师同意。如平台介入，综合评判服务态度、法律解答专业度、及时性 等标准衡量</view>
		<view class="gap marlr32 top40"></view>
<!-- 		<view class="safe-content">因在线法律服务的特殊性，提升用户信任度，在线接单需加入<text>诚信保障计划</text></view>
		<view class="safe-content">用户与平台认证律师建立联系，后续产生任何法律服务交易(不限于平台内或线下支付)经司法局、律协认定违规并已注明赔付金额，平台将先行赔付</view>
		<view class="safe-content">仅限已加入诚信保障计划的律师，赔付上限不超过该服务律师缴纳的保障金</view>
		<view class="safe-content">适用温州律快答网络科技有限公司旗下平台，包含但不限于百姓律师、律付云、企业律云</view> -->
		<view class="top40 relative" style="z-index: 2;">
			<view class="tips">
				<view class="flex  hcenter">
					<view class="dot"></view>
					<view class="test">深度咨询</view>
				</view>
				<view class="marlr32">等待接单-律师确认-等待律师联系-开始计时-验收-评价</view>
			</view>
			<view class="tips">
				<view class="flex hcenter">
					<view class="dot"></view>
					<view class="test">合同文书/诉讼委托流程</view>
				</view>
				<view class="marlr32">等待接单-律师确认-等待律师联系-开始计时-验收-评价</view>
			</view>
			
		</view>


	</view>
</template>

<script>
	import {
		getUser
	} from "@/apis/apis.js"
	// import storePop from "@/components/storePop.vue"
	export default {
		components:{
			// storePop
		},
		data() {
			return {
				maskShow:false,
				attestPop:false,
				type:uni.getStorageSync('type'),
				is_guarantee:uni.getStorageSync('is_guarantee')
			}
		},
		methods: {
			showMask(){
				this.maskShow = true
			},
			pay(){
				//调起APP端支付功能
				// 由于对象映射，所以调用AppProxyClick对象等于调用Android映射的对象
				AppProxyClick.pay();
			},
			// storePopDown(val){
			// 	this.attestPop=val
			// 	this.is_guarantee = uni.getStorageSync('is_guarantee')
			// }
		},
		onLoad() {
			getUser().then(res=>{
				if(res.data.code==0){
					uni.setStorage({
						key: "type",
						data: res.data.data.type
					})
					uni.setStorage({
						key: "is_guarantee",
						data: res.data.data.is_guarantee
					})
				}
			})
		}
	}
</script>
<style scoped>
	page{
		background: #F5F7FA;
	}
	.page{
		/* padding-bottom: 300rpx; */
	}

	.tips{
		z-index: 2;
		font-size: 30upx;
		line-height: 48upx;
		color: #687085;
		margin-bottom: 20upx;
	}
	.tips .test{
		color: #14284A;
		font-size: 30rpx;
		font-weight: 800;
		width: calc(100% - 80upx);
	}
	.tips .dot{
		width: 12upx;
		height: 12upx;
		border-radius: 50%;
		border: 6rpx solid #0061FF;
		background: #fff;
		margin: 0 10upx 0 43upx;
	}
	.tips text{
		color: #FF6E57;
		// text-decoration:underline;
	}
	.gap{
		border-bottom: 1rpx solid #DDE4EE;
	}
	.line{
		width: calc(100% - 32rpx);
		height: 1rpx;
		background: #DCE3EF;
		margin-top: 12rpx;
	}
	.safe-content-imgs-title{
		font-size: 28rpx;
		font-weight: bold;
		color: #383F50;
	}
	.safe-content-imgs{
		padding-left: 33rpx;
	}
	.safe-content{
		margin: 40rpx 32rpx 0 32rpx;
		font-size: 30rpx;
		font-weight: bold;
		line-height: 56rpx;
		color: #14284A;
	}
	.safe-content text{
		color: #FF6E57;
	}
	.safe-hint{
		margin: 16rpx 32rpx 0 32rpx;
		font-size: 28rpx;
		line-height: 44rpx;
		color: #6E7695;
	}
	.safe-title{
		margin-top: 69rpx;
		line-height: 45rpx;
		font-size: 32rpx;
		font-weight: 800;
		color: #222222;
		 
	}
	.safe-title-before{
		width: 16rpx;
		height: 28rpx;
		background: #5C90F9;
		border-radius: 0px 6rpx 6rpx 0px;
		margin-right: 16rpx;
	}


</style>
