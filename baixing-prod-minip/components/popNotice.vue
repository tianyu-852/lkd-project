<template>
	<view>
		<u-mask :show="show" @click="onClose">
			<view class="warp flex-column">
				<view class="relative">
					<text class="hello" v-if="type === 1">{{info.name}}律师您好</text>
					<image :src="[type?'http://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_image@3x.png':'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/bg_lawyer_register.png']" mode="widthFix"></image>
					<text class="btn1" :style="type?'':'margin-top:-127rpx'" @click="toPage">赶紧看看吧</text>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	import {
		setBannerNotified
	}
	from "@/api/apis.js"
	export default {
		computed: {
			show: {
				get() {
					// return true
					return this.$store.state.notice.show
				},
				set() {}
			},
			type:{
				get() {
					return this.$store.state.notice.type
				},
				set() {}
			},
			info:{
				get() {
					return this.$store.state.notice.info
				},
				set() {}
			}
		},
		watch:{
			value(newVal,old){
				this.$emit('input',newVal)
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			onClose(){
				this.$store.commit("setNoticeShow", false)
			},
			toPage(){
				setBannerNotified().then(res=>{
					if(res.data.code==0){
						uni.navigateTo({
							url:'/pagesV1/index/lawyerPage?id='+uni.getStorageSync('user_id')
						})
						this.$store.commit("setNoticeShow", false)
					}else{
						uni.$u.toast(res.data.message)
					}
					
				})
				
			},
		}
	}
</script>

<style scoped lang="scss">
	.warp{
		margin: auto;
		width: 546upx;
		align-items: center;
		justify-content: center;
		height: 100vh;
		image{
			width: 100%;
			z-index: 1;
			display: block;
		}
		.relative{
			width: 100%;
			position: relative;
		}
		.hello{
			top: 247upx;
			left: 47upx;
			line-height: 45upx;
			font-size: 32upx;
			font-weight: bold;
			position: absolute;
			color: #222222;
			z-index: 2;
		}
		.btn1{
			width: 360upx;
			margin: auto;
			margin-top: -66upx;
			font-size: 34upx;
			font-weight: bold;
			color: #FFFFFF;
			padding: 21upx 95upx;
			line-height: 48upx;
			background: linear-gradient(180deg, #4686FC 0%, #2B69F9 100%);
			box-shadow: 0px 0px 20upx rgba(0, 29, 122, 0.4);
			border-radius: 100px;
			text-align: center;
			display: block;
			z-index: 3;
		}
	}
</style>
