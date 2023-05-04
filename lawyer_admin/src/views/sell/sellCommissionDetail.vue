<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back">
        <span class="icon-back" @click="$router.back(-1)">←</span>
        <span>销售提成详情</span>
      </div>
      <!-- <span class="focus-text">销售提现详情</span> -->

    </a-layout-header>

    <a-card class="content">
      <!-- 表格 -->
      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.order_no)"
        :scroll="{ x: 2000 }"
        bordered
      >
        <!-- 销售 -->
        <a-table-column dataIndex="customer" title="销售" align="center" fixed="left" width="100px" />

        <!-- 客户 -->
        <a-table-column dataIndex="user_nickname" title="客户" align="center" />

        <!-- 客户手机 -->
        <a-table-column dataIndex="user_mobile" title="客户手机" align="center" />

        <!-- 客户注册时间 -->
        <a-table-column dataIndex="user_create_time" title="注册时间" align="center" />

        <!-- 套餐 -->
        <a-table-column dataIndex="vip_id" title="套餐" align="center" />

        <!-- 法务管家 -->
        <!-- <a-table-column dataIndex="customer" title="法务管家" align="center" /> -->

        <!-- 提成金额 -->
        <a-table-column dataIndex="commission_money" title="提成金额" align="center" />

        <!-- 开通时间 -->
        <a-table-column key="created_at" dataIndex="created_at" title="开通时间" align="center" />

        <!-- 到期时间 -->
        <a-table-column key="vip_expired_time" dataIndex="vip_expired_time" title="到期时间" align="center" />

        <!-- 订单号 -->
        <a-table-column title="订单号" align="center">
          <template slot-scope="record">
            <div class="column-order">{{ record.order_no }}</div>
          </template>
        </a-table-column>

        <!-- 支付类型 -->
        <a-table-column dataIndex="payment_type" title="支付类型" align="center" />

        <!-- 手机型号 -->
        <a-table-column dataIndex="device_type" title="手机型号" align="center" />
        
        <!-- 来源 -->
        <a-table-column dataIndex="source_type" title="来源" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="120px">
          <template slot-scope="record">
            <a-button type="link" style="margin-right: 10px" @click="navToOrderdetail(record)">发单详情</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
  </a-layout>
</template>

<script>
import * as sellApi from '@/api/sellApi'

export default {
  name: 'SellCommissionDetail',
  data() {
    return {
      sellUserId: 0, // 销售用户 id
      
      tabelDataList: [], // 标签列表
      tabelDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getSellCommissionList(page)
          this.pagination.current = page
        },
      },
    }
  },
  created() {
    console.log(this.$route.query)
    const sellUserId = this.$route.query.sellUserId
    this.sellUserId = sellUserId
    
    this._getSellCommissionList()
  },
  methods: {
    /**
     * 获取销售提成详情列表
     */
     async _getSellCommissionList(page = 1) {
       const param = { page, size: this.pagination.pageSize, customer_id: this.sellUserId }

       try {
         const { data: labelListData } = await sellApi.geSellCommissionApi(param)
         this.tabelDataList = labelListData.data
         this.pagination.total = labelListData.total
         this.pagination.current = page
         this.tabelDataLoading = false
       } catch (error) {
         this.tabelDataLoading = false
         console.log(error)
       }
    },

    /**
     * 进入订单详情
     */
    navToOrderdetail(record) {
      const userId = String(record.user_id)
      this.$router.push({ name: 'clientOrderDetail', query: { userId } })
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

// /deep/.ant-modal-body {
//   padding: 0;
// }
</style>
