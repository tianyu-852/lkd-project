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
      <view>在百姓律师APP，您可以使用以下功能:</view>
      <view>【百姓律师】</view>
      <view>平台提供高效、便捷、专业的法律咨询服务，为全国各地有法律咨询需求的用户提供律师在线咨询服务。</view>
      <view>免费图文咨询，免费电话咨询，直接与律师在线或者电话沟通。您可以精准匹配本地专业律师，让您享受无忧咨询服务。 平台覆盖多种法律服务场景，包含但不局限于一离婚纠纷、子女抚养、劳动纠纷、拆迁安置、交通事故、房产纠纷、债权债务、合同纠纷、侵权问题、医疗纠纷、行政诉讼、刑事辩护、知识产权、公司法等。</view>
      <view style="margin-top: 50rpx">【认证律师】平台律师经过严格资料审核、人脸识别确保律师身份的真实性。专业的解答，为您提供更有效的解决方案。</view>
      <view style="margin-top: 50rpx">【社区】了解最新的法律咨询，可以随时随地发布碰到的法律问题，海量专业律师在线为您解答。也可以发布生活动态，与其他用户一起分享您的喜和悲。</view>
      <view style="margin-top: 50rpx">在咨询服务中，如有律师引起您任何不适的地方，请直接与我们联系(任选一种方式): </view>
      <view>1、在百姓律师APP的客服中心留言</view>
      <view>2、直接拨打我们的客服电话</view>
    </view>

    <view v-show="isShowJumpTip" class="nav-jump-module">
      <view class="nav-jump-img">
				<image style="width: 686rpx;" src="/static/xcx_icon.svg" mode="widthFix"></image>
			</view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        appImgList: [
          'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-06-20/24d7939074304009090ffad527ace89d.png',
          'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-06-20/efd3632f45c1e9296c5123f956263dce.png',
          'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-06-20/4dbff8d05b224f60ec991fad7bd03258.png',
        ],

        isShowJumpTip: false,
			}
		},
		onLoad() {
      if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
        console.log('微信浏览器');
        this.isShowJumpTip = true;
      }
      
      this.toDownloadApp();
		},
		methods: {
      toDownloadApp() {
				const info = uni.getSystemInfoSync()
				let status = navigator.userAgent.toLowerCase();
				if (status.match(/MicroMessenger/i) == "micromessenger") {
					if (info.platform == 'ios') {
						// window.location.href= 'https://apps.apple.com/cn/app/id1513531987'
            window.location.href= 'itms-apps://itunes.apple.com/cn/app/id1513531987'
					} else {
						window.location.href= 'https://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/app-release.apk'
					}
				} else {
				    console.log('普通浏览器')
          if (info.platform == 'ios') {
            // window.location.href= 'https://apps.apple.com/cn/app/id1513531987'
            window.location.href= 'itms-apps://itunes.apple.com/cn/app/id1513531987'
          } else {
						window.location.href= 'https://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/app-release.apk'
          }
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.header-app {
  position: relative;
  height: 632rpx;
  background-image: url('https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-06-20/6d9d3ec89c402b47afe2fce668a6bae0.png');
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

.nav-jump-module {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
  .nav-jump-img {
    margin-top: 20rpx;
  }
}
</style>
