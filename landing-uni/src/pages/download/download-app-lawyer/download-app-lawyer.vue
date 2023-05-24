<template>
	<view style="padding-bottom: 30rpx;">
    <view class="header-app">
      <view class="download-app" @click="toDownloadApp">下载APP</view>
    </view>

    <view class="preview-module">
      <view class="preview-title">预览</view>

      <scroll-view class="scroll-x -scroll-x" scroll-x enhanced :show-scrollbar="false">
        <view v-for="(iItem, iIndex) in appImgList" :key="iIndex" class="scroll-x-item">
          <view class="img-wrap">
            <image class="safe-img" style="width: 100%; height: 100%;" mode="heightFix" :src="iItem" />
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="explain-module">
      <view>专注互联网+法律生态，一次认证，共享三大平台资源。汇聚全网同城案源，携手律师共同发展。</view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        appImgList: [
          'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-06-20/37764ca897bea219b884149d2833f788.png',
          'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-06-20/b2e51a273e30240298bef7de567f7a48.png',
          'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-06-20/c16dbc1110210bee572bd9db10df3be1.png',
        ]
			}
		},
		onLoad(e) {
      this._openApp();
		},
		methods: {
      _openApp(){
				const info = uni.getSystemInfoSync()
				let status = navigator.userAgent.toLowerCase();
				if (status.match(/MicroMessenger/i) == "micromessenger") {
				    console.log('微信浏览器') 
				}else{
				    console.log('普通浏览器')
					if(info.platform == 'ios'){
						window.location.href = 'lawyerAppScheme://'
					}else{
						window.location.href= 'rong://com.lawkd.enterprise/splash'
					}
				}
			},
      toDownloadApp(){
				const info = uni.getSystemInfoSync()
				let status = navigator.userAgent.toLowerCase();
				if (status.match(/MicroMessenger/i) == "micromessenger"&&info.platform == 'ios') {
				    console.log('微信浏览器') 
				}else{
				    console.log('普通浏览器')
					if(info.platform == 'ios'){
						window.location.href= 'itms-apps://itunes.apple.com/cn/app/id1581048858?mt=8'
					}else{
						window.location.href= 'https://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/lawyer.apk'
					}
				}
				
			},
		}
	}
</script>

<style scoped>
.header-app {
  position: relative;
  height: 632rpx;
  background-image: url('https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-06-20/2358e7198bc3446f0fb7016019e9cc42.png');
  background-size: 100% 100%;
}
.download-app {
  position: absolute;
  left: 53rpx;
  right: 53rpx;
  bottom: 104rpx;
  height: 100rpx;
  border-radius: 50rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4572F6;
  background: #fff;
  font-size: 40rpx;
}

.preview-module {
  margin-top: 40rpx;
  margin-bottom: 58rpx;
}
.preview-title {
  font-size: 40rpx;
  font-weight: 500;
  margin-left: 32rpx;
  margin-bottom: 26rpx;
}

.scroll-x {
  white-space: nowrap;
}

.scroll-x::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

.scroll-x-item {
  display: inline-block;
  vertical-align: top;
  margin-right: 20rpx;
  width: 654rpx;
  height: 298rpx;
}
.scroll-x-item:first-child {
  margin-left: 24rpx;
}

.scroll-x-item .img-wrap {
  width: 100%;
  height: 100%;
}

.explain-module {
  padding: 0 32rpx;
  font-size: 30rpx;
  line-height: 54rpx;
}

</style>
