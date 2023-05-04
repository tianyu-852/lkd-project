<template>
	<view style="background:#F5F7FA ;">
		<!-- <u-top-tips ref="uTips"></u-top-tips> -->
		<u-navbar back-icon-size="34" back-text=" " :background="navbackground" title-color="#222222" title="筹款详情"
			:border-bottom="false" title-size="36" :title-bold="false"></u-navbar>
		<view class="tips tips-red" v-if="info.status==20&&info.refuse_reason">{{info.refuse_reason}}</view>
		<view class="tips tips-orange" v-if="info.status==5&&info.pending_text">{{info.pending_text}}</view>
		<view class="authentication flex-row">
			<text class="text">您还未认证，立即邀请好友认证</text>
			<button class="button" open-type="share">分享</button>
		</view>
		<view class="victim">
			<view class="title">
				为谁筹款
			</view>
			<view class="flex-row">
				<image class="img" :src="info.litigant_avatar"></image>
				<view class="text">
					<view class="name">{{info.litigant_nickname}}</view>
					<view class="relation">{{info.litigant_role}}</view>
				</view>
				<!-- <view class="button">分享获得帮助</view> -->
			</view>
		</view>
		<view class="detail">
			<view class="cell flex-row">
				<text class="left">您的姓名</text>
				<text class="right">{{info.user_nickname}}</text>
			</view>
			<view class="cell flex-row">
				<text class="left">常用手机号</text>
				<text class="right">{{info.user_mobile}}</text>
			</view>
			<view class="idcode">
				身份证照片
				<view class="flex-row">
					<image class="img" :src="info.id_card_front" mode="aspectFill"></image>
					<image class="img" :src="info.id_card_back" mode="aspectFill" style="margin-left: 16upx;"></image>
				</view>
			</view>
		</view>
		<view class="hint">
			案件内容详情
		</view>
		<view class="detail" style="padding-bottom: 80upx;">
			<view class="text">
				<text>{{info.content?(detailShow[0]?info.content:info.content.substr(0,67)+'...'):''}} </text>
				<text class="showButton" @click="showAll(`${0}`)" v-if="!detailShow[0]&&info.content">展开剩余</text>
			</view>
			<view class="imgGrids">
				<image  v-for="item in info.images" class="item" :src="item"></image>
				<view style="clear: both;"></view>
			</view>
			<view class="faceHint">无法人脸识别说明
				<view class="text">
					<text>{{info.not_auth_reason?(detailShow[1]?info.not_auth_reason:info.not_auth_reason.substr(0,64)+'...'):''}} </text>
					<text class="showButton" @click="showAll(`${1}`)" v-if="!detailShow[1]&&info.not_auth_reason">展开剩余</text>
				</view>
			</view>
			<view class="imgGrids">
				<image  v-for="item in info.not_auth_images" class="item" :src="item"></image>
				<view style="clear: both;"></view>
			</view>
			<button class="shareButton" open-type="share">
				<text>立即分享证实</text>
			</button>
		</view>
		
		<view class="safe-area-inset-bottom backfff"></view>
	</view>
</template>

<script>
	import { server } from "@/request.js"
	import { getGrantsDetail } from "@/api/apis.js"
	export default {
		data() {
			return {
				id:0,
				info:{},
				navbackground: {
					background: '#F5F7FA'
				},
				detailShow:[false,false]
			}
		},
		methods: {
			showAll(i){
				this.$set(this.detailShow,i,true)
			},
			// showTips() {
			// 	this.$refs.uTips.show({
			// 		title: '雨打梨花深闭门，忘了青春，误了青春',
			// 		type: 'success',
			// 		duration: '2300'
			// 	});
			// }
		},
		onLoad(option) {
			console.log(option.id)
			this.id=option.id;
		},
		onShow(){
			// let id=this.$route.params;
			// console.log(this.$route)
			getGrantsDetail({fundraising_registration_id:this.id}).then(res => {
				console.log(res)
				this.info=res.data.data;
				this.detailShow[0]=this.info.content.length<=67?true:false;
				this.detailShow[1]=this.info.not_auth_reason.length<=64?true:false;
			})
		}
	}
</script>

