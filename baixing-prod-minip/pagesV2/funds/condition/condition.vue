<template>
	<view>
		<view class="blueBg">
			<view class="title">
				<image src="/static/images/dds_icon.png" mode="widthFix"></image>
			</view>
			<view class="main">
				<view class="main-title">{{info.index_recommend.title}}</view>
				<image :src="url+'/30r_image.png'" mode="widthFix" class="bannerImg"></image>
				<view class="main-foot" v-if="info.index_recommend.current>=info.index_recommend.condition">
					<u-icon name="checkmark-circle-fill" color="#0061FF" size="26"></u-icon>
					<text class="main-foot-blue">已完成</text>
					<view class="main-foot-btn status1" @click="apply(0)" v-if="info.index_recommend.status==0">申请推荐</view>
					<view class="main-foot-btn status2" v-else>已申请</view>
				</view>
				<view class="main-foot" v-else>
					<text>未完成（{{info.index_recommend.current}}/{{info.index_recommend.condition}}）</text>
					<view class="main-foot-btn status3">条件未达成</view>
				</view>
			</view>
			<view class="main">
				<view class="main-title">{{info.self_media.title}}</view>
				<image :src="url+'/50r_image.png'" mode="widthFix" class="bannerImg2"></image>
				<view class="main-foot" v-if="info.self_media.current>=info.self_media.condition">
					<u-icon name="checkmark-circle-fill" color="#0061FF" size="26"></u-icon>
					<text class="main-foot-blue">已完成</text>
					<view class="main-foot-btn status1" @click="apply(1)" v-if="info.self_media.status==0">申请推荐</view>
					<view class="main-foot-btn status2" v-else>已申请</view>
				</view>
				<view class="main-foot" v-else>
					<text>未完成（{{info.self_media.current}}/{{info.self_media.condition}}）</text>
					<view class="main-foot-btn status3">条件未达成</view>
				</view>
			</view>
		</view>
		<view class="homeTop">
			<view class="homeTop-info"></view>
		</view>
		<view class="foot marlr32">
			<button class="foot-btn yellow" open-type="share">立即分享证实</button>
			<!-- <view class="foot-btn blue">申请推荐</view> -->
		</view>
	</view>
</template>

<script>
	import {
		getRecommendSomething,
		setRecommendApply
	}
	from "@/api/apis.js"
	export default {
		data() {
			return {
				info:{},
				applyState:[true,true],
				url:''
			}
		},
		methods: {
			toCondition(){
				uni.navigateTo({
				    url: '/pagesV2/funds/condition/condition'
				});
			},
			apply(n){
				setRecommendApply({fundraising_id:this.info.fundraising_id,type:n}).then(res=>{
					if(res.data.code==0){
						if(n==0){
							this.info.index_recommend.status==1
						}else{
							this.info.self_media.status==1
						}
						this.$u.toast('申请成功');
					}else{
						this.$u.toast(res.data.message);
					}
				})
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				return {
					title: '案件详情',
					path: this.info.share.wechat_mini_program.path,
				}
			}
			
		},
		onLoad() {
			this.url=this.$photoPath;
			getRecommendSomething().then(res=>{
				if(res.data.code==0){
					this.info=res.data.data
				}
			})
		},
		onShow() {
			// this.getMyData();
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F5F7FA;
	}
	.blueBg {
		background: #4785FF;
		padding: 0 32upx;
		margin-top: -40upx;
	}
	.title{
		text-align: center;
		margin: auto;
		transform: translateY(75upx);
		image{
			width: 50%;
			margin: auto;
		}
	}
	.main{
		text-align: center;
		border-radius: 20upx;
		background-color: #fff;
		overflow: hidden;
		font-size: 28upx;
		font-weight: bold;
		margin-bottom: 16upx;
		transform: translateY(100upx);
		.main-title{
			margin: 32upx auto 16upx;
			font-size: 34upx;
		}
		.bannerImg{
			width: 70%;
		}
		.bannerImg2{
			width: 90%;
		}
		.main-foot{
			position: relative;
			margin: 32upx auto 16upx;
			.main-foot-blue{
				color: #0061FF;
			}
			.main-foot-btn{
				position: absolute;
				right: 32upx;
				bottom: 0;
				padding: 4upx 24upx;
				border-radius: 100upx;
				font-size: 24upx;
			}
			.status1{
				color: #fff;
				background: linear-gradient(to right,#FFAE5B,#FF9102);
			}
			.status2{
				color: #0061FF;
				background: none;
				border: 2upx solid #0061FF;
			}
			.status3{
				color: #869AC5;
				background-color: #B8C7E1;
			}
			image{
				width: 26upx;
			}
		}
	}
	.homeTop {
		margin-top: -150upx;
		margin-bottom: 90upx;
		.homeTop-info {
			width: 100%;
			height: 100px; 
			position: relative; 
		}
		.homeTop-info:after { 
			width: 140%; 
			height: 100px; 
			position: absolute; 
			left: -20%; 
			top: 0; 
			z-index: -1; 
			content: ''; 
			border-radius: 0 0 50% 50%; 
			background: #4785FF;
		}
	}
	.foot{
		.foot-btn{
			height: 87upx;
			line-height: 87upx;
			color: #fff;
			text-align: center;
			border-radius: 100upx;
			font-size: 24upx;
			margin-bottom: 10upx;
		}
		.yellow{
			background: linear-gradient(to right,#FFAE5B,#FF9102);
			box-shadow: 0 8upx 24upx 0 rgba($color: #E97500, $alpha: 0.2);
		}
		.blue{
			background: #0061FF;
			box-shadow: 0 8upx 24upx 0 rgba($color: #0061FF, $alpha: 0.2);
		}
	}
</style>
