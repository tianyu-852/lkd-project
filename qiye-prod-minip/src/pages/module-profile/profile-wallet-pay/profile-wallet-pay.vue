<template>
  <view class="main">
    <u-navbar :is-back="false" :border-bottom="false" immersive :background="{ backgroundColor: 'transparent' }">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-f.png" @click="$commonUtil.backClick" />
      </view>
    </u-navbar>

    <view class="banner-module">
      <u-lazy-load img-mode="aspectFill" height="100vw" :loading-img="qiyeLoadImg400" :error-img="qiyeLoadImg400" :image="sysPayBannerImg" />
    </view>

    <!-- 充值 -->
    <view class="pay-option-module">
      <view class="option-wrap">
        <view v-for="(oItem, oIndex) in sysPayOptionList" :key="oIndex" class="option-item" @click="clickConfirmPay(oItem.money)">
          <image class="option-img" mode="aspectFill" :src="oItem.url" />
        </view>
      </view>

      <view class="custom-pay-btn" @click="openCustomPayPopup">
        <text>自定义充值</text>
        <image class="arrow-img" mode="aspectFill" src="@/static/common/arrow-right-3.png" @click="$commonUtil.backClick" />
      </view>

      <!-- 活动规则 -->
      <view class="rule-wrap">
        <view class="rule-header">活动规则</view>
        <view class="rule-title">一.关于充值</view>
        <view class="rule-items">
          <view class="rule-item">1.充值金额为人民币（元）</view>
          <view class="rule-item">2.充值金额为100的倍数，最低金额不低于100元</view>
          <view class="rule-item">3.充值由平台补贴充值金额的20%（以平台公布规则为准）</view>
        </view>
        <view class="rule-title">一.关于充值</view>
        <view class="rule-items" style="margin-bottom: 0;">
          <view class="rule-item">二.账户和信息安全</view>
          <view class="rule-item">1.您应自行设置账号的登录密码和支付密码，予以妥善保管不得外借并承担由此带来的风险</view>
        </view>
      </view>
    </view>

    <label for="shareBtnId">
      <view class="share-module">
        <image class="share-img" mode="aspectFill" src="@/static/common/share-square-f.png" />
        <text>分享</text>
      </view>
    </label>

    <!-- 自定义支付弹框 -->
    <u-popup v-model="isShowCustomPayPopup" mode="bottom" border-radius="24" :safe-area-inset-bottom="true" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }" @close="customMoneyFocus = false">
      <view class="upopup-customPay-box" @click.stop="stopPropagationEvt">
        <view class="upopup-title">自定义充值</view>
        <view class="pay-input-wrap" :style="{ borderColor: customPayMoney.trim() && !customPayMoneyVerify ? '#FE5F48' : '#999' }">
          <view class="icon-money">￥</view>
          <input v-model="customPayMoney" class="input-text" type="number" :focus="customMoneyFocus" maxlength="7" cursor-spacing="200" placeholder="请输入金额" placeholder-style="color: #999; font-size: 32rpx;" @confirm="customConfirmPay">
          <view v-if="customPayMoney.trim() && !customPayMoneyVerify" class="input-tips">请填写充值金额100的倍数</view>
        </view>
        <view class="pay-tips">
          <text>*充值金额为100的倍数</text>
          <text v-if="accountTotalMoney" style="color: #FE5F48">实际到账{{ accountTotalMoney }}元</text>
        </view>
        <view class="pay-btn" :class="{ 'pay-btn-active': customPayMoney.trim() && customPayMoneyVerify }" @click="customConfirmPay">立即充值</view>
        <view class="pay-protocol">
          <text>充值即代表您已同意</text>
          <text style="color: #0085FF;" @click="routerToWebView(appExplainInfo.wallet)">《企业律云钱包规则》</text>
        </view>
      </view>
    </u-popup>

    <!-- vip 购买提醒弹框 -->
    <u-popup v-model="isRemindVipPopup" mode="center" width="560" border-radius="30" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-vip-box" @click.stop="$commonUtil.stopPropagation">
        <image class="del-img" mode="aspectFill" src="@/static/common/arrow-del-9.png" @click="isRemindVipPopup = false" />

        <view class="upopup-vip-header">
          <view class="upopup-vip-title">平台百亿补贴</view>
          <view class="upopup-vip-subtitle">仅针对尊享版会员</view>
        </view>

        <view class="upopup-bottom-btns" @click.stop="isRemindVipPopup = false">
          <view class="upopup-bottom-btn" @click="$commonUtil.routeNavTo('module-common/service-contact/service-contact', { customer_id: officKefuInfo.customer_id, enterSrc: 'center' });">获取更多优惠</view>
          <view class="upopup-bottom-btn" @click="$commonUtil.routeNavTo('module-common/vip-pay-detail/vip-pay-detail')">立即开通</view>
        </view>
      </view>
    </u-popup>

    <button id="shareBtnId" open-type="share" style="display: none;" />

    <!-- 授权登录 popup -->
    <auth-login-popup ref="authLoginRef" />
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'ProfileWalletPay',
  data() {
    return {
      qiyeLoadImg400: this.$store.state.qiyeLoadImg400,

      sysPayBannerImg: '', // 系统支付 banner
      sysPayOptionList: [], // 系统支付选项列表

      isShowCustomPayPopup: false, // 是否显示自定义支付 popup
      customMoneyFocus: false, // 是否自定义输入框聚焦
      customPayMoney: '', // 自定义支付金额
      customPayMoneyVerify: true, // 自定义支付金额数值验证是否通过

      isRemindVipPopup: false, // 是否提醒购买 vip 服务
    };
  },
  computed: {
    ...mapState([ 'appExplainInfo', 'officKefuInfo' ]),
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapGetters('userModule', [ 'userId' ]),
    /**
     * 账号实际到账金额
     */
    accountTotalMoney() {
      let _accountTotalMoney = 0;

      const { customPayMoney, customPayMoneyVerify, userInfo } = this;
      if (!customPayMoneyVerify) return _accountTotalMoney;
      const { recharge_gift_money_rate } = userInfo;

      _accountTotalMoney = Number(customPayMoney.trim()) + (Number(customPayMoney.trim()) * recharge_gift_money_rate);
      return _accountTotalMoney;
    }
  },
  watch: {
    /**
     * 监听自定义金额数值，保证是100倍数的整数类型
     */
    customPayMoney(newVal) {
      if (!newVal.trim()) return this.customPayMoneyVerify = true;
      // customPayMoney
      const numRegExp = /^[1-9]+[0-9]*]*$/;
      const testResult = numRegExp.test(newVal.trim());
      if (!testResult) return this.customPayMoneyVerify = false;
      if (parseInt(newVal.trim(), 10) % 100 !== 0) return this.customPayMoneyVerify = false;

      this.customPayMoneyVerify = true;
    }
  },
  onLoad() {
    this._getSysPayOptionList();
  },
  onShareAppMessage() {
    const { appExplainInfo } = this;
    const currentRoute = this.$commonUtil.getCurrentRoute();

    return {
      title: `${ appExplainInfo.enterprise_vip_share.title }`,
      path: currentRoute,
      imageUrl: `${ this.sysPayBannerImg }`
    };
  },
  methods: {
    /**
     * 阻止事件冒泡
     */
    stopPropagationEvt() { return; },
    /**
     * 获取企业普法知识列表
     */
    async _getSysPayOptionList() {
      try {
        const { data: sysPayOptionData } = await this.$api.getSysPayOptionList();
        this.sysPayBannerImg = sysPayOptionData.banners[0].banner;
        this.sysPayOptionList = sysPayOptionData.items;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 检测是否已购买尊享版会员
     */
    _checkHighVip(userRights) {
      let _isPass = false;
      for (let rightItemObj of userRights) {
        // enterprise_subsidy: 尊享版会员
        if (Object.keys(rightItemObj).includes('enterprise_subsidy')) return true;
      }

      return _isPass;
    },
    /**
     * 打开自定义充值弹框
     */
    openCustomPayPopup() {
      if (!this.userId) return this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框
      if (!this.userInfo.user_privilege || (this.userInfo.user_privilege.length && !this._checkHighVip(this.userInfo.user_privilege))) return this.isRemindVipPopup = true;

      this.isShowCustomPayPopup = true;
      setTimeout(() => { this.customMoneyFocus = true; }, 500);
    },
    /**
     * 点击充值
     */
    clickConfirmPay(payMoney) {
      if (!this.userId) return this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框
      if (!this.userInfo.user_privilege || (this.userInfo.user_privilege.length && !this._checkHighVip(this.userInfo.user_privilege))) return this.isRemindVipPopup = true;

      // 发起支付
      this._launchPay(payMoney);
    },
    /**
     * 立即充值
     */
    async customConfirmPay() {
      if (!this.customPayMoney.trim()) return this.$u.toast('请输入充值金额');
      // 判断字符串是否为正整数数字
      const numRegExp = /^[1-9]+[0-9]*]*$/;
      const testResult = numRegExp.test(this.customPayMoney.trim());
      if (!testResult) return this.$u.toast('请输入整数金额');
      // 判断金额是否为 100 的倍数
      if (parseInt(this.customPayMoney.trim(), 10) % 100 !== 0) return this.$u.toast('充值金额需为100的倍数');

      const payMoneyNum = parseInt(this.customPayMoney.trim(), 10);
      // 发起支付
      this._launchPay(payMoneyNum);
    },
    /**
     * 发起支付
     */
    async _launchPay(payMoney) {
      if (!this.userId) return this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框
      if (!payMoney) return;

      uni.showLoading({ title: '充值中', mask: true });

      try {
        const { data: orderData } = await this.$api.getRechargePayOrder({ payment_money: payMoney });
        const orderNo = orderData.order_no; // 订单号
        if (!orderNo) return this.$u.toast('创建订单失败');
        // 获取微信支付参数 type = 1: 微信支付
        const { data: payParamData } = await this.$api.payOrder({ type: 1, order_no: orderNo });

        const [payError, payResult] = await uni.requestPayment({
          timeStamp: payParamData.timeStamp,
          nonceStr: payParamData.nonceStr,
          package: payParamData.package,
          paySign: payParamData.paySign,
          signType: payParamData.signType,
        });

        if (payError && payError.errMsg === 'requestPayment:fail cancel') return this.$u.toast('取消支付');

        if (payResult) {
          this.$u.toast('充值成功');
          // 重新拉取个人信息
          loginUtil.fetchUserInfo();
          // 回退上一页
          setTimeout(() => { uni.navigateBack(); }, 1000);
        }
      } catch (error) {
        console.log(error);
      }
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

<style>
page {
  background: #fff;
}
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
