<template>
  <view class="main">
    <u-navbar :is-back="false" :border-bottom="false" title="验证个人信息" title-color="#030303">
      <view class="navbar-slot share-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <view class="idcardImg-module">
      <view class="idcard-title">上传身份证照片</view>
      <view class="idcard-subtitle">光线充足环境下，请将身份证正面朝上拍摄识别成功率更高哦</view>

      <view class="idcard-imgWrap" style="margin-bottom: 40rpx;">
        <image class="idcard-img" mode="aspectFill" src="../static/prove/idcard-front.png" />
        <text>上传身份证人像面</text>
      </view>

      <view class="idcard-imgWrap">
        <image class="idcard-img" mode="aspectFill" src="../static/prove/idcard-back.png" />
        <text>上传身份证国徽面</text>
      </view>
    </view>

    <view class="idcardInfo-module">
      <view class="idcardInfo-item">
        <view class="idcardInfo-key">确定您的名字</view>
        <input v-model="real_name" class="input-text" maxlength="5" cursor-spacing="30" placeholder-style="color: #999; font-size: 32rpx;">
      </view>
      <view class="idcardInfo-item">
        <view class="idcardInfo-key">确定你的身份证</view>
        <input v-model="id_card" class="input-text" maxlength="11" cursor-spacing="30" placeholder-style="color: #999; font-size: 32rpx;">
      </view>
    </view>

    <!-- 下一步 -->
    <view class="next-btn" @click="enterNext">下一步</view>
  </view>
</template>

<script>

export default {
  name: 'ProfileLawyerIdcard',
  data() {
    return {
      id_card_front_image: '', // 身份证正面照
      id_card_back_image: '', // 身份证背面照
      id_card: '', // 身份证背面照
      real_name: '', // 真实姓名
    };
  },
  computed: {
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
