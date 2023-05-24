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
      <view>企业律云-一站式企业法律服务中心<br/>
      整合行业资源，精选专业律师。低成本享受高品质服务，让企业拥有更多法律安全感。<br/>
      企业律师覆盖:北京、上海、广州、石家庄、郑州、成都、潍坊、唐山、承德、运城、沧州、福州、烟台、台州、深圳、惠州、成都、贵阳、厦门、南京、杭州、赣州、莆田、乐山、嘉兴、肇庆、焦作、南宁、许昌、温州、泉州、济南、信阳、东莞、太原、合肥、邯郸、徐州、娄底、苏州、昆明、怀化、无锡、临沂、鹤壁、长沙、黄冈、枣庄、滨州、南京.……
      </view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        appImgList: [
          'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022920-1663654843596-1Tbt4M.png',
          'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022920-1663654895013-zSradT.png',
          'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022920-1663654920239-1bFkA2.png',
          'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022920-1663654937147-WR9dpK.png',
        ]
			}
		},
		onLoad() {
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
						window.location.href= 'https://apps.apple.com/cn/app/id1589660816'
					}else{
						window.location.href= 'http://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/qyly.apk'
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
						window.location.href= 'https://apps.apple.com/cn/app/id1589660816'
					}else{
						window.location.href= 'http://lvkuaidaapp.oss-cn-beijing.aliyuncs.com/qyly.apk'
					}
				}
				
			},
		}
	}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
