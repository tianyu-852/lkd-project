<template>
  <view>
    <u-navbar :is-back="false" :border-bottom="false" title="选择合同" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <!-- 合同列表 -->
    <view class="contract-module">
      <view v-for="cItem in contractList" :key="cItem.sales_contract_template_id" class="contract-item" @click="navToSignEditPage(cItem.sales_contract_template_id)">
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
          <image class="icon-arrow" mode="aspectFill" src="@/static/common/arrow-right-9.png" />
        </view>
      </view>
    </view>

    <u-empty v-if="!contractList.length" class="empty-img" text="无合同模板信息" mode="list" />
  </view>
</template>

<script>
export default {
  name: 'ContractSignList',
  data() {
    return {
      signType: 0, // 签署类型 1: 在线签署 2：邮寄签署

      contractList: [], // 合同列表
      contractPage: 1, // 合同当前页数
      contractTotal: 0, // 合同总数
    };
  },
  onLoad() {
    const { signType } = this.$Route.query;
    this.signType = signType;

    this._getSignContractList();
  },
  methods: {
    /**
     * 获取签署合同模板列表
     */
    async _getSignContractList(page = 1) {
      uni.showLoading({ title: '加载中', mask: true });
      const param = { page };

      try {
        const { data: signContractData } = await this.$api.getSignContractList(param);
        this.contractList.push(...signContractData.data);
        this.contractTotal = signContractData.total;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 导航进入合同编辑页面
     */
    navToSignEditPage(contractTmpId) {
      if (!contractTmpId) return;
      this.$Router.replace({ name: 'contractSignEdit', params: { contractTmpId, signType: this.signType } });
    },
  }
};
</script>
<style lang="scss" scoped>
  @import './style.scss';
</style>
