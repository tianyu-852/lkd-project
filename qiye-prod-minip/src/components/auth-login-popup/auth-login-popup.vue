<template>
  <view>
    <!-- 登录弹框 -->
    <u-popup v-model="isShowAuthLoginPopup" mode="bottom" border-radius="30" :mask-close-able="true" safe-area-inset-bottom :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-login-box" @click.stop="stopPropagationEvt">
        <view class="upopup-login-title">服务协议和隐私政策</view>
        <image class="protocol-heade-img" mode="aspectFill" src="@/static/common/login-popup-protocol.png" />
        <view class="protocol-content">
          感谢选择企业律云小程序，我们非常重视您的个人信息安全和隐私保护。依据最新法律要求，使用我们的产品前，请仔细阅读并同意
          <text style="color: #0085FF;" @click="routerToWebView(appExplainInfo.user_service)">《用户协议》</text>
          和
          <text style="color: #0085FF;" @click="routerToWebView(appExplainInfo.privacy_policy)">《个人信息保护政策》</text>，以便我们向您提供更优质的服务！
        </view>
        <view class="protocol-content">
          我们承诺将尽全力保护您个人信息及合法权益，再次感谢您的信任！
        </view>

        <view class="btn-wrap">
          <view class="refuse-btn" @click="refuseLogin">拒绝</view>
          <label class="btn-label" for="getPhoneNumberBtnId" style="width: 100%;">
            <view class="auth-btn">同意并继续</view>
          </label>
        </view>
      </view>
    </u-popup>

    <!-- 注册使用 -->
    <button id="getPhoneNumberBtnId" open-type="getPhoneNumber" style="display: none;" @getphonenumber="onGetPhoneNumEvt" />
  </view>
</template>

<script>
import * as loginUtil from '@/common/utils/loginUtil';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'DownloadAppPopup',
  data() {
    return {
      isShowAuthLoginPopup: false, // 是否显示授权登录 popup
      wxMpCode: 0, // 微信 minip 登录 code
    };
  },
  computed: {
    ...mapState([ 'appExplainInfo' ]),
    ...mapGetters('userModule', [ 'userId' ])
  },
  watch: {
    userId(newVal) {
      newVal && this.closeAuthLoginPopup();
    }
  },
  created() {
    // 微信未登录获取小程序登录 code
    if (!this.userId) this._getWxMpCode();
  },
  methods: {
    /**
     * 阻止事件冒泡
     */
    stopPropagationEvt() { return; },
    /**
     * 获取小程序登录 code
     */
    async _getWxMpCode() {
      const wxMpCode = await loginUtil.getwxMpCode();
      this.wxMpCode = wxMpCode;
      return wxMpCode;
    },
    /**
     * 打开弹框
     */
    openAuthLoginPopup() {
      this.isShowAuthLoginPopup = true;
    },
    /**
     * 关闭弹框
     */
    closeAuthLoginPopup() {
      this.isShowAuthLoginPopup = false;
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
      this.isShowLoginPopup = false;
      const [checkError, checkRes] = await uni.checkSession();
      // 登录状态过期，清除 code
      if (checkError) this.wxMpCode = 0;
      console.log('checkError', checkError);
      console.log('checkRes', checkRes);
      // console.log(this.wxMpCode);

      let { wxMpCode } = this;
      // if (!wxMpCode) return this.$u.toast('获取code失败,请重启小程序');
      if (!wxMpCode) (wxMpCode = await this._getWxMpCode());

      try {
        // 连同 code 和 手机号加密信息调用服务端登录接口
        const result = await loginUtil.userLogin(wxMpCode, phoneEncryptInfo);
        this.closeAuthLoginPopup();
        this.$u.toast('登录成功');
        this.$emit('loginSucEvt', true);
      } catch (error) {
        this.wxMpCode = 0;
        this._getWxMpCode();
        this.$u.toast('请重新登录');
        console.log(error);
      }
    },
    /**
     * 拒绝登录
     */
    refuseLogin() {
      this.isShowAuthLoginPopup = false;
      // this.$u.toast('需同意后才可继续使用企业律云');
    },
    /**
     * 导航进入 webview
     */
    routerToWebView(webUrl) {
      if (!webUrl) return;

      uni.navigateTo({
        url: '/pages/module-common/web-view/web-view',
        success: res => {
          res.eventChannel.emit('webViewEvt', { navTitle: '', webUrl });
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
