<template>
	<view @click.stop="playVoice" @longpress.stop="longtap" class="flex-row voiceBox hcenter" :style="{background: start?'#0061FF':bgcolor,borderRadius:right?' 16rpx 2rpx 16rpx 16rpx;':' 2rpx 16rpx 16rpx 16rpx;'}" >
		<image :src="isplay?'https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/gif_audio_play.gif':'/static/images/ly_icon.svg'" mode=""></image>
		<uni-countdown @timeup="timeup" :color="color" background-color="none" :second="timestamp" :start="start" splitorColor="#979EB3" :showDay="false"></uni-countdown>
		<image v-show="showTranslate" @click.stop="translate" class="audioTranslate" src="https://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program/ic_audio_fy.png"></image>
		<view class="" v-if="showTranslate" @touchstart.stop="showTranslate =false" style="width: 100vw;height: 100vh;position: fixed;left: 0;z-index: 99;">
			
		</view>
	</view>
</template>

<script>
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	
	// import UniCountdown from "@/uni"
	export default {
		props:{
			time:Number,
			url:String,
			noTranslate:Boolean,
			right:Boolean,
			bgcolor:{
				type:String,
				default:'#F3F5F8'
			}
		},
		data() {
			return {
				timestamp:0,
				start:false,
				show:false,
				color:'#979EB3',
				isplay:false,
				showTranslate:false
			}
		},
		methods: {
			longtap(){
				uni.$emit("longtap",'')
				if(this.noTranslate){
					this.playVoice()
				}else
					this.showTranslate = true
			},
			translate(){
				this.$emit('translate')
				this.showTranslate = false
			},
			playVoice(){
				if(this.start){
					innerAudioContext.stop();
					this.start = false
					this.isplay = false
					this.color = '#979EB3'
				}else{
					this.start = true
					innerAudioContext.stop();
					innerAudioContext.src = this.url;
					innerAudioContext.play();
					this.timestamp =  this.time
					this.color = '#fff'
				}
				
			},
			timeup(){
				innerAudioContext.stop();
				this.timestamp =  this.time
				this.isplay = false
				this.start = false
				this.color = '#979EB3'
			},
			closeTranslate(){
				this.showTranslate = false
			}
		},
		mounted() {
			this.timestamp = this.time 
			innerAudioContext.onPlay(() => {
				if(this.start){
					if(this.isplay == false){
						this.isplay = true
					}else{
						this.isplay = false
						this.start = false
						this.color = '#979EB3'
					}
				}
			});
			if(!this.noTranslate)
				uni.$on('longtap',this.closeTranslate) ; 
			// this.show = true
		},
		beforeDestroy(){
			if(!this.noTranslate)
			uni.$off('longtap',this.closeTranslate)
			
			innerAudioContext.stop();
		}
	}
</script>

<style scoped>
	.voiceBox{
		position: relative;
		background:#F3F5F8;
		width: 240rpx;
		border-radius: 2rpx 16rpx 16rpx 16rpx;
		z-index: 100;
	}
	.audioTranslate{
		position: absolute;
		z-index: 100;
		width: 160rpx;
		height: 62rpx;
		top: -80rpx;
		left: 20rpx;
		padding: 0;
	}
	image{
		width: 65rpx;
		height: 36rpx;
		padding: 12rpx 20rpx;
	}
	
</style>
