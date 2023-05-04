<template>
	<view style="background: #F5F7FA;height: 100vh;" class="flex-column">
		<!-- <u-popup v-model="show" :mask="true" border-radius="16" mode="center" @close="dialogClose">
			<view class="popbox ">
				<text class="title">请牢记以下验证码</text>
				<text class="time">此验证码将于 
				<u-count-down ref="uCountDown" :autoplay="autoplay" @end="end"
						:timestamp="60000" :show-days="false" color="#0061FF" :show-hours="false" :show-minutes="false">
					</u-count-down> <text class="blue">秒</text>后过期
					用普通话朗读数字，视频时长 <text class="blue">3-8秒</text>最佳</text>
				<view class="code flex-row">
					<text v-for="item in code" :key="item">{{item}}</text>
				</view>

				<view class="button" style="margin-top: 64upx;height: 88upx;line-height: 88upx;" @click="video()">
					记住了，开始录制</view>
			</view>
		</u-popup> -->

		<!-- <u-popup v-model="showCamera" :mask="true" border-radius="16" mode="center" @close="dialogClose">
			<view class="camerabox ">
				<view>
					<video id="webcam" :class="cameraVisible?'recordSrc':'hiddenClass'" muted="true"
						controls="false"></video>
				</view>
				<video class="recordSrc playvideo" controls :src="recordBlob"
					:class="cameraVisible?'hiddenClass':'recordSrc'"></video>

				<button class="button" @click="startRecording" v-if="step==0">开始录制</button>
				<button class="button" @click="stopRecording" v-if="step == 1">停止录像</button>
				<button class="button restart" @click="restart" v-if="step==2">重新录制</button>
				<button class="button upload" @click="uploadVideo" v-if="step==2">上传视频</button>
			</view>
		</u-popup> -->

		<!-- <view class="camerabox ">
			<view>
				<video id="webcam" :class="cameraVisible?'recordSrc':'hiddenClass'" muted="true" controls="false"></video>
			</view>
			<video class="recordSrc playvideo" controls :src="recordBlob" :class="cameraVisible?'hiddenClass':'recordSrc'"></video>

			<button class="button" @click="startRecording" v-if="step==0">开始录制</button>
			<button class="button" @click="stopRecording" v-if="step == 1">停止录像</button>
			<button class="button restart" @click="restart" v-if="step==2">重新录制</button>
			<button class="button upload" @click="uploadVideo" v-if="step==2">上传视频</button>
		</view> -->
		<!-- <image class="icon" src="/static/images/tx_icon.svg"></image>
		<text class="hint">正面平视手机、保证光线充足
			请勿遮挡面部</text>
		<view class="card">
			<view style="margin-left: 90upx;">
				<view class="flex-row text">
					<image class="ring" src="/static/images/d_icon.svg"></image>1.牢记验证码，点击开始录制
				</view>
				<view class="line"></view>
				<view class="flex-row text">
					<image class="ring" src="/static/images/d_icon.svg"></image>2.开启前置摄像头，用普通话朗读数字
				</view>
				<view class="line"></view>
				<view class="flex-row text">
					<image class="ring" src="/static/images/d_icon.svg"></image>3.完成录制,等待验证结果
				</view>
			</view>

			<view class="button" @click="showPop()">下一步</view>
		</view> -->
	</view>
</template>

