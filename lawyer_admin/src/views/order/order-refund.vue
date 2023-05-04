

<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <!-- <span class="focus-text">订单退款</span> -->
    </a-layout-header>

    <a-card class="content">
      <div class="set-module">
        <div class="set-item order-refund">
          <div class="set-header">
            <span>订单退款</span>
          </div>
          <div class="input-wrap">
            <a-input class="input" v-model="refundOrderNo" placeholder="请输入订单号" allowClear />
            <a-button type="primary" @click="confirmSearchOrder" style="margin-left: 10px">搜索</a-button>
          </div>
        </div>

        <div class="set-item"></div>
      </div>
    </a-card>
  </a-layout>
</template>

<script>
import * as orderApi from '@/api/order'

export default {
  name: 'OrderRefund',
  data() {
    return {
      refundOrderNo: '', // 退款订单号
    }
  },
  created() {
    this.getAppConfigInfo()
  },
  methods: {
    /**
     * 确认搜索订单详情
     */
    async confirmSearchOrder() {
      const { refundOrderNo } = this
      try {
         const { data: mealData } = await orderApi.getOrderDetail(refundOrderNo.trim())
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 确认更新 律师接单 方式
     */
    async confirmUpdateLawyerOrderInfo() {
      const setValue = {
        optimization_lawyer: {
          enterprise_consultation: this.lawyerOrderInfo.bestEnterpriseConsult,
          individual_counseling:  this.lawyerOrderInfo.bestPersonConsult
        },
        lawyer: {
          enterprise_consultation: this.lawyerOrderInfo.reverseBestEnterpriseConsult,
          individual_counseling:  this.lawyerOrderInfo.reverseBestPersonConsult
        },
      }
      
      const param = {
        type: 'LAWYER_CONFIG',
        value: JSON.stringify(setValue)
      }

      try {
        const { data: lawyerOrderData } = await appApi.postAppConfgApi(param)
        this.$notification.success({ message: '更新律师接单方式成功', duration: 3 })
        this.getAppConfigInfo()
      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 90px;
    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }
}

.content {
  margin-top: 16px;
  background: #f4f5f5;
  .set-module {
    .set-item {
      float: left;
      min-width: 400px;
      min-height: 400px;
      border-radius: 10px;
      margin-right: 20px;
      margin-bottom: 20px;
      background: #fff;
      padding: 20px;
      .set-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 18px;
      }
      &.order-refund {
        .input-wrap {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      }
    }
  }
}
</style>
