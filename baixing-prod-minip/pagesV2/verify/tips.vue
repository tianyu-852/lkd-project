<template>
	<view class="relative" style="height: 100vh;padding-top: 57upx;">
		<image class="bg_cycle" src="/pagesV2/static/images/bg_cycle.svg"></image>
		<image class="bg_cycle1" src="/pagesV2/static/images/bg_cycle2.svg"></image>
		<view class="tips marlr32">
			筹款<text class="colorFF6E57">小技巧</text>，帮助你更快获得筹款金额，证实人越多，越容易筹到目标金额
		</view>
		<view class="cell" style="margin-top: 56upx;" v-for="item,index in info.conditions" :key="index">
			<view class="title flex-row">
				<text class="u-flex-1">{{item.title}}</text>
				<u-icon name="checkmark-circle-fill" :color="item.result?'#0061FF':'#888D98'" size="26"></u-icon>
				<text :class="[item.result?'':'color888D98','check']">{{item.result == 0?'未完成':'已完成'}}</text> 
			</view>
			<view class="flex-row blue">
				{{item.subset}}
				<image src="/pagesV2/static/images/yq_bg.svg" v-if="item.result == 0"></image>
				<button :open-type="item.share?'share':''" class="btn" :data-share="item.share" v-if="item.result == 0" @click="toAut(index)">{{index==0?'立即认证':'立即邀请'}}</button>
			</view>
		</view>
		<!-- <view class="cell"  style="margin-top: 80upx;">
			<view class="title flex-row between">
				<text class="u-flex-1">邀请好友证实大于或等于10人</text>
				<u-icon name="checkmark-circle-fill" :color="is?'#0061FF':'#888D98'" size="26"></u-icon>
				<text :class="[is?'':'color888D98','check']">{{is?'未完成':'已完成'}}</text> 
			</view>
			<view class="flex-row blue">
				当前邀请: 10/10人
				<image src="/pagesV2/static/images/yq_bg.svg" ></image>
				<text class="btn">立即邀请</text>
			</view>
		</view> -->
		<view class="line"></view>
		<view class="hint flex-row hcenter">
			<view class="circle"></view>满足以上两个条件，可以申请平台介入
		</view>
		<view class="hint" style="margin-top: 28upx;">
			<view class="circle" style="float: left;margin-top: 16upx;clear: both;"></view>
			<text>平台介入后，将免费为您在各大<text style="color:#0061FF ;">自媒体平台宣传</text>，让筹款尽快完成</text>
		</view>
		<view :class="['botton','marlr32', isEnable?'enable':'']" @click="setRecommendApply">邀请平台介入</view>
	</view>
</template>

<script>
	import {
		getFundraiseRASv2,
		setRecommendApply
	} from "@/api/apis.js"
	export default {
		data() {
			return {
				fundraising_id:null,
				info:{},
				isEnable:false
			}
		},
		methods: {
			toAut(index){
				if(index==0){
					uni.navigateTo({
						url:"/pagesV2/funds/authentication/authentication?id="+this.fundraising_id
					})
				}
			},
			setRecommendApply(){
				if(!this.isEnable){
					this.$u.toast('请先满足以上条件')
					return
				}
				setRecommendApply({
					fundraising_id:this.fundraising_id
				}).then(res=>{
					if(res.data.code){
						this.$u.toast(res.data.message)
					}else{
						this.$u.toast('提交成功')
						uni.navigateBack()
					}
				})
			}
		},
		onLoad(e) {
			this.fundraising_id = e.id
			getFundraiseRASv2({
				fundraising_id:e.id
			}).then(res=>{
				this.info = res.data.data
				let is = true
				for(let i in this.info.conditions){
					if(this.info.conditions[i].result == 0){
						is = false
						break
					}
				}
				this.isEnable = is
			})
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				// console.log(res.target.dataset)
				let {
					share
				} = res.target.dataset
				return {
					title: share.title,
					path: share.wechat_mini_program.path,
					imageUrl:share.wechat_mini_program.cover_image
				}
			}else{
				return{
					title:'维权太难就是点滴讼互助，筹款打官司',
					imageUrl:'http://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/share.png'
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.botton{
		line-height: 100upx;
		background: linear-gradient(90deg, #97A5C7 0%, #8396B9 100%);
		border-radius: 12upx;
		text-align: center;
		font-size: 34upx;
		font-weight: bold;
		color: #FFFFFF;
		margin-top: 100upx;
	}
	.enable{
		box-shadow: 0px 4upx 16upx rgba(239, 112, 0, 0.48);
		background: linear-gradient(269deg, #FF8F51 0%, #FFBA85 100%);
	}
	.hint{
		margin: 0 60upx 0 64upx;
		.circle{
			width: 10upx;
			height: 10upx;
			background: #687085;
			border-radius: 50%;
			margin-right: 16upx;
		}
		line-height: 42upx;
		font-size: 30upx;
		color: #687085;
	}
	.line{
		margin: 48upx 32upx;
	}
	.tips{
		// margin-top: 57upx;
		padding: 16upx 38upx 16upx 32upx;
		background: linear-gradient(270deg, #CEDEFF 0%, #F3F9FF 100%);
		border-radius: 8upx;
		font-size: 28upx;
		font-weight: bold;
		line-height: 48upx;
		color: #363E4D;
	}
	.bg_cycle{
		width: 160upx;
		height: 300upx;
		position: absolute;
		top: 396upx;
		right: 0;
	}
	.bg_cycle1{
		width: 156upx;
		height: 340upx;
		position: absolute;
		bottom: 0;
		left: 0;
	}
	.cell{
		margin: 0 64upx;
		.title{
			font-size: 32upx;
			font-weight: bold;
			line-height: 45upx;
			color: #363E4D;
			margin-left: 8upx;
		}
		image{
			margin-right: 0;
		}
		.check{
			font-size: 30upx;
			margin-left: 8upx;
		}
		.blue{
			line-height: 80upx;
			background: #DEE8FE;
			border-radius: 12upx;
			font-size: 28upx;
			color: #0061FF;
			position: relative;
			padding-left:38upx;
			margin-top: 28upx;
			image{
				position: absolute;
				width: 256upx;
				height: 80upx;
				right: 0;
				top: 0;
			}
			.btn{
				font-size: 30upx;
				font-weight: bold;
				color: #FFFFFF;
				background: none;
				margin: auto;
				margin-right: 68upx;
				z-index: 2;
				padding: 0;
			}
		}
	}
	
</style>
