<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" immersive :background="{ backgroundColor: 'transparent' }">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-f.png" @click="backPrevPage" />
      </view>
    </u-navbar>

    <view class="img-module">
      <image class="img" mode="widthFix" :src="vipInfo.sales_share_image" @click="$commonUtil.previewImg([vipInfo.sales_share_image], vipInfo.sales_share_image)" />
    </view>

    <view class="btn-bottom">
      <view class="pay-btn" @click="buyVip">
        <text>￥{{ vipInfo.price || 0 }}</text>
        <text style="margin-left: 20rpx;">立即支付</text>
      </view>
      <view class="pay-protocol">
        <text>开通前请阅读</text>
        <text style="color: #0085FF;" @click="routerToWebView('https://oss.lawkd.com/document/enterprise_vip_service_20220427.html')">【年度法律服务套餐服务协议】</text>
        <text>和</text>
        <text style="color: #0085FF;" @click="routerToWebView('https://oss.lawkd.com/document/enterprise_vip_server_explain_20220427.html')">【服务说明】</text>
      </view>
    </view>

    <!-- 授权登录 popup -->
    <auth-login-popup ref="authLoginRef" @loginSucEvt="onLoginSucEvt" />
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import * as loginUtil from '@/common/utils/loginUtil';

export default {
  name: 'VipPay',
  data() {
    return {
      qrcodeScanInfo: {}, // 小程序二维码扫码信息
      vipInfo: {}, // vip 信息

      companyVipIsDiscount: 0, // 企业套餐是否优惠 0、1
      sellerFlag: '', // 销售标识
      shareVipType: '', // 分享 vip 类型 1： 个人 2：企业
      shareVipId: '', // 分享 vip id
    };
  },
  computed: {
    ...mapState('userModule', [ 'userInfo' ]),
    ...mapGetters('userModule', [ 'userId' ]),
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    console.log(routeParam);

    // 小程序分享卡片进入页面
    if (routeParam.sellerFlag) {
      this.sellerFlag = routeParam.sellerFlag;
      this.shareVipId = routeParam.shareVipId;
      this.shareVipType = routeParam.shareVipType;
    }

    if (!this.userId) this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框

    this._getShareVipInfo();
  },
  methods: {
    /**
     * 监听登录成功事件
     */
    onLoginSucEvt() {
      this._getShareVipInfo();
    },
    /**
     * 获取价格分享 vip 信息
     */
    async _getShareVipInfo() {
      if (!this.shareVipId) return;
      uni.showLoading({ title: '加载中', mask: true });

      try {
        const { data: vipInfoData } = await this.$api.getShareVipInfo({ vip_id: Number(this.shareVipId), type: this.shareVipType });
        this.vipInfo = vipInfoData;
        // 个人 vip 修正下 url
        // this.vipInfo.type === 1 && (this.vipInfo.url = { url: this.vipInfo.url });
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 购买 vip 套餐
     */
    async buyVip() {
      if (!this.userId) this.$refs.authLoginRef.openAuthLoginPopup(); // 打开授权登录弹框
      if (!this.vipInfo.id) return;
      let orderNo = ''; // 订单号

      uni.showLoading({ title: '购买中', mask: true });

      try {
        // 企业 vip 购买
        if (this.shareVipType === '2') {
          const param = { enterprise_vip_id: this.vipInfo.id, share_affairs_str: this.sellerFlag };
          const { data: orderData } = await this.$api.getServerSpecPayOrder(param);
          orderNo = orderData.order_no;

          console.log('企业：', orderNo);
        // 个人 vip 购买
        } else if (this.shareVipType === '1') {
          const param = { vip_id: this.vipInfo.id, share_affairs_str: this.sellerFlag };
          const { data: orderData } = await this.$api.getPersonVipPayOrder(param);
          orderNo = orderData.order_no;

          console.log('个人：', orderNo);
        }

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
          uni.$emit('toastEvt', { msg: '购买成功' }); // 触发全局的 toast 事件
          loginUtil.fetchUserInfo(); // 重新拉取个人信息
          uni.switchTab({ url: '/pages/tabbar/index/index' });
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
    /**
     * 回退上一页
     */
    backPrevPage() {
      // this.$store.dispatch('userModule/removeUserTokenAndUserInfoAction');
      this.$commonUtil.backClick();
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
