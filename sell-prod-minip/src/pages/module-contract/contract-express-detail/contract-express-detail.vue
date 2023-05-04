<template>
  <view class="main">
    <u-navbar class="u-navbar" :is-back="false" :border-bottom="false" title="快递详情" title-width="340" title-color="#030303">
      <view class="navbar-slot">
        <image class="back-img" mode="aspectFill" src="@/static/common/back-arrow-3.png" @click="$commonUtil.backPage" />
      </view>
    </u-navbar>

    <!-- 快递模块 -->
    <view v-if="expressDetail.courier_json" class="express-module">
      <view class="express-info-wrap">
        <view class="express-info-title">{{ expressDetail.courier_name }}：</view>
        <view class="express-info-num">{{ expressDetail.courier_number }}</view>
        <view class="copy-btn" @click="copyExpressNum(expressDetail.courier_number)">复制</view>
      </view>

      <view class="express-timeline">
        <u-time-line>
          <u-time-line-item v-for="(eItem, eIndex) in expressDetail.courier_json.data" :key="eIndex" nodeTop="2">
            <!-- 左边内容 -->
            <template #node>
              <view class="u-node-left">
                <template v-if="eIndex === 0">
                  <image v-if="expressDetail.courier_json.state[0] === '0'" class="icon-node" mode="aspectFill" src="../static/icon-express-car.png" />
                  <image v-else-if="expressDetail.courier_json.state[0] === '5'" class="icon-node" mode="aspectFill" src="../static/icon-express-bag.png" />
                  <image v-else-if="expressDetail.courier_json.state[0] === '3'" class="icon-node" mode="aspectFill" src="../static/icon-express-gou.png" />
                  <image v-else class="icon-node" mode="aspectFill" src="../static/icon-express-car.png" />
                </template>
                <view v-else class="icon-dot" />
              </view>
            </template>
            <!-- 右边内容 -->
            <template #content>
              <view class="u-node-right" :class="{ 'u-node-right-one': eIndex === 0 }">
                <view class="u-order-time">{{ eItem.ftime }}</view>
                <view class="u-order-desc">{{ eItem.context }}</view>
              </view>
            </template>
          </u-time-line-item>
        </u-time-line>
      </view>
    </view>

    <u-empty v-else class="empty-img" text="未查询出快递信息" mode="list" />
  </view>
</template>

<script>
export default {
  name: 'ContractSignEdit',
  components: {},
  data() {
    return {
      contractOrderId: '', // 合同订单 id
      mailType: 1, // 邮寄类型 1：寄出 2：寄回

      expressDetail: {}, // 邮寄详情
    };
  },
  onLoad() {
    const { mailType, contractOrderId } = this.$Route.query;
    mailType && (this.mailType = mailType);
    contractOrderId && (this.contractOrderId = contractOrderId);

    this._getExpressDetail();
  },
  methods: {
    /**
     * 获取快递信息
     */
    async _getExpressDetail() {
      if (!this.contractOrderId) return;
      uni.showLoading({ title: '加载中', mask: true });

      const param = { contract_order_id: this.contractOrderId, mail_type: this.mailType };

      try {
        const { data: expressDetailData } = await this.$api.getExpressDetail(param);
        this.expressDetail = expressDetailData;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 复制快递单号
     */
    copyExpressNum(expressNum) {
      uni.setClipboardData({ data: expressNum });
    }
  },
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
