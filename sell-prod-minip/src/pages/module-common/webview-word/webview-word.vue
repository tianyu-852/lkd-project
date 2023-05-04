<template>
  <!-- <web-view v-if="phonePlatform === 'ios' && webSrc" :src="webSrc" /> -->
  <web-view :src="webSrc" />
</template>

<script>
export default {
  name: 'WebviewPdf',
  data() {
    return {
      phonePlatform: 'ios', // 手机平台 ios、android
      webSrc: ''
    };
  },
  onLoad() {
    // 系统信息
    const { platform } = uni.getSystemInfoSync();
    this.phonePlatform = platform;

    const { webSrc } = this.$Route.query;
    this.webSrc = webSrc;
    // const eventChannel = this.getOpenerEventChannel();
    // Object.keys(eventChannel).length && eventChannel.on('webViewEvt', data => {
    //   const { webSrc, navTitle } = data;
    //   // navTitle && uni.setNavigationBarTitle({ title: navTitle });
    //   this.webSrc = webSrc;
    //   // Android 平台需要下载后再打开
    //   this.phonePlatform !== 'ios' && this.webSrc && this._androidPreviewPDF(this.webSrc);
    // });
  },
  methods: {
    /**
     * Android 预览 pdf
     */
    async _androidPreviewPDF(pdfSrc) {
      uni.showLoading({ title: '加载中', mask: true });
      // Android 需要下载后再打开
      uni.downloadFile({
        url: pdfSrc,
        success: res => {
          const filePath = res.tempFilePath;
          // 新开页面打开文档
          uni.openDocument({
            filePath,
            fileType: 'pdf',
            success: res2 => {
              uni.hideLoading();
              uni.navigateBack({ delta: 1 });
            }
          });
        },
        fail: error => {
          console.log(error);
          uni.hideLoading();
          uni.showToast({ title: '加载失败', icon: 'none', duration: 3000 });
        },
      });
    }
  }
};
</script>

<style>
</style>
