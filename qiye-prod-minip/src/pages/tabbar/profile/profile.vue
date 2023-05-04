<template>
  <view class="main">
    <view class="profile-header-module">
      <view class="profile-info-wrap">
        <view class="profile-info-left">
          <u-lazy-load v-if="userInfo.avatar" img-mode="aspectFill" height="120" border-radius="60" :loading-img="qiyeLoadImg296" :error-img="qiyeLoadImg296" :image="userInfo.avatar" />
          <image v-else style="width: 120rpx; height: 120rpx; border-radius: 50%;" mode="aspectFill" src="@/static/profile/profile-avatar-default.png" @click="$refs.authLoginRef.openAuthLoginPopup()" />
        </view>
        <template v-if="userId">
          <view class="profile-info-middle" @click="clickMenuItem('module-profile/profile-company-prove/profile-company-prove')">
            <view class="profile-name">{{ userInfo.nickname }}</view>
            <view v-if="userInfo.enterprise_vip_expired_at" class="vip-expire">
              <text>服务到期时间 {{ userInfo.enterprise_vip_expired_at }}</text>
            </view>
          </view>
          <view class="profile-info-right" @click="clickMenuItem('module-profile/profile-company-prove/profile-company-prove')">
            <text v-if="userInfo.is_need_write_enterprise">企业认证</text>
            <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-3.png" />
          </view>
        </template>
        <template v-else>
          <view class="profile-info-middle" @click="$refs.authLoginRef.openAuthLoginPopup()">
            <view class="profile-name">登录/注册</view>
            <view class="vip-expire">点击此处授权登录</view>
          </view>
        </template>
      </view>
    </view>

    <view class="profile-menu-module">
      <view class="menu-tab-wrap">
        <view class="menu-tab-item" @click="$refs.downloadAppRef.openDowloadAppPopup()">
          <image class="menu-tab-img" mode="aspectFill" src="@/static/profile/profile-order.png" />
          <view>我的订单</view>
        </view>
        <view class="menu-tab-item" @click="navToLawyerCenter">
          <image class="menu-tab-img" mode="aspectFill" src="@/static/profile/profile-rights.png" />
          <view>我的权益</view>
        </view>
        <view class="menu-tab-item" @click="clickMenuItem('module-profile/profile-wallet/profile-wallet')">
          <image class="menu-tab-img" style="width: 100rpx; height: 97rpx; margin-bottom: 13rpx;" mode="aspectFill" src="@/static/profile/profile-wallet.png" />
          <view>我的钱包</view>
        </view>
      </view>

      <!-- 拨打 banner -->
      <view class="call-ceo-banner" @click="callPhone(appExplainInfo.boss_mobile)">
        <image style="width: 100%; height: 100%;" mode="aspectFill" src="@/static/profile/profile-call-ceo.png" />
      </view>
    </view>

    <!-- 单元格 -->
    <view class="profile-cell-module">
      <label class="share-label" for="shareBtnId">
        <view class="cell-item">
          <image class="cell-left" mode="aspectFill" src="@/static/profile/profile-cell-share.png" />
          <view class="cell-middle">分享应用</view>
          <view class="cell-right">
            <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-3.png" />
          </view>
        </view>
      </label>

      <!-- <view class="cell-item" @click="clickMenuItem('module-profile/profile-lawyer-proveInfo/profile-lawyer-proveInfo')">
        <image class="cell-left" mode="aspectFill" src="@/static/profile/profile-cell-lawyer.png" />
        <view class="cell-middle">我是律师</view>
        <view class="cell-right">
          <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-3.png" />
        </view>
      </view> -->

      <view class="cell-item" @click="clickMenuItem('module-profile/profile-about-us/profile-about-us', true)">
        <!-- <view class="cell-item" @click="clickMenuItem('module-price/price-center/price-center', true)"> -->
        <!-- <view class="cell-item" @click="clickMenuItem('module-price/product-center/product-center', true)"> -->
        <!-- <view class="cell-item" @click="clickMenuItem('module-common/product-pay/product-pay', true)"> -->
        <image class="cell-left" mode="aspectFill" src="@/static/profile/profile-cell-about.png" />
        <view class="cell-middle">关于律快答</view>
        <view class="cell-right">
          <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-3.png" />
        </view>
      </view>
    </view>

    <button id="shareBtnId" open-type="share" style="display: none;" />

    <!-- 下载app popup -->
    <download-app-popup ref="downloadAppRef" />
    <!-- 授权登录 popup -->
    <auth-login-popup ref="authLoginRef" />
    <!-- 客服 popup -->
    <kefu-popup ref="kefuRef" />
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Profile',
  data() {
    return {
      safeAreaHeight: this.$store.state.safeAreaHeight,
      qiyeLoadImg296: this.$store.state.qiyeLoadImg296,
    };
  },
  computed: {
    ...mapState([ 'appExplainInfo' ]),
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapGetters('userModule', [ 'userId' ])
  },
  onLoad() {
    // if (!this.userId) this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框
  },
  onShareAppMessage() {
    const { appExplainInfo } = this;
    return {
      title: `${ appExplainInfo.enterprise_vip_share.title }`,
      path: '/pages/tabbar/index/index?a=[123]&b=',
      imageUrl: `${ appExplainInfo.enterprise_vip_share.wechat_mini_program.cover_image }`
    };
  },
  methods: {
    /**
     * 进入菜单
     */
    clickMenuItem(pagePath, isNotLogin) {
      if (!pagePath) return;
      const { userId } = this;
      if (!isNotLogin && !userId) return this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框

      this.$commonUtil.routeNavTo(pagePath);
    },
    /**
     * 进入法律中心
     */
    navToLawyerCenter() {
      uni.switchTab({ url: '/pages/tabbar/center/center' });
      // callPhone(appExplainInfo.customer_service_mobile)
    },
    clickKefuService() {
      const { userId } = this;
      if (userId) return this.$refs.kefuRef.openKefuPopup(); // 打开客服弹框
    },
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

<style lang="scss" scoped>
  @import './style.scss';
</style>
