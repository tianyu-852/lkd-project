<template>
  <a-layout class="main">
    <a-layout-header class="header-module">
      <div class="back-wrap" @click="$router.back()">
        <a-icon type="arrow-left" />

        <span>{{ clientInfo.nickname }}</span>
        <span style="margin-left: 6px;">消费记录：{{ pagination.total }}</span>
      </div>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getLawyerExpenseRecordList(pagination.current)">刷新</a-button>
      </div>

      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
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
    </a-card>
  </a-layout>
</template>

<script>
import moment from 'moment'
import * as lawyerApi from '@/api/lawyer'

export default {
  name: 'ClientExpenseRecordPage',
  data() {
    return {
      clientInfo: {},
      
      tableDataLoading: false,
      tableDataList: [],

      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerExpenseRecordList(page)
          this.pagination.current = page
        },
      },
    }
  },
  created() {
    this.clientInfo = JSON.parse(sessionStorage.getItem('clientInfoSession'))
    this._getLawyerExpenseRecordList()
  },
  methods: {
    moment,

    /**
     * 获取企业客户消费记录列表
     */
     async _getLawyerExpenseRecordList(page = 1) {
       const param = {
        page,
        size: this.pagination.pageSize,
        user_id: this.clientInfo.user_id,
       }
       
       this.tableDataLoading = true

       try {
         const { data: labelListData } = await lawyerApi.getUserOtherExpenseRecordApi(param)
         this.tableDataList = labelListData.data
         this.pagination.total = labelListData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
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