<script>
	// import {
	// 	server
	// } from "@/request.js"
	// import {
	// 	getCVANumber,
	// 	sendFRLitigantPersonVideoVerify
	// } from "@/api/apis.js"

	// export default {
	// 	data() {
	// 		return {
	// 			show: false,
	// 			code: [],
	// 			src: {},
	// 			autoplay: false,
	// 			session_id: '',
	// 			id: '',
	// 			// message: "",
	// 			// mediaObject: '',
	// 			// rec: '',
	// 			// chunks: [],
	// 			// recordBlob: '',
	// 			// step: "0", //0:开始录像, 1:录像中，2：停止录像
	// 			// cameraVisible: true, // 显示/隐藏相机
	// 			// showCamera: false
	// 		}
	// 	},
	// 	methods: {
	// 		end() {
	// 			this.autoplay = false
	// 		},
	// 		video() {
	// 			// if (this.show) {
	// 			// 	this.show = false
	// 			// 	this.showCamera = true
	// 			// 	return
	// 			// }

	// 			uni.chooseVideo({
	// 				count: 1,
	// 				maxDuration: 10,
	// 				camera: 'front',
	// 				sourceType: ['camera'],
	// 				success: res => {

	// 					if (res.duration < 10) {
	// 						this.src = res.tempFilePath;
	// 						console.log(res.size / 1024)
	// 						// this.$u.toast('视频上传中');
	// 						uni.uploadFile({
	// 							url: server +
	// 								'api/fundraising-registration/litigant/person/video/verify',
	// 							header: {
	// 								"Authorization": uni.getStorageSync('token'),
	// 								// 'content-type':'application/x-www-form-urlencoded',
	// 							},
	// 							filePath: this.src,
	// 							name: 'video',
	// 							formData: {
	// 								'fundraising_registration_id': this.id,
	// 								'session_id': this.session_id
	// 							},
	// 							success: res => {
	// 								console.log(this.id)
	// 								let data = JSON.parse(res.data)
	// 								if (data.code == 0) {
	// 									this.$u.toast('上传成功,等待审核');
	// 									this.show = false
	// 									this.autoplay = false
	// 								} else {
	// 									this.$u.toast(data.message)
	// 								}
	// 							},
	// 							fail: res => {
	// 								this.$u.toast('上传失败,请重试');
	// 							}
	// 						})
	// 						// uni.compressVideo({
	// 						// 	src:this.src,
	// 						// 	quality:'medium',
	// 						// 	success:res=>{
	// 						// 		this.src = res.tempFilePath;
	// 						// 		console.log(res.size/1024)

	// 						// 	},
	// 						// 	fail:res=>{
	// 						// 		console.log(JSON.stringify(res))
	// 						// 		this.$u.toast('视频压缩失败');
	// 						// 	}
	// 						// })

	// 					} else {
	// 						this.$u.toast('视频不能超过10秒,请重试');
	// 					}
	// 					// 	this.$u.toast(res);
	// 					// console.log(res)
	// 					// this.$u.toast('+++++');
	// 				},
	// 				fail: res => {
	// 					// this.$u.toast('------');
	// 					// console.log('------')
	// 				}
	// 			});
	// 		},
	// 		showPop() {
	// 			getCVANumber().then(res => {
	// 				if (res.data.code != 0) {
	// 					this.$u.toast(res.data.message);
	// 				} else {
	// 					this.show = true;
	// 					this.autoplay = true
	// 					// this.$refs.uCountDown.start();
	// 					this.session_id = res.data.data.session_id
	// 					this.code = res.data.data.code.split('')
	// 				}

	// 			})

	// 		},
	// 		// async init() {
	// 		// 	var self = this;
	// 		// 	           if (navigator.mediaDevices === undefined) {
	// 		// 	               navigator.mediaDevices = {};
	// 		// 	           }
	// 		// 	           if (navigator.mediaDevices.getUserMedia === undefined) {
	// 		// 	               navigator.mediaDevices.getUserMedia = function (constraints) {
	// 		// 	                   var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
	// 		// 	                   if (!getUserMedia) {
	// 		// 	                       return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
	// 		// 	                   }
	// 		// 	                   return new Promise(function (resolve, reject) {
	// 		// 	                       getUserMedia.call(navigator, constraints, resolve, reject);
	// 		// 	                   });
	// 		// 	               }
	// 		// 	           }
	// 		// 	           if (window.stream) {
	// 		// 	               window.stream.getTracks().forEach(track => {
	// 		// 	                   track.stop();
	// 		// 	               });
	// 		// 	           }
	// 		// 	this.videoContext = uni.createVideoContext('webcam');
	// 		// 	const dom = document.getElementsByClassName("uni-video-video")[0]
	// 		// 	var constraints = window.constraints = {
	// 		// 	               audio: false,
	// 		// 	               video: {
	// 		// 	                   sourceId: 'default',
	// 		// 	                   facingMode:  { exact: "user" } 
	// 		// 	               }
	// 		// 	             }
	// 		// 	await navigator.mediaDevices.getUserMedia(constraints).then(function(media) {
	// 		// 		console.log('getUserMedia completed successfully.');
	// 		// 		dom.srcObject = media
	// 		// 	}).catch(function(error) {
	// 		// 		console.log(error.name + ": " + error.message);
	// 		// 		alert(error.name + ": " + error.message)
	// 		// 	});
	// 		// 	console.log(dom.srcObject)
	// 		// 	this.mediaObject = dom.srcObject;
	// 		// 	await this.videoContext.play();
	// 		// },

	// 		// startRecording() {
	// 		// 	// alert("开始录像了")
	// 		// 	this.step = "1"
	// 		// 	this.rec = new MediaRecorder(this.mediaObject);

	// 		// 	this.chunks = [];
	// 		// 	this.rec.start();
	// 		// 	// alert("启动录像成功")
	// 		// },
	// 		// stopRecording() {
	// 		// 	this.step = "2";
	// 		// 	this.cameraVisible = false;
	// 		// 	this.rec.stop();
	// 		// 	//alert("停止成功")
	// 		// 	this.rec.ondataavailable = e => this.chunks.push(e.data);
	// 		// 	//alert("导数据了")
	// 		// 	this.rec.onstop = async () => {
	// 		// 		//alert("输出录像blob:"+URL.createObjectURL(new Blob(this.chunks, { type: 'video/mp4' })))
	// 		// 		console.log(URL.createObjectURL(new Blob(this.chunks, {
	// 		// 			type: 'video/mp4'
	// 		// 		})))
	// 		// 		this.recordBlob = URL.createObjectURL(new Blob(this.chunks, {
	// 		// 			type: 'video/mp4'
	// 		// 		}));
	// 		// 	};
	// 		// },
	// 		// async restart() {
	// 		// 	this.step = "0";
	// 		// 	this.cameraVisible = true;
	// 		// 	console.log(this.mediaObject)
	// 		// 	// await this.videoContext.play();
	// 		// },
	// 		// uploadVideo() {
	// 		// 	//关闭摄像头
	// 		// 	if (this.mediaObject) {
	// 		// 		console.log(this.mediaObject);
	// 		// 		console.log(this.mediaObject.getTracks());
	// 		// 		this.mediaObject.getTracks()[0].stop();
	// 		// 		this.mediaObject.getTracks()[1].stop();
	// 		// 	}
	// 		// 	const self = this
	// 		// 	console.log(self.recordBlob)
	// 		// 	//进行下一步处理。。。。。。
	// 		// }
	// 	},
	// 	onLoad(e) {
	// 		this.id = e.id
	// 	},
	// 	onReady() {
	// 		// this.init();
	// 	}
	// }
