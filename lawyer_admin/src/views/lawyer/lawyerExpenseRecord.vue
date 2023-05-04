<template>
  <a-layout class="main">
    <a-layout-header class="header-module">
      <div class="back-wrap" @click="$router.back()">
        <a-icon type="arrow-left" />

        <span>{{ lawyerInfo.nickname }}</span>
        <span style="margin-left: 6px;">消费记录</span>
      </div>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getLawyerExpenseRecordList(otherPagination.current)">刷新</a-button>
      </div>

      <!-- 第三方流水 -->
      <a-tabs v-model="activeTabKey">
        <a-tab-pane key="1" :tab="'第三方流水 ' + '(' + otherPagination.total + ')'">
          <a-table
            :data-source="otherTableList"
            :loading="otherTableLoading"
            :pagination="otherPagination"
            :rowKey="(record) => String(record.optimization_warehouse_id)"
            bordered
          >
            <!-- 消费项目 -->
            <a-table-column dataIndex="order_title" title="消费项目" align="center" />

            <!-- 金额 -->
            <a-table-column dataIndex="money_real" title="金额" align="center" />

            <!-- 消费时间 -->
            <a-table-column dataIndex="payment_at" title="消费时间" align="center" />
          </a-table>
        </a-tab-pane>
        
        <!-- 平台余额流水 -->
        <a-tab-pane key="2" :tab="'平台余额流水 ' + '(' + platformPagination.total + ')'">
          <a-table
            :data-source="platformTableList"
            :loading="platformTableLoading"
            :pagination="platformPagination"
            :rowKey="(record) => String(record.order_no)"
            bordered
          >
            <!-- 资金来源 -->
            <a-table-column dataIndex="balance_detail_type" title="资金来源" align="center" />

            <!-- 金额 -->
            <a-table-column dataIndex="money" title="金额" align="center" />

            <!-- 消费时间 -->
            <a-table-column dataIndex="created_at" title="消费时间" align="center" />

            <!-- 订单号 -->
            <a-table-column dataIndex="order_no" title="订单号" align="center" />
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-layout>
</template>

<script>
import moment from 'moment'
import * as lawyerApi from '@/api/lawyer'

export default {
  name: 'LawyerExpenseRecordPage',
  data() {
    return {
      activeTabKey: '1',
      lawyerInfo: {},

      // 第三方流水
      otherTableLoading: false,
      otherTableList: [],
      otherPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerExpenseRecordList(page)
          this.otherPagination.current = page
        },
      },

      // 平台流水
      platformTableLoading: false,
      platformTableList: [],
      platformPagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        onChange: page => {
          this._getUserPlatformExpenseRecordList(page)
          this.platformPagination.current = page
        },
      },
    }
  },
  created() {
    this.lawyerInfo = JSON.parse(sessionStorage.getItem('lawyerInfoSession'))
    this._getLawyerExpenseRecordList()
    this._getUserPlatformExpenseRecordList()
  },
  methods: {
    moment,

    /**
     * 获取 第三方支付 消费记录
     */
     async _getLawyerExpenseRecordList(page = 1) {
       const param = {
        page,
        size: this.otherPagination.pageSize,
        user_id: this.lawyerInfo.user_id,
       }
       this.otherTableLoading = true

       try {
         const { data: labelListData } = await lawyerApi.getUserOtherExpenseRecordApi(param)
         this.otherTableList = labelListData.data
         this.otherPagination.total = labelListData.total
         this.otherPagination.current = page
         this.otherTableLoading = false
       } catch (error) {
         this.otherTableLoading = false
         console.log(error)
       }
    },
    
    /**
     * 获取 平台余额 消费记录
     */
     async _getUserPlatformExpenseRecordList(page = 1) {
       const param = {
        page,
        size: this.platformPagination.pageSize,
        user_id: this.lawyerInfo.user_id,
       }
       this.platformTableLoading = true

       try {
         const { data: labelListData } = await lawyerApi.getUserPlatformExpenseRecordApi(param)
         this.platformTableList = labelListData.data
         this.platformPagination.total = labelListData.total
         this.platformPagination.current = page
         this.platformTableLoading = false
       } catch (error) {
         this.platformTableLoading = false
         console.log(error)
       }
    },
  }
}
</script>

<style lang="less" scoped>
.header-module {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 20px;
  .back-wrap {
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  }
}

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 12px;
  }
}

</style>
