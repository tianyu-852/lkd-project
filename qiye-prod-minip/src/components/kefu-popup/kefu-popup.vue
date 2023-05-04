<template>
  <view>
    <view v-show="isShowPopup" class="mask" @click="isShowPopup = false" />
    <view v-show="isShowPopup" class="popup-module">
      <image v-if="headerImgType === 1" class="header-img" mode="aspectFill" src="@/static/index/kufu-popup-header-1.png" />
      <image v-if="headerImgType === 2" class="header-img" mode="aspectFill" src="@/static/index/kufu-popup-header-2.png" />

      <view class="upopup-content-wrap">
        <view class="phone-title">全国服务热线</view>
        <view v-if="appExplainInfo.customer_service_mobile" class="phone-call" @click="$commonUtil.callPhone(appExplainInfo.customer_service_mobile)">
          <image class="icon-call" mode="aspectFill" src="@/static/common/phone-call-f.png" />
          <text>{{ appExplainInfo.customer_service_mobile }}</text>
        </view>
      </view>
      <image class="icon-del" mode="aspectFill" src="@/static/index/icon-del-f.png" @click="isShowPopup = false" />
    </view>

    <!-- 客服弹框 -->
    <!-- <u-popup v-model="isShowPopup" mode="center" width="512" z-index="10074" border-radius="24" :mask-close-able="false" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-kefu-box" @click.stop="$commonUtil.stopPropagation">
        <image class="kefu-headerBg" mode="aspectFill" src="@/static/index/kufu-popup-headerBg.png" />
        <image class="kefu-del" mode="aspectFill" src="@/static/index/kufu-popup-del.png" @click="closekeFuPopup" />
        <image class="kufu-popup-avatar" mode="aspectFill" src="@/static/index/kufu-popup-avatar.png" />

        <view class="kefu-content">
          <template v-if="userInfo.enterprise_vip_expired_at">
            <view class="kefu-explain">一对一服务</view>
            <view class="kefu-explain">全天候响应</view>
          </template>
          <template v-else>
            <view class="kefu-name">法律顾问</view>
            <view class="kefu-explain">为您争取更多优惠</view>
            <view class="kefu-explain">我是认真的～～～</view>
          </template>

          <view class="btn-wrap">
            <view class="btn-item" @click="clickBtn(1)">
              <image class="btn-icon" mode="aspectFill" src="@/static/common/icon-wxLogo-f.png" />
              <text>微信</text>
            </view>
            <view class="btn-item" @click="clickBtn(2)">
              <image class="btn-icon" mode="aspectFill" src="@/static/common/icon-call-f.png" />
              <text>电话</text>
            </view>
          </view>
          <view class="cancel-btn" @click="closekeFuPopup">残忍拒绝</view>
        </view>
      </view>
    </u-popup> -->
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'KefuPopup',
  props: {
    headerImgType: { type: Number, default: 1 }
  },
  data() {
    return {
      isShowPopup: false, // 是否打开 popup
    };
  },
  computed: {
    ...mapState([ 'officKefuInfo', 'appExplainInfo' ]),
    ...mapState('userModule', [ 'userInfo' ]),
  },
  created() {},
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
      this.closekeFuPopup();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
