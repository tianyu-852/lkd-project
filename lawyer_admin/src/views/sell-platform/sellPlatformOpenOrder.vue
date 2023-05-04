<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back">
        <span class="icon-back" @click="$router.back(-1)">←</span>
      </div>
      
      <span class="focus-text">开单总数：{{ pagination.total }}</span>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getSellPlatformSellerOpenOrderList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.contract_order_id)"
        bordered
      >
        <!-- id -->
        <a-table-column dataIndex="contract_order_id" title="ID" align="center" />

        <!-- 签约公司 -->
        <a-table-column dataIndex="enterprise_name" title="签约公司" align="center" />

        <!-- 购买套餐 -->
        <a-table-column dataIndex="enterprise_vip_name" title="购买套餐" align="center" />
        
        <!-- 签约合同 -->
        <a-table-column dataIndex="title" title="签约合同" align="center" />

        <!-- 开始时间 -->
        <a-table-column dataIndex="created_at" title="创建时间" align="center" />

        <!-- 截止时间 -->
        <a-table-column dataIndex="contract_effective" title="截止时间" align="center" />

        <!-- 签约金额 -->
        <a-table-column dataIndex="contract_money" title="签约金额" align="center" />

        <!-- 签约状态 -->
        <a-table-column dataIndex="status_text" title="签约状态" align="center" />

        <!-- 销售 -->
        <a-table-column dataIndex="sales_name" title="销售" align="center" />
      </a-table>
    </a-card>
  </a-layout>
</template>

<script>
import * as sellPlatformApi from '@/api/sellPlatformApi'

export default {
  name: 'SellPlatformOpenOrder',
  data() {
    return {
      tableDataList: [], // table 列表
      tableDataLoading: true, // 数据是否加载中

      sellUserId: '', // 小苏

      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getSellPlatformSellerOpenOrderList(page)
          this.pagination.current = page
        },
      },
      
    }
  },
  created() {
    console.log(this.$route)
    const { sellUserId } = this.$route.params
    sellUserId && (this.sellUserId = sellUserId)
    
    this._getSellPlatformSellerOpenOrderList()
  },
  methods: {
    /**
     * 获取销售开单详情列表
     */
     async _getSellPlatformSellerOpenOrderList(page = 1) {
       if (!this.sellUserId) return
       const param = { page, size: this.pagination.pageSize, customer_id: this.sellUserId }
       this.tableDataLoading = true

       try {
         const { data: leagueData } = await sellPlatformApi.getSellPlatformSellerOpenOrderListApi(param)
         this.tableDataList = leagueData.data
         this.pagination.total = leagueData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 进入销售开单列表
     */
    navToLeagueSellerPage(record) {
      const leagueId = String(record.contract_order_id)
      this.$router.push({ name: 'sellPlatformLeagueSell', params: { leagueId } })
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
    .back {
      margin-right: 16px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
      .icon-back {
        cursor: pointer;
      }
    }
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
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 13px;
  }
}

.league-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .input-title {
      font-size: 14px;
      font-weight: 500;
      min-width: 74px;
    }
    .input {
      flex: 1;
    }
  }
}
</style>
