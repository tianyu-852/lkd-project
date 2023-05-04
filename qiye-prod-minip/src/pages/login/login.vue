<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title="登录" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <view class="login-module">
      <image style="width: 194rpx; height: 194rpx;" mode="aspectFill" src="@/static/common/login-logo.png" />
      <view class="product-name">企业律云</view>
      <view class="product-desc">一站式企业法律服务</view>

      <label for="getPhoneNumberBtnId">
        <view class="auth-btn">
          <image class="icon-wxlogo-img" mode="aspectFill" src="@/static/common/icon-wxLogo-f.png" />
          <text>微信授权登录</text>
        </view>
      </label>
    </view>

    <!-- 注册使用 -->
    <button id="getPhoneNumberBtnId" open-type="getPhoneNumber" style="display: none;" @getphonenumber="onGetPhoneNumEvt" />
  </view>
</template>

<script>
import * as loginUtil from '@/common/utils/loginUtil';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Profile',
  data() {
    return {
      wxMpCode: '', // 微信小程序登录 code
    };
  },
  computed: {
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapGetters('userModule', [ 'userId' ])
  },
  onLoad() {
    this._getWxMpCode();
  },
  methods: {
    /**
     * 获取小程序登录 code
     */
    async _getWxMpCode() {
      const wxMpCode = await loginUtil.getwxMpCode();
      this.wxMpCode = wxMpCode;
    },
    /**
     * 监听授权手机号事件
     */
    async onGetPhoneNumEvt(event) {
      const { encryptedData, iv } = event.detail;
      if (!encryptedData && !iv) return;
      uni.showLoading({ title: '登录中', mask: true });

      // 手机号加密信息
      const phoneEncryptInfo = { mobile_encrypted: encryptedData, mobile_iv: iv };
      this._userLogin(phoneEncryptInfo);
    },
    /**
     * 用户登录，备选方案 2
     */
    async _userLogin(phoneEncryptInfo) {
      const { wxMpCode } = this;
      if (!wxMpCode) return this.$u.toast('微信获取登录code失败');
      try {
        // // 先获取小程序 code
        // const wxMpCode = await loginUtil.getwxMpCode();
        // 连同 code 和 手机号加密信息调用服务端登录接口
        const result = await loginUtil.userLogin(wxMpCode, phoneEncryptInfo);
        console.log(result);
        uni.navigateBack();
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 用户登录
     */
    // async _userLogin(phoneEncryptInfo) {
    //   try {
    //     const result = await loginUtil.userLogin(phoneEncryptInfo);
    //     console.log(result);
    //     uni.navigateBack();
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
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
