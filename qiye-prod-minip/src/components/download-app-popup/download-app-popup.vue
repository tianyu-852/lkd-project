<template>
  <view>
    <u-popup v-model="isShowPopup" mode="center" width="490" border-radius="30" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-tips-box" @click.stop="closeDowloadAppPopup">
        <image class="download-app-bg" mode="aspectFill" src="@/static/common/download-app-popup.png" />
        <view class="known-btn">我知道了</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  name: 'DownloadAppPopup',
  data() {
    return {
      isShowPopup: false, // 是否打开 popup
    };
  },
  methods: {
    /**
     * 阻止事件冒泡
     */
    stopPropagationEvt() { return; },
    /**
     * 打开弹框
     */
    openDowloadAppPopup() {
      this.isShowPopup = true;
    },
    /**
     * 关闭弹框
     */
    closeDowloadAppPopup() {
      this.isShowPopup = false;
    },
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
