<template>
	<view style="width: 100vw; height: auto;">
    <image class="qiye-img" style="width: 100%; height: 100%;" mode="widthFix" :src="appBgImg" @click="toDownloadApp" />
	</view>
</template>

<script>
	// 兼容
	var browser = {
		versions: function() {
			var u = navigator.userAgent,
				app = navigator.appVersion;
			return {
				/*IE内核*/
				trident: u.indexOf('Trident') > -1,
				/*opera内核*/
				presto: u.indexOf('Presto') > -1,
				/*苹果、谷歌内核*/
				webKit: u.indexOf('AppleWebKit') > -1,
				/*火狐内核*/
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
				/*是否为移动终端*/
				mobile: !!u.match(/AppleWebKit.*Mobile.*/),
				/*ios终端*/
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
				/*android终端或者uc浏览器*/
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
				/*是否为iPhone或者QQHD浏览器*/
				iPhone: u.indexOf('iPhone') > -1,
				/*是否iPad*/
				iPad: u.indexOf('iPad') > -1,
				/*是否web应该程序，没有头部与底部*/
				webApp: u.indexOf('Safari') == -1,
				souyue: u.indexOf('souyue') > -1,
				superapp: u.indexOf('superapp') > -1,
				weixin: u.toLowerCase().indexOf('micromessenger') > -1,
				Safari: u.indexOf('Safari') > -1
			};
		}(),
		language: (navigator.browserLanguage || navigator.language).toLowerCase()
	};

	export default {
		data() {
			return {
        appBgImg: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/202292-1662112960423-XZHTr8.png'
			}
		},
		onLoad() {
      // this.toDownloadApp();
      this.opanLawyerApp();
			// console.log(browser)
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

			/**
			 * 前往打开 律师端 APP 律师列表
			 */
			opanLawyerApp() {
				if (browser.versions.ios) {
					window.location.href = 'jump-lawyerlistlinking://default'
				} else {
					window.location.href = 'lawkd://com.lawkd.enterprise/lawyer_list'
				}
			}
		}
	}
</script>

<style scoped>
</style>
