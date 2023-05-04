<template>
  <view>
    <u-navbar :is-back="false" :border-bottom="false" title="关于律快答" title-color="#030303">
      <view class="navbar-slot share-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <view class="about-header-module">
      <view class="about-header-left">
        <image class="logo-img" mode="aspectFill" src="../static/about-us/aboutUs-logo.png" />
      </view>
      <view class="about-header-right">
        <view class="header-title">温州律快答网络科技有限公司</view>
        <view v-if="appExplainInfo.customer_service_mobile" class="header-phone" @click="callPhone(appExplainInfo.customer_service_mobile)">
          <image class="call-img" mode="aspectFill" src="../static/about-us/aboutUs-call.png" />
          <text style="margin-right: 10rpx;">{{ appExplainInfo.customer_service_mobile }}</text>
          <text>点击拨打</text>
        </view>
      </view>
    </view>

    <view class="about-body-module">
      <view class="about-body-title">公司介绍</view>
      <view class="about-body-intro">
        律快答成立于2019年，是一家深耕互联网法律的企业，旗下互联网法律平台已为100000+企业、用户和8000多律师搭建专业咨询和法律互助桥梁。通过科技创新法律服务，整合综合服务资源，运用技术手段构建一体化服务平台，推动公共法律服务更多地向社会治理末端延伸。
      </view>

      <view class="about-body-explainWrap">
        <view class="about-body-explain">
          <view class="explain-key">企业宗旨：</view>
          <view class="explain-value">降低用户获取法律服务成本</view>
        </view>
        <view class="about-body-explain">
          <view class="explain-key">企业使命：</view>
          <view class="explain-value">做有价值的互联网法律服务平台</view>
        </view>
        <view class="about-body-explain">
          <view class="explain-key">企业愿景：</view>
          <view class="explain-value">让国内千万家中小企业真正意义上实现“普惠法律”</view>
        </view>
        <view class="about-body-explain">
          <view class="explain-key">企业价值观：</view>
          <view class="explain-value">正义 勇敢 责任 共赢 诚信</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ProfileAboutUs',
  data() {
    return {
    };
  },
  computed: {
    ...mapState([ 'appExplainInfo' ]),
  },
  methods: {
    /**
     * 拨打电话
     */
    callPhone(phoneNum) {
      if (!phoneNum) return;
      uni.makePhoneCall({ phoneNumber: phoneNum });
    },
  }
};
</script>

<style>
  page {
    background: #fff;
  }
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
