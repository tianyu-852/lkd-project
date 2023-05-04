<template>
	<view class="navTop" :style="{'height':statusBarHeight+44+'px','padding-top':statusBarHeight-10+'px'}">
<!-- 		<view class="back-icon" @click="back()">
			<image src="../static/images/nav_fh_icon.png" mode="widthFix" class="image"></image>
		</view> -->
		<view v-for="(item,index) in tabs" class="navItem" :class="[tabIndex==index?'navItem-on':'']">
			<view @click="toLink(index,item.src)">{{item.text}}</view>
			<u-badge type="green" class="badge" bgColor="red" :offset="[24,-30]" v-if="index==2" size="mini" count='99'></u-badge>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			tabIndex: Number	
		},
		data() {
			return {
				statusBarHeight:0,
				tabs:[
					{
						text:'首页',
						src:'/pagesV1/index/index',
						active:0
					},{
						text:'找律师',
						src:'/pagesV1/find/find',
						active:1
					},{
						text:'我的',
						src:'/my/my',
						active:2
					}
				]
			}
		},
		methods: {
			back(){
				uni.navigateBack({
				    delta: 1
				});
			},
			toLink(i,s){
				if(this.tabIndex==i){
					uni.$emit('topstatus',false)
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					});
					return
				}
				uni.redirectTo({
				    url: s
				});
			}
		},
		mounted() {
			
		},
		created(){
			let that=this;
			uni.getSystemInfo({
			    success: function (res) {
					that.statusBarHeight=res.statusBarHeight
			    }
			});
		}
	}
</script>

<style lang="scss">

	.navTop{
		padding: 15upx 32upx 0;
		height: auto;
		line-height: 110rpx;
		font-size: 34rpx;
		color: #888D98;
		background-color: #fff;
		.navItem{
			display: inline-block;
			margin: 0 24rpx;
			position: relative;
		}
		.navItem-on{
			color: #000000;
			font-weight: bold;
			
			&:after{
				content: '';
				width: 80%;
				height: 8rpx;
				position: absolute;
				bottom: 20rpx;
				left: 10%;
				background-color: #0061FF;
				border-radius: 4rpx;
			}
		}
		.back-icon{
			margin-right: 50upx;
			display: inline-block;
			image{
				width: 40rpx;
			}
			
		}
	}
	
</style>
