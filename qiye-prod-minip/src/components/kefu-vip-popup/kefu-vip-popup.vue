<template>
  <view>
    <view v-show="isShowPopup" class="mask" @click="isShowPopup = false" />
    <view v-show="isShowPopup" class="popup-module">
      <image class="header-img" mode="aspectFill" src="@/static/index/kufuVip-popup-header.png" />
      <view class="upopup-content-wrap">
        <view class="open-btn" @click="$commonUtil.routeNavTo('module-common/vip-pay-detail/vip-pay-detail')">立即开通</view>
        <view class="phone-title">全国服务热线</view>
        <view v-if="appExplainInfo.customer_service_mobile" class="phone-call" @click="$commonUtil.callPhone(appExplainInfo.customer_service_mobile)">
          <image class="icon-call" mode="aspectFill" src="@/static/common/phone-call-b.png" />
          <text>{{ appExplainInfo.customer_service_mobile }}</text>
        </view>
      </view>
      <image class="icon-del" mode="aspectFill" src="@/static/index/icon-del-f.png" @click="isShowPopup = false" />
    </view>

    <!-- <u-popup v-model="isShowPopup" mode="center" width="512" z-index="10074" border-radius="24" :mask-close-able="true" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-kefu-box" @click.stop="$commonUtil.stopPropagation">
        <image class="kefu-headerBg" mode="aspectFill" src="@/static/index/kufuVip-popup-headerBg.png" />
        <image class="kefu-del" mode="aspectFill" src="@/static/index/kufu-popup-del.png" @click="closekeFuPopup" />
        <image class="kufu-popup-avatar" mode="aspectFill" src="@/static/index/kufu-popup-avatar.png" />

        <view class="kefu-content">
          <view class="tip-desc">律师仅为会员提供服务</view>
          <view class="open-btn" @click="$commonUtil.routeNavTo('module-common/vip-pay-detail/vip-pay-detail')">立即开通</view>
          <view class="btn-box">
            <view class="btn-key">
              <view>联系客服</view>
              <view>了解详情</view>
            </view>
            <view class="btn-wrap">
              <view class="btn-item" @click="clickBtn(1)">
                <image class="btn-icon" mode="aspectFill" src="@/static/common/icon-wxLogo-f.png" />
              </view>
              <view class="btn-item" @click="clickBtn(2)">
                <image class="btn-icon" mode="aspectFill" src="@/static/common/icon-call-f.png" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </u-popup> -->
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'KefuVipPopup',
  data() {
    return {
      isShowPopup: false, // 是否打开 popup
    };
  },
  computed: {
    ...mapState([ 'officKefuInfo', 'appExplainInfo' ]),
    ...mapState('userModule', [ 'userInfo' ]),
  },
  methods: {
    /**
     * 阻止事件冒泡
     */
    stopPropagationEvt() { return; },
    /**
     * 打开弹框
     */
    openKefuPopup() {
      this.isShowPopup = true;
    },
    /**
     * 关闭弹框
     */
    closekeFuPopup() {
      this.isShowPopup = false;
    },
    /**
     * 点击 btn
     */
    clickBtn(btnType = 1) {
      if (!this.officKefuInfo) return;

      if (btnType === 1) {
        this.$commonUtil.routeNavTo('module-common/service-contact/service-contact', { customer_id: this.officKefuInfo.customer_id, enterSrc: 'center' });
      } else if (btnType === 2) {
        this.$commonUtil.callPhone(this.officKefuInfo.mobile);
      }
      // this.closekeFuPopup();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
