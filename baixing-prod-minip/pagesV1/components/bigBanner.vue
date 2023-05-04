<template>
	<view>
		<u-popup v-model="status" mode="center" width="100%" height="100%" border-radius="0">
			<view class="swiperBox" >
				<swiper :current="index" >
					<swiper-item v-for="(item,index) in list" :key="index" class="flexcenter flex hcenter" @click="small" >
						<image :src="item" mode="widthFix" class="image"></image>
					</swiper-item>
				</swiper>
			</view>
		</u-popup>
		
	</view>
</template>

<script>
	export default {
		props:{
			question_images:Object
		},
		data() {
			return {
				status:false,
				list:[],
				index:null
			}
		},
		methods: {
			small(){
				this.$emit("small")
			}
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss">
	swiper{
		swiper-item{
			.image{
				max-width: 100%;
				max-height: 100%;
			}
		}
		height: 100%;
		width: 100%;
	}
	.swiperBox{
		width: 100%;
		height: 100%;
	}
</style>
