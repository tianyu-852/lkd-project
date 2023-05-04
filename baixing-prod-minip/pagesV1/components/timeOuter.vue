<template>
	<view class="relative">
		<u-popup v-model="show" mode="center" border-radius="64" closeable>
			<view class="width620 ">
				<view class="relative center">
					<image :src="url+'/bj_image.png'" mode="widthFix" class="bj"></image>
					<view class="absolute text">{{name}}您好 , 我通过百姓律师平台联系您 , 请问现在方便向您咨询吗？</view>
					<view class="flex flexcenter buttonBox">
					</view>
				</view>
			</view>
			<view :class="['button',status?'active':'']" @click="clickButton">{{!status?`等待时间${time}s`:'我已知晓'}}</view>
		</u-popup>

		<!-- <view class="button flex flexcenter hcenter" @click="">立即咨询</view> -->
	</view>
</template>

<script>
	export default {
		props:{
			name:String
		},
		data() {
			return {
				show: false,
				setFn: null,
				time: 5,
				url:'',
				status: false,
				name:''
			}
		},
		methods: {
			clickButton() {
				if(this.status){
					this.$emit("call")
					return
				}
				uni.showToast({
					icon:"none",
					title:`请耐心等待${this.time}秒`
				})
			},
			setInterval() {
				this.setFn = setInterval(() => {
					this.time -= 1;
					if (this.time == 0) {
						clearInterval(this.setFn);
						this.status = true
					}
				}, 1000)
			}
		},
		mounted() {
			
		},
		destroyed() {
			clearInterval(this.setFn);
		},
		created(){
			this.url=this.$photoPath;
		}
	}
</script>

<style lang="scss">
	.buttonBox {}

	.active {
		background: linear-gradient(180deg, #FF9135 0%, #FF582C 100%) !important;
		box-shadow: 0px 2rpx 20rpx rgba(255, 94, 0, 0.57) !important;
		border-radius: 100rpx !important;
		color: #FFFFFF !important;
	}

	.button {
		width: 360rpx;
		line-height: 110rpx;
		background: linear-gradient(180deg, #C2D2E4 0%, #8C9EB5 100%);
		box-shadow: 0px 2rpx 20rpx rgba(0, 0, 0, 0.57);
		border-radius: 100rpx;
		font-size: 36rpx;
		color: #647487;
		font-weight: bold;
		position: fixed;
		z-index: 99999;
		bottom: 140rpx;
		left: 200rpx;
		text-align: center;
	}

	.text {
		width: 50%;
		top: 32%;
		left: 26%;
		text-align: justify;
		color: #FFF;
	}

	.bj {
		width: 100%;
	}
</style>
