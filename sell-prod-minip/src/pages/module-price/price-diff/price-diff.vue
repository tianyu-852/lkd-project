<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" :background="{ backgroundColor: '#000' }">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-f.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="img-module">
      <image class="img" mode="aspectFill" show-menu-by-longpress :src="diffImg" @click="$commonUtil.previewImg([diffImg], diffImg)" />
      <view class="btn-wrap">
        <view class="btn-item">
          <image class="icon-img" mode="aspectFill" src="../static/icon-download-f.png" />
          <text>长按图片保存</text>
        </view>
        <view class="btn-item">
          <image class="icon-img" mode="aspectFill" src="../static/icon-share-f.png" />
          <text>长按图片分享</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: 'PriceCenter',
  data() {
    return {
      diffImg: '', // 对比图片
    };
  },
  onLoad() {
    const { diffImg } = this.$Route.query;
    this.diffImg = diffImg;
  },
  methods: {}
};
</script>

<style>
  page {
    background: #000;
  }
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
