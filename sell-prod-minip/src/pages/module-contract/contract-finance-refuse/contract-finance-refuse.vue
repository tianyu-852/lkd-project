<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" :title="contractOrderDetail.title" title-width="340" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <view class="refuse-module">
      <view class="refuse-header">
        <image class="refuse-img" mode="aspectFill" src="../static/refuse-r.png" />
        <text class="refuse-key">财务已驳回</text>
      </view>
      <view class="refuse-reason">{{ contractOrderDetail.financial_last_rejected_message }}</view>
    </view>

    <view class="diveder-line" />

    <view class="contract-module" @click="$commonUtil.previewImg([contractOrderDetail.contract_signed_img], contractOrderDetail.contract_signed_img)">
      <image class="contract-img" style="width: 100%; height: 100rpx;" mode="widthFix" :src="contractOrderDetail.contract_signed_img" />
    </view>

    <view class="upload-module">
      <view class="upload-title">请上传打款截图</view>

      <view class="image-wrap">
        <view v-if="payImage" class="image-item">
          <image class="image" mode="aspectFill" :src="payImage" @click="$commonUtil.previewImg([payImage], payImage)" />
          <image class="icon-del" mode="aspectFill" src="../static/icon-image-del.png" @click="payImage = ''" />
        </view>

        <view v-else class="image-empty" @click="chooseImage">
          <image class="icon-camera" mode="aspectFill" src="../static/icon-camera-fill.png" />
          <text>上传图片</text>
        </view>
      </view>
    </view>

    <view class="submit-btn" @click="submitPayImage">提交</view>
  </view>
</template>

<script>
import fileUtil from '@/common/utils/fileUtil';

export default {
  name: 'ContractPayImage',
  data() {
    return {
      contractOrderId: 0, // 合同订单id

      contractOrderDetail: {}, // 合同订单详情
      payImage: '', // 打款截图
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
     * 选择图片
     */
    async chooseImage() {
      const [error, imgRes] = await uni.chooseMedia({ count: 1, mediaType: ['image'] });
      if (error) return;
      const tempFilePath = imgRes.tempFiles[0].tempFilePath;
      this.payImage = tempFilePath;
    },
    /**
     * 提交打款截图
     */
    async submitPayImage() {
      if (!this.contractOrderId) return;
      if (!this.payImage) return this.$u.toast('请上传打款截图');
      uni.showLoading({ title: '提交中', mask: true });

      try {
        // 上传文件到 oss
        const imageUrl = await fileUtil.uploadFile(this.payImage);
        const param = { contract_order_id: this.contractOrderId, transfer_screenshot: imageUrl };

        const { data: postPayImgaeData } = await this.$api.postContractPayImg(param);

        this.$Router.back();
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit('postPayImageEvt', { postPayImageStatus: true });
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
