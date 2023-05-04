<template>
  <view class="main" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 44 + 10 + 'px' }">
    <u-navbar back-icon-color="#333" title-color="#333" :border-bottom="false" title="打款验证" />

    <view class="notice-module">
      <image class="icon-tanhao" mode="aspectFill" src="../static/icon-!-fill.png" />
      <text>填写收款金额剩余时间：</text>
      <u-count-down v-if="enterpriseBankVerifyInfo.time_out_timestamp" ref="uCountDown" :timestamp="enterpriseBankVerifyInfo.time_out_timestamp - (Math.floor(+new Date() / 1000))" :autoplay="false" :show-days="false" separator="zh" separator-color="#FE5F48" color="#FE5F48" bg-color="#F5F5F5" />
    </view>

    <view class="info-module">
      <!-- 收款金额 -->
      <view class="content-item">
        <view class="item-title">收款金额</view>
        <view class="input-wrap">
          <input v-model="money" class="input-text" type="number" cursor-spacing="30" placeholder="请填写收款金额" placeholder-style="color: #bbb; font-size: 30rpx;">
          <text>元</text>
        </view>
      </view>
      <!-- 验证类型 -->
      <view class="info-item">
        <view class="info-key">验证类型</view>
        <view class="info-value">{{ enterpriseBankVerifyInfo.enterprise_type === 1 ? '企业' : '个体户' }}</view>
      </view>
      <!-- 企业名称 -->
      <view class="info-item">
        <view class="info-key">企业名称</view>
        <view class="info-value">{{ enterpriseBankVerifyInfo.enterprise_name }}</view>
      </view>
      <!-- 开户行 -->
      <view class="info-item">
        <view class="info-key">开户行</view>
        <view class="info-value">{{ enterpriseBankVerifyInfo.bank_name_chinese }}</view>
      </view>
      <!-- 银行卡号 -->
      <view class="info-item">
        <view class="info-key">银行卡号</view>
        <view class="info-value">{{ enterpriseBankVerifyInfo.bank_card }}</view>
      </view>
      <!-- 提交时间 -->
      <view class="info-item">
        <view class="info-key">提交时间</view>
        <view class="info-value">{{ enterpriseBankVerifyInfo.cert_created_at }}</view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-btns" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view class="verify-btn" style="margin-right: 24rpx;" @click="delEnterpriseVerifyInfo">重新验证</view>
      <view class="verify-btn" @click="sumbitVerify">确认打款金额</view>
    </view>

    <!-- 认证成功 popup -->
    <u-popup v-model="isShowApproveSuccessPopup" mode="center" width="520" border-radius="24" :mask-close-able="false" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-success-box" @click.stop="$commonUtil.stopPropagation">
        <view class="success-img-wrap">
          <image class="icon-success" mode="aspectFill" src="https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/lkd-file/2022830-1661842812641-sAMsXm.png" />
        </view>
        <view class="info-item" style="font-size: 32rpx; margin-bottom: 16rpx;">恭喜您，企业账号</view>
        <view class="info-item" style="font-size: 42rpx; font-weight: 500; margin-bottom: 16rpx; color: #0085FF;">已认证成功</view>
        <view class="info-item" style="font-size: 32rpx; margin-bottom: 16rpx; color: #999;">为您的企业规范迈出第一步</view>
        <view class="ok-btn" @click="$commonUtil.backPage">知道了</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ProfileEnterpriseApproveVerify',
  data() {
    return {
      money: '', // 打款金额
      isShowApproveSuccessPopup: false, // 是否显示认证成功 popup
      enterpriseBankVerifyInfo: {}, // 企业银行验证信息
    };
  },
  computed: {
    ...mapGetters(['sysScreenHeight', 'sysSafeAreaHeight']),
  },
  onLoad() {
    this._getEnterpriseBankVerifyInfo();
  },
  methods: {
    /**
     * 获取用户企业信息
     */
    async _getEnterpriseBankVerifyInfo() {
      uni.showLoading({ title: '加载中', mask: true });

      try {
        const { data: enterpriseBankVerifyData } = await this.$api.getEnterpriseBankVerifyInfo();
        this.enterpriseBankVerifyInfo = enterpriseBankVerifyData;
        // this.$refs.uCountDown.start();
        setTimeout(() => { this.$refs.uCountDown.start(); }, 0);
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 提交验证
     */
    async sumbitVerify() {
      if (!this.money.trim()) return this.$u.toast('请输入收款金额');
      uni.showLoading({ title: '提交中', mask: true });

      const param = {
        type: 3, // 企业打款认证类型
        money: this.money.trim(), // 金额
        order_no: this.enterpriseBankVerifyInfo.order_no, // 订单号
      }
      try {
        const { data: bankVerifyData } = await this.$api.postEnterpriseBankVerifyInfo(param);
        this.isShowApproveSuccessPopup = true;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 删除企业认证信息
     */
    async delEnterpriseVerifyInfo() {
      const [error, res] = await uni.showModal({ title: '提示', confirmColor: '#0085FF', content: '请确认是否重新验证？' });
      if (!res.confirm) return;
      uni.showLoading({ title: '', mask: true });

      try {
        const { data: delData } = await this.$api.delEnterpriseVerifyInfo();
        const pages = getCurrentPages();
        const lastpage = pages[pages.length - 2];
        // 上个页面是「身份认证」页面则回退
        if (lastpage.route === 'pages/module-profile/profile-enterprise-approveIdentity/profile-enterprise-approveIdentity') {
          this.$commonUtil.backPage();
        } else {
          uni.redirectTo({ url: '/pages/module-profile/profile-enterprise-approveIdentity/profile-enterprise-approveIdentity' });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
