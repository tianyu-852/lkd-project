<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back">
        <span class="icon-back" @click="$router.back(-1)">←</span>
        <span>订单数量：{{ pagination.total }}</span>
      </div>
    </a-layout-header>

    <a-card class="content">
      <!-- 表格 -->
      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.order_no)"
        bordered
      >
        <!-- 订单类型 -->
        <a-table-column dataIndex="order_title" title="订单类型" align="center" />

        <!-- 案件类型 -->
        <!-- <a-table-column dataIndex="order_demand_catgory" title="案件类型" align="center" /> -->

        <!-- 客户名称 -->
        <a-table-column dataIndex="user_nickname" title="客户名称" align="center" />

        <!-- 服务律师 -->
        <a-table-column dataIndex="lawyer_nickname" title="服务律师" align="center" />

        <!-- 应支出 -->
        <a-table-column dataIndex="lawyer_grab_price" title="应支出" align="center" />

        <!-- 实际支出 -->
        <a-table-column dataIndex="out_lawyer_grab_price" title="实际支出" align="center" />
        
        <!-- 提现状态 -->
        <a-table-column dataIndex="is_out" title="提现状态" align="center" />
        
        <!-- 发单客服 -->
        <a-table-column dataIndex="customer_nickname" title="发单客服" align="center" />

        <!-- 发单时间 -->
        <a-table-column dataIndex="created_at" title="发单时间" align="center" />

      </a-table>
    </a-card>
  </a-layout>
</template>

<script>
import moment from 'moment'
import * as clientApi from '@/api/clientApi'

export default {
  name: 'SellCommissionDetail',
  data() {
    return {
      userId: 0, // 用户 id
      enterpriseId: 0, // 企业 id
      
      tabelDataList: [], // 标签列表
      tabelDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getClientOrderDetailList(page)
          this.pagination.current = page
        },
      },

      // 过滤条件
      filterInfo: {
        startDate: moment().add(-1, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss'), // 开始时间
        endDate: moment().format('YYYY-MM-DD HH:mm:ss'), // 结束时间
      },
    }
  },
  created() {
    console.log(this.$route.query)
    // const userId = this.$route.query.userId
    // const enterpriseId = this.$route.query.enterpriseId
    this.userId = this.$route.query.userId
    this.enterpriseId = this.$route.query.enterpriseId
    
    this._getClientOrderDetailList()
  },
  methods: {
    /**
     * 获取订单详情列表
     */
     async _getClientOrderDetailList(page = 1) {
       this.tabelDataLoading = true

       // 请求参数
       const param = {
         page,
         size: this.pagination.pageSize,
         source_type: -1,
         created_at_sort: 1, // 发单时间倒序
         type: '[11, 18]',
        }
        // 个人 id
        this.userId && (param.user_id = this.userId)
        // 企业 id
        this.enterpriseId && (param.user_enterprise_id = this.enterpriseId)


       try {
         const { data: labelListData } = await clientApi.getClientOrderListApi(param)
         this.tabelDataList = labelListData.data
         this.pagination.total = labelListData.total
         this.pagination.current = page
         this.tabelDataLoading = false
       } catch (error) {
         this.tabelDataLoading = false
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
    align-items: center;
    justify-content: space-between;
    height: 90px;
    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
    .back {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
      .icon-back {
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
}

.content {
  margin-top: 16px;
  .column-order {
    cursor: pointer;
  }
}

.label-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .input-title {
      font-size: 14px;
      font-weight: 500;
    }
    .input {
      flex: 1;
    }
  }
}
</style>
