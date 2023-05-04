<template>
	<view class="swiperBox" :style="height?'height:'+height:''" v-if="banners.length">
		<swiper :current="index"  autoplay>
			<swiper-item v-for="(item,index) in banners" :key="index" class="flexcenter flex hcenter" @click="jump(item)" >
				<button :open-type="item.share?'share':''" :data-data="item"><image :src="item.banner" mode="aspectFill" class="image"></image></button>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
	  jumpToUrl
	} from '@/common/util.js';
	export default {
		name:"banners",
		props:{
			banners:Array,
			height:String
		},
		data() {
			return {
			};
		},
		methods:{
			jump(item){
				jumpToUrl(item.type,item.jump_id)
			}
		}
	}
</script>

<style scoped lang="scss">
	swiper{
		swiper-item{
			.image{
				width: 100%;
				height: 100%;
			}
		}
		height: 100%;
		width: 100%;
	}
	.swiperBox{
		width: 100%;
		height: 100%;
		border-radius: 15rpx;
		overflow: hidden;
		button{
			width: 100%;
			height: 100%;
			padding: 0;
		}
	}
</style>
