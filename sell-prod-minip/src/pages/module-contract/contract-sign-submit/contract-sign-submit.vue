<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" immersive :background="{ backgroundColor: 'transparent' }">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-f.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="header-module">
      <view class="title">请填写企业用户信息</view>
    </view>

    <!-- 企业基本信息 -->
    <view class="base-module company-module">
      <view class="title-wrap">
        <view class="divider-ver" />
        <text class="text">企业基本信息</text>
      </view>
      <!-- 企业名称 -->
      <view class="input-item">
        <view class="input-title">
          <text style="color: #FE5F48; margin-right: 14rpx;">*</text>
          <text>企业名称</text>
        </view>
        <view class="input-wrap">
          <input v-model="companyInfo.companyName" class="input" cursor-spacing="30" placeholder="请填写企业名称" placeholder-style="color: #999; font-size: 32rpx;">
        </view>
      </view>
      <!-- 企业证件号 -->
      <view class="input-item">
        <view class="input-title">
          <text style="color: #FE5F48; margin-right: 14rpx;">*</text>
          <text>企业证件号</text>
        </view>
        <view class="input-wrap">
          <input v-model="companyInfo.creditCode" class="input" cursor-spacing="30" placeholder="请填写统一社会信用代码" placeholder-style="color: #999; font-size: 32rpx;">
        </view>
      </view>
      <!-- 企业法人姓名 -->
      <view class="input-item">
        <view class="input-title">
          <text style="color: #FE5F48; margin-right: 14rpx;">*</text>
          <text>企业法人姓名</text>
        </view>
        <view class="input-wrap">
          <input v-model="companyInfo.legalName" class="input" cursor-spacing="30" placeholder="请填写法人姓名" placeholder-style="color: #999; font-size: 32rpx;">
        </view>
      </view>
      <!-- 企业法人身份证号 -->
      <view class="input-item">
        <view class="input-title">
          <text style="color: #FE5F48; margin-right: 14rpx;">*</text>
          <text>企业法人身份证号</text>
        </view>
        <view class="input-wrap">
          <input v-model="companyInfo.legalIdNum" class="input" cursor-spacing="30" placeholder="请填写法人身份证号" placeholder-style="color: #999; font-size: 32rpx;">
        </view>
      </view>
      <!-- 企业地址 -->
      <view class="input-item">
        <view class="input-title">
          <text>企业地址</text>
        </view>
        <view class="input-wrap">
          <input v-model="companyInfo.companyAddr" class="input" cursor-spacing="30" placeholder="选填" placeholder-style="color: #999; font-size: 32rpx;">
        </view>
      </view>
    </view>

    <view class="divider-hor" />

    <!-- 签署人资料 -->
    <view class="base-module company-module">
      <view class="title-wrap">
        <view class="divider-ver" />
        <text class="text">签署人资料</text>
      </view>
      <!-- 企业用户签署人姓名 -->
      <view class="input-item">
        <view class="input-title">
          <text style="color: #FE5F48; margin-right: 14rpx;">*</text>
          <text>企业用户签署人姓名</text>
        </view>
        <view class="input-wrap">
          <input v-model="companyInfo.signerName" class="input" cursor-spacing="30" placeholder="请填写企业名称" placeholder-style="color: #999; font-size: 32rpx;">
        </view>
      </view>
      <!-- 企业用户签署人身份证号 -->
      <view class="input-item">
        <view class="input-title">
          <text style="color: #FE5F48; margin-right: 14rpx;">*</text>
          <text>企业用户签署人身份证号</text>
        </view>
        <view class="input-wrap">
          <input v-model="companyInfo.signerIdNum" class="input" cursor-spacing="30" placeholder="请填写身份证号" placeholder-style="color: #999; font-size: 32rpx;">
        </view>
      </view>
      <!-- 企业用户签署人手机号 -->
      <view class="input-item">
        <view class="input-title">
          <text style="color: #FE5F48; margin-right: 14rpx;">*</text>
          <text>企业用户签署人手机号</text>
        </view>
        <view class="input-wrap">
          <input v-model="companyInfo.signerMobile" class="input" cursor-spacing="30" placeholder="请填写手机号码" placeholder-style="color: #999; font-size: 32rpx;">
        </view>
      </view>
      <!-- 企业用户签署人邮箱 -->
      <view class="input-item">
        <view class="input-title">
          <text>企业用户签署人邮箱</text>
        </view>
        <view class="input-wrap">
          <input v-model="companyInfo.signerEmail" class="input" cursor-spacing="30" placeholder="选填" placeholder-style="color: #999; font-size: 32rpx;">
        </view>
      </view>
    </view>

    <view class="submit-btn" @click="submitSign">发起签署</view>

    <!-- 签署类型 modal -->
    <u-modal
      v-model="isShowSignTypeModal"
      :content-style="{ color: '#333', fontSize: '32rpx' }"
      show-cancel-button
      mask-close-able
      title="请选择签署方式"
      confirm-text="确定"
      confirm-color="#0085FF"
      @confirm="onSignTypeModalConfirmEvt"
    >
      <view class="umodal-type-box">
        <view class="signType-wrap">
          <view class="signType-item" :class="{ 'signType-item-active': signType === 1 }" @click="signType = 1">
            <view class="circle-outer">
              <view class="circle-inner" />
            </view>
            <text>在线签署</text>
          </view>
          <view class="signType-item" :class="{ 'signType-item-active': signType === 2 }" @click="signType = 2">
            <view class="circle-outer">
              <view class="circle-inner" />
            </view>
            <text>邮寄签署</text>
          </view>
        </view>
      </view>
    </u-modal>

    <!-- 成功提示 modal -->
    <u-modal
      v-model="isShowSucModal"
      :content-style="{ color: '#333', fontSize: '32rpx' }"
      confirm-text="知道了"
      confirm-color="#0085FF"
      content="已向客户发出「e签宝」在线签署短信通知"
      @confirm="onSucModalConfirmEvt"
    />
  </view>
