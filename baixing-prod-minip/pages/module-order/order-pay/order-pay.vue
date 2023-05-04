<template>
  <view>
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" back-icon-color="#fff" :title="causeOrderDetial.enterprise_demand_type.enterprise_demand_type" title-color="#fff" :background="{ backgroundColor: '#0085FF' }">
      <view class="navbar-slot">
        <u-icon name="arrow-left" color="#fff" size="40" :custom-style="{ padding: '0 24rpx;' }" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="detail-module">
      <!-- 涉及分类 -->
      <view class="detail-item">
        <view class="detail-left">涉及分类</view>
        <view class="detail-right">
          <text>{{ causeOrderDetial.category }}</text>
        </view>
      </view>
      <!-- 律师地区 -->
      <view class="detail-item">
        <view class="detail-left">律师地区</view>
        <view class="detail-right">
          <text v-if="causeOrderDetial.lawyer_province !== causeOrderDetial.lawyer_city" style="margin-right: 20rpx;">{{ causeOrderDetial.lawyer_province }}</text>
          <text>{{ causeOrderDetial.lawyer_city }}</text>
        </view>
      </view>
      <!-- 服务时长 -->
      <view class="detail-item">
        <view class="detail-left">服务时长</view>
        <view class="detail-right">
          <text>{{ causeOrderDetial.service_time }}小时</text>
        </view>
      </view>
      <!-- 数量 -->
      <view class="detail-item">
        <view class="detail-left">数量</view>
        <!-- 组合订单：14 -->
        <view v-if="causeOrderDetial.enterprise_demand_type_id === 14" class="detail-right detail-num">
          {{ causeOrderDetial.combi_string }}
        </view>
        <view v-else class="detail-right detail-num">
          {{ causeOrderDetial.enterprise_demand_type.enterprise_demand_type }} X{{ causeOrderDetial.num }}
        </view>
      </view>
      <!-- 订单金额 -->
      <view class="detail-item">
        <view class="detail-left">订单金额</view>
        <view class="detail-right">
          <text style="color: #FE5F48;">{{ causeOrderDetial.money }}元</text>
        </view>
      </view>
      <!-- 案件描述 -->
      <view v-if="causeOrderDetial.content" class="detail-item">
        <view class="detail-left">案件描述</view>
        <view class="detail-right">
          <text>{{ causeOrderDetial.content }}</text>
        </view>
      </view>
    </view>

    <view class="bottom-btns" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view class="pay-btn" @click="payCauseOrder">￥{{ causeOrderDetial.money || 0 }} 立即支付</view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'OrderPay',
  data() {
    return {
      bxLoadImg300: this.$store.state.bxLoadImg300,
      // orderId: '438644107242639360', // 订单 id
      orderId: '', // 订单 id

      causeOrderDetial: {}, // 订单详情
    };
  },
  computed: {
    ...mapState('userModule', ['userInfo']),

    ...mapGetters(['sysSafeAreaHeight']),
    ...mapGetters('userModule', ['userId']),
  },
  onLoad(query) {
    const routeParam = this.$commonUtil.routeParamParse(query);
    if (routeParam.order_share_log_id) this.orderId = routeParam.order_share_log_id

    this._getPayCauseOrderDetail();
  },
  onShareAppMessage() {
    const currentRoute = this.$commonUtil.getCurrentRoute();

    return {
      title:'一站式企业法律服务',
      path: `${ currentRoute }?order_share_log_id=${ this.orderId }`,
      imageUrl: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/20221011-1665468302906-K531Fw.png'
    }
  },
  methods: {
    /**
     * 获取支付案源订单详情
     */
    async _getPayCauseOrderDetail() {
      if (!this.orderId) return;

      const param = { order_share_log_id: this.orderId };
      uni.showLoading({ title: '加载中', mask: true });
      
      try {
        const { data: causeOrderData } = await this.$api.getPayCauseOrderDetailApi(param);
        this.causeOrderDetial = causeOrderData;
      } catch(error) {
        console.log(error);
      }
    },
    /**
     * 支付订单
     */
    async payCauseOrder() {
      // 未登录进入登录页面
      if (!this.userId) return uni.navigateTo({ url: '/pagesV1/common/login' });
      if (!this.orderId) return;
      uni.showLoading({ title: '', mask: true });

      const param = { order_share_log_id: this.orderId };

      try {
        const { data: orderData } = await this.$api.postPayCauseOrderApi(param);
        const orderNo = orderData.order_no; // 订单号
        if (!orderNo) return this.$u.toast('创建订单失败');

        // 获取微信支付参数 type = 1: 微信支付
        const { data: payParamData } = await this.$api.payOrderApi({ type: 1, order_no: orderNo });

        const [payError, payResult] = await uni.requestPayment({
          timeStamp: payParamData.timeStamp,
          nonceStr: payParamData.nonceStr,
          package: payParamData.package,
          paySign: payParamData.paySign,
          signType: payParamData.signType,
        });

        if (payError && payError.errMsg === 'requestPayment:fail cancel') return this.$u.toast('取消支付');
        if (payResult) {
          this.$commonUtil.backPage();
          uni.$emit('toastEvt', { msg: '支付成功' });
        }
      } catch(error) {
        console.log(error);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
