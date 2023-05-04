<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" :title="contractOrderDetail.title" title-width="340" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="xiaoshou">
      <text>{{ contractOrderDetail.is_alliance ? '加盟商' : '销售' }}：</text>
      <text>{{ contractOrderDetail.initiator_name }}</text>
    </view>

    <!-- 线上签署 -->
    <view v-if="contractOrderDetail.sign_type === 1" @click="$commonUtil.previewImg([contractOrderDetail.contract_signed_img], contractOrderDetail.contract_signed_img)">
      <image class="contract-img" style="width: 100%; height: 100rpx;" mode="widthFix" :src="contractOrderDetail.contract_signed_img" />
    </view>

    <!-- 线下邮寄 -->
    <view v-else-if="contractOrderDetail.sign_type === 2" class="contract-express-module">
      <view class="express-title">此合同签署类型为线下邮寄</view>
      <view class="preview-btn" @click="$commonUtil.routeNavTo('contractExpressDetail', { contractOrderId, mailType: 2 })">
        <text>查看合同快递信息</text>
      </view>
    </view>

    <view class="upload-module">
      <view class="upload-title">打款截图</view>

      <view class="image-wrap">
        <view class="image-item">
          <image class="image" mode="aspectFill" :src="contractOrderDetail.transfer_screenshot" @click="$commonUtil.previewImg([contractOrderDetail.transfer_screenshot], contractOrderDetail.transfer_screenshot)" />
        </view>
      </view>
    </view>

    <view class="btns-module" :style="{ paddingBottom: (sysSafeAreaHeight || 10) + 'px' }">
      <view class="refuse-btn" @click="openCheckPopup(2)">驳回</view>
      <view class="submit-btn" @click="openCheckPopup(1)">通过</view>
    </view>

    <!-- 同意 popup -->
    <u-popup v-model="isShowAgreePopup" mode="center" width="540" border-radius="24" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-agree-box" @click.stop="$commonUtil.stopPropagation">
        <view class="agree-header">
          <image class="icon-del" mode="aspectFill" src="../static/icon-popup-delB.png" @click="isShowAgreePopup = !isShowAgreePopup" />
          <view class="contract-name">{{ contractOrderDetail.title }}</view>
        </view>
        <view class="input-wrap">
          <!-- 客户姓名 -->
          <view class="input-item">
            <view class="input-key">客户姓名</view>
            <view class="input-value">{{ contractOrderDetail.customer_name }}</view>
          </view>
          <!-- 手机号码 -->
          <view class="input-item">
            <view class="input-key">手机号码</view>
            <view class="input-value">{{ contractOrderDetail.customer_mobile }}</view>
          </view>
          <!-- VIP等级 -->
          <view class="input-item">
            <view class="input-key">VIP等级</view>
            <view class="input-value">{{ contractOrderDetail.enterprise_vip_name }}</view>
          </view>
          <!-- 合同有效期 -->
          <view class="input-item">
            <view class="input-key">VIP有效期</view>
            <view class="input-value">{{ contractOrderDetail.contract_effective_text | contractTimeFilter }}</view>
          </view>
          <!-- 合同金额 -->
          <view class="input-item">
            <view class="input-key">VIP金额</view>
            <view class="input-value">
              <text style="margin-right: 10rpx;">￥</text>
              <input v-model="vipPrice" class="input" maxlength="6" :cursor-spacing="30" placeholder="请输入合同金额" placeholder-style="color: #999; font-size: 30rpx;">
            </view>
          </view>

          <view class="confirm-btn" @click="financePostCheck">确认</view>
        </view>
      </view>
    </u-popup>

    <!-- 驳回 popup -->
    <u-popup v-model="isShowRefusePopup" mode="center" width="540" border-radius="24" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="upopup-refuse-box" @click.stop="$commonUtil.stopPropagation">
        <view class="refuse-header">
          <image class="icon-del" mode="aspectFill" src="../static/icon-popup-del9.png" @click="isShowRefusePopup = !isShowRefusePopup" />
          <view class="contract-name">驳回原因</view>
        </view>

        <view class="textarea-wrap">
          <textarea v-model="refuseContent" class="textarea" :cursor-spacing="30" placeholder="请输入驳回原因" placeholder-style="color: #999; font-size: 32rpx;" />
        </view>

        <view class="confirm-btn" @click="financePostCheck">提交</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';

export default {
  name: 'ContractFinanceCheck',
  filters: {
    // 合同日期
    contractTimeFilter(value) {
      return dayjs(value).format('YYYY-MM-DD');
    },
  },
  data() {
    return {
      contractOrderId: 0, // 合同订单 id
      contractOrderDetail: {}, // 合同订单详情

      isShowAgreePopup: false, // 是否显示同意 popup
      isShowRefusePopup: false, // 是否显示拒绝 popup
      refuseContent: '', // 拒绝原因

      vipPrice: '', // 合同金额
      checkType: 0, // 审核类型 1：通过 2：驳回
    };
  },
  computed: {
    ...mapGetters(['sysSafeAreaHeight']),
  },
  onLoad() {
    const { contractOrderId } = this.$Route.query;
    contractOrderId && (this.contractOrderId = contractOrderId);

    this._getContractOrderDetail();
  },
  methods: {
    /**
     * 获取合同订单详情
     */
    async _getContractOrderDetail() {
      if (!this.contractOrderId) return;
      uni.showLoading({ title: '加载中', mask: true });
      const param = { contract_order_id: this.contractOrderId };

      try {
        const { data: contractDetailData } = await this.$api.getContractOrderDetail(param);
        this.contractOrderDetail = contractDetailData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 打开审核 popup
     */
    openCheckPopup(checkType) {
      this.checkType = checkType;
      // 打开同意 popup
      (this.checkType === 1) && (this.isShowAgreePopup = true);
      // 打开驳回 popup
      (this.checkType === 2) && (this.isShowRefusePopup = true);
    },
    /**
     * 财务提交审核
     */
    async financePostCheck() {
      const { checkType } = this;

      const param = { contract_order_id: this.contractOrderId };

      if (checkType === 1) {
        if (!this.vipPrice.trim()) return this.$u.toast('请输入vip金额');
        param.audit_type = 1; // 审核类型
        param.contract_money = this.vipPrice.trim(); // vip 金额
        param.content = '';
      } else {
        if (!this.refuseContent.trim()) return this.$u.toast('请输入驳回理由');
        param.audit_type = 2;
        param.content = this.refuseContent.trim();
      }

      uni.showLoading({ title: '提交中', mask: true });

      console.log(param);

      try {
        const { data: financeCheckData } = await this.$api.financePostCheck(param);
        const eventChannel = this.getOpenerEventChannel();
        this.$Router.back(1, {
          success: (...arg) => {
            eventChannel.emit('financeCheckEvt', { financeCheckStatus: true });
          }
        });
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
