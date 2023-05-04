<template>
	<view class="touchText" >
		<text @touchstart="startRecorder" @touchend="endRecorder" @touchmove.stop="handleMove">
			按住 说话
		</text>
		
		<u-mask :show="isRecorder" v-if="isRecorder">
			<view class="maskBox">
				<view class="recorderIng flex flexcenter hcenter" v-if="isRecorder === 1">
					<image src="../../static/bg_voice.gif" mode="widthFix"></image>
					<image class="triangle" src="../../static/j_icon.svg" mode="widthFix"></image>
				</view>
				<text v-if="isRecorder === 2" class="cancelHint">松开 取消</text>
				<!-- <view :class="['cancelBtn flex hcenter flexcenter',isRecorder==2?'cancelActive':'']">
					<image src="/static/images/del.png"></image>
				</view> -->
				<image v-if="isRecorder === 2" class="recorderDel" src="../../static/bg_recorder_cancel.gif" mode="scaleToFill"></image>
				<text v-if="isRecorder === 1" class="sendHint">松开 发送</text>
				<image v-if="isRecorder === 1"  class="bottom" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2023314-1678787088440-r0mb2X.png" mode="widthFix"></image>
				<image v-if="isRecorder === 2" class="bottom" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2023314-1678787109262-Y6QpAe.png" mode="widthFix"></image>
				<!-- <image class="recorder" src="/pagesV1/static/images/ic_recorder.png" mode=""></image> -->
			</view>
		</u-mask>
	</view>
</template>

<script>
	const recorderManager = uni.getRecorderManager();
	export default {
		props: {
			// type:{ type:String, default:'wav' }
			type:{ type:String, default:'mp4' }
		},
		data() {
			return {
				show:false,
				authorize:false,
				voiceFile:null,
				isRecorder:0,
				pWidth:750,
				pHeight:1080,
			}
		},
		methods: {
			handleMove(e) {
			    // console.log('move',e.changedTouches[0],this.isRecorder);  
			    // 防止页面高度很大，出现滚动条，不能移动-默认拖动滚动条事件  
			    e.preventDefault();  
				const {pHeight,pWidth} = this
				const moveH = uni.upx2px(256)
				const touch = e.changedTouches[0]
				if(touch.pageX>pWidth || touch.pageX<0)
					return
				if(touch.pageY>pHeight || touch.pageY<0)
					return
				if(touch.pageY<(pHeight - moveH) ){
					this.isRecorder = 2
				}else{
					this.isRecorder = 1
				}
			}, 
			startRecorder(){
				console.log(this.type)
				if(!this.authorize){
					this.openAuthorize()
					return
				}
				this.isRecorder = 1
				recorderManager.start({
					sampleRate:this.type == 'aac'?16000:8000,
					numberOfChannels:1,
					format:this.type,
					duration:60000
				});
			},
			endRecorder(){
				// this.isRecorder = false
				 // console.log('录音结束');
				 recorderManager.stop();
			},
			openAuthorize(){
				uni.showModal({
					title: '提示',
					content: '请授权获取您的麦克风权限',
					success: res=> {
						if (res.confirm) {
							uni.openSetting({
								success: res=> {
									if(res.authSetting){
										this.getAuthorize()
									}
								},
								complete: res => {
									console.log(res);
								}
							})
						}
					}
				});
					
			},
			getAuthorize(){
				uni.authorize({
					scope: "scope.record",
					success: res => {
						this.authorize = true;
						console.log('授权成功')
					},
					fail: res => {
						console.log('授权失败')
						console.log(res)
						this.authorize = false;
					}
				})
			}
		},
		mounted() {
			this.getAuthorize()
			recorderManager.onStop(res=> {
				// uni.$u.toast('recorder stop')
				console.log('recorder stop' + JSON.stringify(res));
				// this.isRecorder = 0
				if(this.isRecorder===2){
					this.isRecorder = 0
					return
				}
				this.isRecorder = 0
				if(res.duration < 3000){
					uni.$u.toast('说话时间太短')
					return
				}
				this.voiceFile = res;
				this.voiceFile.duration = parseInt(res.duration/1000) 
				this.$emit('recorder',this.voiceFile)
			});
			recorderManager.onError(res=>{
				console.log(res)
			})
			uni.getSystemInfo({
			    success: res=> {
					this.pWidth=res.windowWidth
					this.pHeight=res.windowHeight
			    }
			});
		}
	}
</script>

<style scoped lang="scss">
	.recorder{
		width: 32rpx;
		height: 46rpx;
		left: 0;
		right: 0;
		bottom: 101rpx;
		z-index: 2;
		position: absolute;
	}
	.cancelHint{
		font-size: 30rpx;
		font-weight: bold;
		color: #AEAEAE;
		
		position: absolute;
		left: 79rpx;
		bottom: 486rpx;
	}
	.sendHint{
		font-size: 30rpx;
		font-weight: bold;
		color: #AEAEAE;
		position: absolute;
		left: 0;
		right: 0;
		text-align: center;
		bottom: 276rpx;
	}
	.cancelBtn{
		width: 144rpx;
		height: 144rpx;
		background: #393939;
		border-radius: 50%;
		position:absolute ;
		bottom: 304rpx;
		left: 72rpx;
		image{
			width: 40rpx;
			height: 40rpx;
		}
	}
	.cancelActive{
		background: #fff;
		bottom: 286rpx;
		width: 180rpx;
		height: 180rpx;
		left: 54rpx;
	}
	.recorderDel{
		width: 221rpx;
		position: absolute;
		bottom: 452rpx;
		left: 32rpx;
		height: 182rpx;
	}
	.touchText{
		width: 100%;
		text-align: center;
		height: 64rpx;
		line-height: 64rpx;
		background: #EBEEF3;
		border-radius: 8rpx;
		font-size: 34rpx;
		font-weight: bold;
		color: #888D98;
	}
	.maskBox{
		width: 100vw;
		height: 100vh;
		position: relative;
		.recorderIng{
			height: 162rpx;
			background: #6BABFF;
			position: absolute;
			border-radius: 30rpx;
			z-index: 222222;
			bottom:552rpx;
			left: 204rpx;
			right: 204rpx;
			image{
				// margin:auto ;
				width:200rpx;
				margin-top: -20rpx;
				// height: 80rpx;
			}
			.triangle{
				width: 44rpx;
				position: absolute;
				bottom:-20rpx ;
			}
		}
		.bottom{
			position: absolute;
			bottom: 0;
			width: 100vw;
			left: 0;
		}
	}
</style>
