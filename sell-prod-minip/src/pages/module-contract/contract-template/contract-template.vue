<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" :background="{ backgroundColor: '#fff' }" title="合同模板管理" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <!-- 合同模板列表 -->
    <view class="contract-module">
      <view v-for="cItem in contractTmpList" :key="cItem.sales_contract_template_id" class="contract-item" @click="$commonUtil.routeNavTo('contractSignEdit', { contractId: cItem.sales_contract_template_id, signType })">
        <view class="contract-left">
          <image class="icon-file" mode="aspectFill" src="../static/icon-word.png" />
        </view>
        <view class="contract-middle">
          <view class="contract-nameWrap">
            <view class="contract-name">{{ cItem.name }}</view>
            <view v-if="cItem.is_default" class="contract-tag">默认</view>
          </view>
          <view class="contract-time">
            <text>{{ cItem.created_at }}上传</text>
          </view>
        </view>
        <view class="contract-right">
          <image class="three-dot" mode="aspectFill" src="../static/three-dot.png" />
        </view>
      </view>
    </view>
    <!-- 提交 popup -->
    <u-popup v-model="isShowSubmitPopup" mode="bottom" border-radius="24" :mask-custom-style="{ background: 'rgba(0, 0, 0, .4)' }">
      <view class="-submit-box" @click.stop="$commonUtil.stopPropagation">
        fjehgh
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  name: 'ContractTemplate',
  data() {
    return {
      isShowSubmitPopup: true, // 是否显示

      contractTmpList: [], // 合同模板列表
    };
  },
  onLoad() {
    this._getContractTmpList();
  },
  methods: {
    /**
     * 获取合同订单详情
     */
    async _getContractTmpList(page = 1) {
      const param = { page, size: 100 };

      try {
        const { data: contractTmpData } = await this.$api.getContractTmpList(param);
        this.contractTmpList = contractTmpData.data;
      } catch (error) {
        console.log(error);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
