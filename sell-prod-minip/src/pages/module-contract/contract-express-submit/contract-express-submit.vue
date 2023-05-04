<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" immersive :background="{ backgroundColor: 'transparent' }">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-f.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="header-module">
      <view v-if="contractOrderDetail.status === 5" class="title">请填写寄回快递单号</view>
      <view v-else class="title">请填写寄出快递单号</view>
    </view>

    <view class="base-module">
      <!-- 快递单号 -->
      <view class="input-item">
        <view class="input-title" style="margin-right: 20rpx; font-size: 32rpx;">{{ expressInfo.courier_name }}</view>
        <input v-model="expressInfo.courier_number" class="input" style="text-align: left;" cursor-spacing="30" placeholder="请正确填写快递单号" placeholder-style="color: #D0D0D0; font-size: 32rpx;">
        <view class="input-title" @click="searchExpressInfoList">搜索</view>
        <view class="search-wrap">
          <view v-for="(eItem, eIndex) in searchExpressList" :key="eIndex" class="search-item" @click="selectExpress(eItem)">{{ eItem.name }}</view>
        </view>
      </view>
      <!-- 企业名称 -->
      <view class="express-method">
        <view v-if="contractOrderDetail.status !== 5" class="express-method-item" :class="{ 'express-method-item-active': expressInfo.mail_type === 1 }" @click="expressInfo.mail_type = 1">
          <view class="circle-outer">
            <view class="circle-inner" />
          </view>
          <text>快递寄出</text>
        </view>
        <view v-else class="express-method-item" :class="{ 'express-method-item-active': expressInfo.mail_type === 2 }" @click="expressInfo.mail_type = 2">
          <view class="circle-outer">
            <view class="circle-inner" />
          </view>
          <text>快递寄回</text>
        </view>
      </view>
    </view>

    <view class="divider-hor" />

    <view class="base-module">
      <!-- 企业名称 -->
      <view v-if="contractOrderDetail.status !== 5" class="input-item">
        <view class="input-title">企业名称</view>
        <input v-model="expressInfo.companyName" class="input" cursor-spacing="30" placeholder="请填写企业名称" placeholder-style="color: #D0D0D0; font-size: 32rpx;">
      </view>
      <!-- 联系人姓名 -->
      <view class="input-item">
        <view class="input-title">联系人姓名</view>
        <input v-model="expressInfo.contactName" class="input" cursor-spacing="30" placeholder="请填写联系人姓名" placeholder-style="color: #D0D0D0; font-size: 32rpx;">
      </view>
      <!-- 联系人电话 -->
      <view class="input-item">
        <view class="input-title">联系人电话</view>
        <input v-model="expressInfo.contactMobile" class="input" cursor-spacing="30" maxlength="11" placeholder="请填写联系人电话" placeholder-style="color: #D0D0D0; font-size: 32rpx;">
      </view>
      <!-- 联系人电话 -->
      <view class="input-item">
        <view class="input-title">合同附件</view>
        <view class="input" style="color: #0085FF;">{{ contractOrderDetail.title || '空' }}</view>
      </view>
    </view>

    <view class="submit-btn" @click="submitExpressInfo">确认提交</view>
  </view>
</template>

<script>
export default {
  name: 'ContractSignSubmit',
  data() {
    return {
      contractOrderId: '', // 合同订单 id
      contractOrderStatus: 0, // 合同订单状态
      contractOrderDetail: {}, // 合同订单详情

      expressInfo: {
        courier_number: '', // 快递单号
        courier_name: '', // 快递名称
        courier_field: '', // 快递标识
        mail_type: 1, // 快递类型 1: 寄出 2: 寄回

        companyName: '', // 企业名称
        contactName: '', // 联系人姓名
        contactMobile: '', // 联系人手机号
      },

      searchExpressList: [], // 搜索快递名称结果
    };
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

        // 寄出状态填写默认信息
        if (this.contractOrderDetail.status !== 5) {
          this.expressInfo.contactName = this.contractOrderDetail.customer_name;
          this.expressInfo.contactMobile = this.contractOrderDetail.customer_mobile;
        }
        // 寄回状态
        if (this.contractOrderDetail.status === 5) this.expressInfo.mail_type = 2;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 获取快递信息列表
     */
    async searchExpressInfoList() {
      const param = {
        courier_number: this.expressInfo.courier_number.trim()
      };

      try {
        const { data: searchExpressData } = await this.$api.getExpressName(param);
        this.searchExpressList = searchExpressData;

        if (!this.searchExpressList.length) {
          this.expressInfo.courier_name = '';
          this.expressInfo.courier_field = '';
          return this.$u.toast('未搜索到相关快递信息');
        }

        // 只有一个快递信息时默认设置
        if (this.searchExpressList.length === 1) {
          this.expressInfo.courier_name = this.searchExpressList[0].name;
          this.expressInfo.courier_field = this.searchExpressList[0].comCode;
          this.searchExpressList = [];
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 选择快递
     */
    selectExpress(express) {
      this.expressInfo.courier_name = express.name;
      this.expressInfo.courier_field = express.comCode;
      this.searchExpressList = [];
    },
    /**
     * 创建快递信息
     */
    submitExpressInfo() {
      if (!this.expressInfo.courier_number.trim()) return this.$u.toast('请填写快递单号');
      if (!this.expressInfo.courier_name || !this.expressInfo.courier_field) return this.$u.toast('请选择快递');
      if (this.contractOrderDetail.status !== 5 && !this.expressInfo.companyName.trim()) return this.$u.toast('请填写企业名称');
      if (!this.expressInfo.contactName.trim()) return this.$u.toast('请填写联系人姓名');
      if (!this.expressInfo.contactMobile.trim()) return this.$u.toast('请填写联系人电话');

      this._createExpressInfo();
    },
    /**
     * 创建快递信息
     */
    async _createExpressInfo() {
      uni.showLoading({ title: '提交中', mask: true });

      const param = {
        contract_order_id: this.contractOrderId, // 合同id
        enterprise_name: this.expressInfo.companyName.trim(), // 企业名称
        contacts_name: this.expressInfo.contactName.trim(), // 联系人姓名
        contacts_mobile: this.expressInfo.contactMobile.trim(), // 联系人手机号
        courier_name: this.expressInfo.courier_name.trim(), // 快递名称
        courier_field: this.expressInfo.courier_field, // 快递标识
        courier_number: this.expressInfo.courier_number.trim(), // 快递单号
        mail_type: this.expressInfo.mail_type // 快递类型
      };

      try {
        const { data: expressData } = await this.$api.createExpressInfo(param);
        this.$Router.replaceAll({ name: 'index' });
        uni.$emit('toastEvt', { msg: '邮寄信息创建成功' }); // 触发全局的 toast 事件
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
