<template>
	<view style="width: 100vw; height: 100vh;">
    <image class="qiye-img" style="width: 100%; height: 100%;" mode="aspectFill" :src="qiyeAPPBgImg" @click="toDownloadApp" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
        qiyeAPPBgImg: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202299-1662701267927-6s49Pd.jpeg'
			}
		},
		onLoad() {
      this.toDownloadApp();
		},
		methods: {
      /**
       * 去下载 企业律云app
       */
      toDownloadApp(){
				const info = uni.getSystemInfoSync()
				let status = navigator.userAgent.toLowerCase();
				if (status.match(/MicroMessenger/i) == "micromessenger" && info.platform == 'ios') {
					console.log('微信浏览器')
					if (info.platform == 'ios') {
						window.location.href= 'https://apps.apple.com/cn/app/id1589660816'
					} else {
						window.location.href= 'http://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/qyly.apk'
					}
				} else {
				    console.log('普通浏览器')
          if (info.platform == 'ios') {
            window.location.href= 'https://apps.apple.com/cn/app/id1589660816'
          } else {
            window.location.href= 'http://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/qyly.apk'
          }
				}
			},
		}
	}
</script>

<style scoped>
</style>
