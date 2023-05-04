<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title-color="#030303" :immersive="true" :background="{ backgroundColor: 'transparent' }">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-f.png" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <image class="service-bg" mode="aspectFill" src="../static/service/service-bg.png" />

    <view class="service-module">
      <view class="service-wrap">
        <template v-if="enterSrc === 'center'">
          <view class="service-title">老板好，我等您很久了</view>
          <view class="service-priceTitle" style="font-size: 45rpx;">优惠不断惊喜连连，快来找我吧～</view>
        </template>
        <template v-else-if="enterSrc === 'law_issue'">
          <view class="service-title">hi，您现在遇到了法律问题？</view>
          <view class="service-priceTitle">别怕，我来帮您～</view>
        </template>
        <template v-else>
          <view class="service-title">hi，您现在遇到了法律问题？</view>
          <view class="service-priceTitle">别怕，我来帮您～</view>
          <!-- <view class="service-title">如何找到合适自己的企业法务</view>
          <view class="service-priceTitle">赶紧咨询专业法律顾问吧</view> -->
        </template>

        <view class="qrcode-box">
          <template v-if="enterSrc">
            <view class="qrcode-header">
              <image class="kufu-avatar" mode="aspectFill" src="@/static/index/kufu-popup-avatar.png" />
              <view class="kufu-info">
                <view class="kufu-text">长按二维码添加</view>
                <view class="kufu-text" style="color: #0085FF;">法律顾问微信</view>
              </view>
            </view>

            <view class="qrcode-wrap">
              <image class="qrcode" mode="aspectFill" show-menu-by-longpress :src="kefuQrcodeImg + '?324324324'" />
            </view>
          </template>

          <template v-else>
            <view class="call-phone-header">请点击拨打全国服务热线：</view>
            <view v-if="appExplainInfo.customer_service_mobile" class="phone-wrap">
              <text>{{ appExplainInfo.customer_service_mobile }}</text>
            </view>
            <view class="call-btn" @click="$commonUtil.callPhone(appExplainInfo.customer_service_mobile)">
              <text>点击拨打</text>
            </view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ServiceContact',
  data() {
    return {
      enterSrc: '', // 进入来源 center: 购买服务 law_issue: 咨询法律问题
      customer_id: 'new_1', // 客服 id
      kefuQrcodeImg: '', //
    };
  },
  computed: {
    ...mapState([ 'appExplainInfo' ]),
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    if (routeParam.customer_id) {
      this.customer_id = routeParam.customer_id;
    }
    // 存在进入来源
    if (routeParam.enterSrc) {
      this.enterSrc = routeParam.enterSrc;
      this._getOfficKefuQrcode();
    } else {
      this.$commonUtil.callPhone('400-600-5030');
    }
  },
  methods: {
    /**
     * 获取 客服二维码
     */
    async _getOfficKefuQrcode() {
      if (!this.customer_id) return;
      uni.showLoading({ title: '', mask: true });

      try {
        const { data: kefuData } = await this.$api.getOfficKefuQrcode({ customer_id: this.customer_id });
        this.kefuQrcodeImg = kefuData.wechat_add_qrcode_image;
      } catch (error) {
        console.log(error);
      }
    },
  }
};
</script>

<style>
page {
  height: 110%;
}
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