<style scoped lang="scss">
	.shareButton{
		height: 87upx;
		background: linear-gradient(267deg, #FF9101 0%, #FFAF5D 100%);
		box-shadow: 0px 4upx 12upx rgba(233, 117, 0, 0.5);
		border-radius: 100upx;
		font-size: 34upx;
		 
		font-weight: bold;
		line-height: 86upx;
		color: #FFFFFF;
		opacity: 1;
		margin: 41upx 62upx 0 62upx;
		text-align: center;
	}
	.tips{
		font-size: 24upx;
		font-weight: 500;
		padding: 16upx 32upx;
	}
	.tips-red{
		color: #FF3951;
		background: #FEE7E7;
	}
	.tips-orange{
		color: #FF7639;
		background: #FEEEE7;
	}
	.showButton{
		float: right;
		color: #677592;
		font-size: 26upx;
		 
		font-weight: bold;
		line-height: 40upx;
	}
	.hint{
		padding: 12upx 32upx;
		font-size: 30upx;
		 
		line-height: 49upx;
		color: #888D98;
		opacity: 1;
		margin-bottom: -12upx;
	}
	.detail{
		margin-top: 12upx;
		padding: 0 32rpx;
		background: #fff;
		.faceHint{
			.text{
				background: #F3F5F8;
				opacity: 1;
				border-radius: 8upx;
				padding: 20upx;
				font-size: 28upx;
				 
				line-height: 48upx;
				color: #222222;
				opacity: 1;
				margin: 20upx 0 10upx;
			}
			font-size: 32upx;
			 
			font-weight: 400;
			line-height: 45upx;
			color: #222222;
			margin-top: 55upx;
		}
		.imgGrids{
			.item{
				float: left;
				width: 144upx;
				height: 144upx;
				background: #9AAAFF;
				opacity: 1;
				border-radius: 8upx;
				margin-bottom: 16upx;
				margin-right: 16upx;
			}
		}
		.text{
			padding: 20upx 0;
			font-size: 28upx;
			 
			font-weight: 400;
			line-height: 48upx;
			color: #222222;
		}
		.idcode{
			font-size: 32upx;
			 
			line-height: 45upx;
			color: #222222;
			padding:32upx 0 20upx 0;
			.img{
				margin-top: 20upx;
				flex: 1;
				width: 335upx;
				height: 200upx;
				background: #9AAAFF;
				border-radius: 8upx;
			}
		}
		.cell{
			padding: 32upx 0;
			border-bottom: 1upx solid #ECEFF4;
			font-size: 32upx;
			 
			line-height: 45upx;
			color: #222222;
			.left{
				flex: 1;
			}
			.right{
				
			}
		}
	}
	.victim{
		padding: 20upx 32upx 32upx 32upx;
		background: #fff;
		
		.text{
			padding: 4upx 16upx ;
			flex: 1;
			.name{
				font-size: 34upx;
				 
				font-weight: bold;
				line-height: 48upx;
				color: #222222;
				opacity: 1;
			}
			.relation{
				font-size: 28upx;
				 
				font-weight: 500;
				line-height: 40upx;
				color: #888D98;
				opacity: 1;
				margin-top: 4upx;
			}
		}
			
		.button{
			font-size: 26upx;
			 
			font-weight: 500;
			line-height: 37upx;
			color: #FFFFFF;
			width: 180upx;
			line-height: 56upx;
			height: 56upx;
			background: linear-gradient(267deg, #FF9307 0%, #FFAE5A 100%);
			opacity: 1;
			text-align: center;
			border-radius: 100px;
		}
		.title{
			font-size: 32upx;
			 
			font-weight: 500;
			line-height: 45upx;
			color: #222222;
			opacity: 1;
			margin-bottom:20upx ;
		}
		.img{
			height: 100upx;
			width: 100upx;
			border-radius: 50upx;
		}
	}
	.authentication {
		.text{
			flex:1;
			color: #0061FF;
			font-size: 28upx;
		}
		.button{
			padding: 7upx 31upx;
			line-height:33upx ;
			background: linear-gradient(360deg, #FF9307 0%, #FFAE5A 100%);
			opacity: 1;
			border-radius: 100upx;
			color: #fff;
			font-size: 24upx;
		}
		padding: 16upx 32upx 16upx 24upx;
		margin: 20upx 32upx;
		line-height: 48upx;
		background: #E7F3FE;
		box-shadow: 0px 4px 12px rgba(0, 70, 191, 0.14);
		opacity: 1;
		border-radius: 16upx;
	}
	
</style>
