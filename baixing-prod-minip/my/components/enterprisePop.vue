<template>
	<view class="">
		<u-popup v-model="show" mode="center" border-radius="56">
			<view class="popBox relative">
				<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_yrz_image.png" class="widthAll" mode="widthFix" v-if="type"></image>
				<image src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/qyly_wrz_image.png" class="widthAll" mode="widthFix" v-else></image>
				<view class="center btn absolute widthAll">
					<view class="blue" @click="toIndex()" v-if="type">立即前往律企圈</view>
					<view class="blue" @click="toIndex()" v-else>立即认证</view>
					<view @click="show=0">稍后再说</view> 
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getImUserEnterprise
	} from '@/api/apis.js'
	export default {
		props:{
			type:Boolean
		},
		data() {
			return {
				show:false,
				token:null
			}
		},
		methods: {
			toIndex(){
				if(!this.token){
					uni.navigateTo({
						url:'/pagesV1/common/login'
					})
				}
				getImUserEnterprise({is_lawyer_letter:is}).then(res=>{
					if(res.data.code==0){
						this.show=0
						if(this.type){
							uni.switchTab({
								url:'/pages/v1/index'
							})
						}else{
							uni.navigateTo({
								url:'/my/enterprise'
							})
						}
					}else{
						uni.$u.toast(res.data.message)
					}
				})
				
			}
		},
		created(){
			this.token=uni.getStorageSync('token')
		}
	}
</script>

<style scoped lang="scss">
	.popBox{
		width: 600rpx;
		image{
			margin-top: -2rpx;
		}
		.btn{
			// margin-top: -180rpx;
			bottom: 40rpx;
			line-height: 40rpx;
			.blue{
				color: #fff;
				line-height: 77rpx;
				background: linear-gradient(90deg, #3B5BEA 0%, #5886FE 100%);
				box-shadow: 0rpx 8rpx 16rpx rgba(9, 91, 255, 0.4);
				border-radius: 39rpx;
				margin: 0 47rpx 24rpx;
			}
		}
	}
</style>
