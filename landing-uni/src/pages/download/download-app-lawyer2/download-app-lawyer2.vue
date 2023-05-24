<template>
	<view style="width: 100vw; height: auto;">
    <image class="qiye-img" style="width: 100%; height: 100%;" mode="widthFix" :src="appBgImg" @click="toDownloadApp" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
        appBgImg: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202292-1662112960423-XZHTr8.png'
			}
		},
		onLoad() {
      this.toDownloadApp();
		},
		methods: {
      /**
       * 去下载 律师端app
       */
      toDownloadApp(){
				const info = uni.getSystemInfoSync()
				let status = navigator.userAgent.toLowerCase();
				if (status.match(/MicroMessenger/i) == "micromessenger" && info.platform == 'ios') {
					console.log('微信浏览器')
					if (info.platform == 'ios') {
						window.location.href= 'itms-apps://itunes.apple.com/cn/app/id1581048858?mt=8'
					} else {
						window.location.href= 'https://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/lawyer.apk'
					}
				} else {
				    console.log('普通浏览器')
          if (info.platform == 'ios') {
						window.location.href= 'itms-apps://itunes.apple.com/cn/app/id1581048858?mt=8'
          } else {
						window.location.href= 'https://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/lawyer.apk'
          }
				}
			},
		}
	}
</script>

<style scoped>
</style>