</template>

<script>
export default {
  name: 'ContractSignSubmit',
  data() {
    return {
      contractOrderId: '', // 合同订单 id

      isShowSignTypeModal: false, // 是否显示签署方式 modal
      signType: 1, // 签署类型 1: e签宝签署 2: 邮寄签署

      isShowSucModal: false, // 是否显示成功提示 modal
      contractOrderDetail: null, // 合同订单详情

      // 企业信息
      companyInfo: {
        companyName: '', // 企业名称
        companyAddr: '', // 企业地址
        legalName: '', // 法人姓名
        legalIdNum: '', // 法人身份证号
        creditCode: '', // 企业证件号
        signerName: '', // 签署人姓名
        signerIdNum: '', // 签署人身份证号
        signerMobile: '', // 签署人手机号
        signerEmail: '', // 签署人邮箱
      },
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
      const param = { contract_order_id: this.contractOrderId };

      try {
        const { data: contractDetailData } = await this.$api.getContractOrderDetail(param);
        this.contractOrderDetail = contractDetailData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 提交签署
     */
    submitSign() {
      if (!this.contractOrderDetail) return this.$u.toast('获取合同详情失败');

      if (!this.companyInfo.companyName.trim()) return this.$u.toast('请填写企业名称');
      if (!this.companyInfo.creditCode.trim()) return this.$u.toast('请填写企业证件号');
      if (!this.companyInfo.legalName.trim()) return this.$u.toast('请填写企业法人姓名');
      if (!this.companyInfo.legalIdNum.trim()) return this.$u.toast('请填写企业法人身份证号');
      if (!(/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/.test(this.companyInfo.legalIdNum.trim()))) return this.$u.toast('请输入正确的企业法人身份证号');
      if (!this.companyInfo.signerName.trim()) return this.$u.toast('请填写签署人姓名');
      if (!this.companyInfo.signerIdNum.trim()) return this.$u.toast('请填写签署人身份证号');
      if (!(/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/.test(this.companyInfo.signerIdNum.trim()))) return this.$u.toast('请输入正确的签署人身份证号');
      if (!this.companyInfo.signerMobile.trim()) return this.$u.toast('请填写签署人手机号');
      if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.companyInfo.signerMobile.trim()))) return this.$u.toast('请输入正确的手机号');

      this.isShowSignTypeModal = true; // 打开签署类型 modal
    },
    /**
     * 监听签署类型 modal 确定事件
     */
    async onSignTypeModalConfirmEvt() {
      const { signType, contractOrderDetail, contractOrderId } = this;
      console.log(signType);

      try {
        // 未创建企业信息 则创建企业信息
        if (contractOrderDetail.status === 1) await this._createClientCompanyInfo();

        // 发起在线签署
        (signType === 1) && this._createESignFile();
        // 发起邮寄签署
        (signType === 2) && this.$commonUtil.routeNavTo('contractExpressSubmit', { contractOrderId });
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 创建客户企业信息
     */
    async _createClientCompanyInfo() {
      uni.showLoading({ title: '提交中', mask: true });

      const param = {
        contract_order_id: Number(this.contractOrderId),
        enterprise_name: this.companyInfo.companyName.trim(),
        enterprise_address: this.companyInfo.companyAddr.trim(),
        credit_code: this.companyInfo.creditCode.trim(),
        legal_person_name: this.companyInfo.legalName.trim(),
        legal_person_id_card: this.companyInfo.legalIdNum.trim(),
        signtory_name: this.companyInfo.signerName.trim(),
        signtory_id_card: this.companyInfo.signerIdNum.trim(),
        signtory_mobile: this.companyInfo.signerMobile.trim(),
        signtory_email: this.companyInfo.signerEmail.trim(),
        sign_type: Number(this.signType), // 签署类型
      };

      try {
        const { data: companyData } = await this.$api.createClientCompanyInfo(param);
        this.contractOrderDetail.status = 2; // status = 2：已创建完企业信息
      } catch (error) {
        console.log(error);
        throw new Error('创建企业信息失败');
      }
    },
    /**
     * 创建 e签宝 签署文件
     */
    async _createESignFile() {
      uni.showLoading({ title: '发起中', mask: true });

      const param = { order_no: this.contractOrderDetail.contract_order_no };
      try {
        const { data: eSignFileData } = await this.$api.createESignFile(param);
        const { fileId } = eSignFileData;
        // 发起 e签宝 签署
        this._launchESignFlow(fileId);
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 发起 e签宝 签署
     */
    async _launchESignFlow(fileId) {
      uni.showLoading({ title: '发起中', mask: true });

      const param = {
        type: 1, // 甲方类型 1：平台
        file_id: fileId, // 文件 id

        rec_type: 2, // 乙方类型 2：企业
        rec_name: this.companyInfo.signerName.trim(), // 签署人-姓名
        rec_account: this.companyInfo.signerMobile.trim(), // 签署人-手机号
        rec_cert_no: this.companyInfo.signerIdNum.trim(), // 签署人-身份证号
        rec_legal_rep_cert_type: 'CRED_PSN_CH_IDCARD', // 签署人-个人证件类型

        rec_org_name: this.companyInfo.companyName.trim(), // 企业-名称
        rec_org_cert_no: this.companyInfo.creditCode.trim(), // 企业-统一社会信用代码
        rec_legal_rep_name: this.companyInfo.legalName.trim(), // 企业-法人姓名
        rec_legal_rep_cert_no: this.companyInfo.legalIdNum.trim(), // 企业-法人身份证号

        order_no: this.contractOrderDetail.contract_order_no, // 订单号
      };

      try {
        const { data: launchData } = await this.$api.launchESignFlow(param);
        this.isShowSucModal = true;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 监听发出 e签宝通知 modal 确认事件
     */
    onSucModalConfirmEvt() {
      this.$Router.replaceAll({ name: 'tabIndex' });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