</script>

<style scoped lang="scss">
	// .camerabox {
	// 	width: calc(100vw - 64upx);
	// 	height: calc(100vw - 64upx);

	// 	.recordSrc {
	// 		width: 100%;
	// 		height: 50vh;
	// 		position: absolute;
	// 	}

	// 	.playvideo {
	// 		left: 0
	// 	}

	// 	.button {
	// 		position: absolute;
	// 		bottom: 11%;
	// 		left: 50%;
	// 		margin-left: -50px;
	// 		width: 100px;
	// 		border-radius: 42px;
	// 		background-color: red;
	// 	}

	// 	.restart {
	// 		left: 25%;
	// 	}

	// 	.upload {
	// 		left: 75%;
	// 	}

	// 	.hiddenClass {
	// 		visibility: hidden;
	// 	}
	// }

	// .popbox {
	// 	width: 638upx;
	// 	// height: 540upx;
	// 	padding-bottom: 32upx;
	// 	background: #FFFFFF;
	// 	opacity: 1;
	// 	border-radius: 16upx;

	// 	.title {
	// 		line-height: 48upx;
	// 		font-size: 34upx;
	// 		 
	// 		font-weight: bold;
	// 		display: block;
	// 		color: #222222;
	// 		opacity: 1;
	// 		text-align: center;
	// 		padding-top: 32upx;
	// 	}

	// 	.code {
	// 		line-height: 90upx;
	// 		opacity: 1;
	// 		text-align: center;
	// 		font-size: 70upx;
	// 		justify-content: center;
	// 		margin-top: 48upx;

	// 		text {
	// 			border: 2upx solid #C9CED9;
	// 			width: 90upx;
	// 			display: block;
	// 			margin: 0 3upx;
	// 			 
	// 			font-weight: bold;
	// 			border-radius: 8upx;
	// 		}
	// 	}

	// 	.time {
	// 		font-size: 28upx;
	// 		 
	// 		font-weight: 500;
	// 		text-align: center;
	// 		display: block;
	// 		line-height: 56upx;
	// 		color: #222222;
	// 		opacity: 1;
	// 		margin-top: 32upx;

	// 		.blue {
	// 			color: #0061FF;
	// 		}
	// 	}
	// }

	// .button {

	// 	margin: 0 32upx;
	// 	margin-top: 100upx;
	// 	line-height: 100upx;
	// 	background: #0061FF;
	// 	opacity: 1;
	// 	border-radius: 8upx;
	// 	font-size: 36upx;
	// 	 
	// 	font-weight: 500;
	// 	color: #FFFFFF;
	// 	text-align: center;
	// }

	// .icon {
	// 	width: 380upx;
	// 	height: 380upx;
	// 	margin: auto;
	// 	margin-top: 32upx;
	// }

	// .hint {
	// 	width: 390upx;
	// 	height: 90upx;
	// 	font-size: 30upx;
	// 	 
	// 	font-weight: 500;
	// 	line-height: 48upx;
	// 	text-align: center;
	// 	color: #888D98;
	// 	opacity: 1;
	// 	margin: auto;
	// 	margin-top: 20upx;
	// 	// display: block;
	// }

	// .card {
	// 	flex: 1;
	// 	padding: 100upx 0upx 0 0upx;
	// 	margin-top: 32upx;
	// 	background: #FFFFFF;
	// 	box-shadow: 0px -4upx 20upx rgba(0, 67, 184, 0.09);
	// 	opacity: 1;
	// 	border-radius: 40upx 40upx 0px 0px;
	// }

	// .ring {
	// 	width: 32upx;
	// 	height: 32upx;
	// 	margin-right: 20upx;
	// 	margin-top: 5upx;
	// }

	// .text {
	// 	line-height: 42upx;
	// 	font-size: 30upx;
	// 	 
	// 	font-weight: bold;
	// 	color: #222222;
	// 	opacity: 1;

	// }

	// .line {
	// 	width: 16upx;
	// 	height: 44upx;
	// 	border-right: 2upx dotted #0061FF
	// }
</style>
