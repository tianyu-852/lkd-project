<template>
	<view class="page relative">
		<image src="/static/bg1_icon.png" class="bg_icon1" mode="widthFix"></image>
		<image src="/static/bg2_icon.png" class="bg_icon2" mode="widthFix"></image>
		<image src="/static/txt_image.png" class="title_img" mode="widthFix"></image>

		<view v-for="(item,index) in list" :key="index" :class="['cell marlr32',index==3?'center':'']">
			<view class="title flex flexcenter">
				<image :src="item.url" class="" mode=""></image>
			</view>
			<text>{{item.text}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{
					url:'/static/1_image.png',
					text:'垂直法律社区，为老百姓与律师提供良好的沟通平台，让每一个有法律需求的人更省心、更省时、更省力、更高效地保障自身权益'
					},
					{
						url:'/static/3_image.png',
						text:'专注互联网+法律生态，一次认证，共享三大平台资源。汇聚全网同城案源，携手律师共同发展'
					},
					{
						url:'/static/2_image.png',
						text:'助力企业稳步发展，整合行业资源，精选专业律师，为中小微企业提供惠普法律服务'
					},
					// {
					// 	url:'/static/4_image.png',
					// 	text:'敬请期待\n预计2022年内上线'
					// }
				]
			}
		},
		methods: {

		},
		onLoad(e) {
			// var platform=uni.getSystemInfoSync().platform
			// var source=platform == 'ios'?JSON.parse(prompt('onGetSourceAppId','')):JSON.parse(AppProxyClick.onGetSourceAppId())
			// uni.setNavigationBarTitle({
			// 	title: source==3?'律快答-律师端':'企业律云'
			// })
		}
	}
</script>

<style>
	.page{
		height: 100vh;
		background: #EBF7FF;
		padding-bottom: 32rpx;
	}
	.title_img{
		width: calc(100% - 64rpx);
		margin: 58rpx 32rpx;
	}
	.bg_icon1{
		width: 150rpx;
		position: absolute;
		top: 475rpx;
		right: 0;
		z-index: 1;
	}
	.bg_icon2{
		width: 105rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 1;
	}
	.cell{
		/* height: 138rpx; */
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 20rpx rgba(22, 57, 172, 0.1);
		border-radius: 40rpx 40rpx 56rpx 56rpx;
		font-size: 30rpx;
		font-weight: bold;
		line-height: 48rpx;
		color: #6E7695;
		position: relative;
		margin-bottom: 61rpx;
		padding: 80rpx 43rpx 32rpx;
		z-index: 2;
	}
	.title{
		width: 100%;
		position: absolute;
		top: -21rpx;
		left: 0;
	}
	.title image{
		width: 503rpx;
		height: 70rpx;
		margin: auto;
	}
</style>
