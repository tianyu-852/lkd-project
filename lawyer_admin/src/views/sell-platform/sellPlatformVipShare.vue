<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back">
        <span
          class="icon-back"
          @click="$router.back(-1)"
        >←</span>
      </div>

      <span class="focus-text">套餐分享总数：{{ pagination.total }}</span>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button
          icon="sync"
          size="small"
          style="margin-left: auto;"
          @click="_getSellPlatformSellerVipShareList(pagination.current)"
        >刷新</a-button>
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
        <a-table-column
          dataIndex="sales_side_share_id"
          title="ID"
          align="center"
        />

        <!-- 企业名称 -->
        <a-table-column
          dataIndex="alliance_name"
          title="企业名称"
          align="center"
        />

        <!-- 支付方式 -->
        <a-table-column
          dataIndex="pay_method_txt"
          title="支付方式"
          align="center"
        />

        <!-- 套餐名称 -->
        <a-table-column
          dataIndex="vip_name"
          title="套餐名称"
          align="center"
        />

        <!-- 购买人 -->
        <a-table-column
          dataIndex="user.nickname"
          title="购买人"
          align="center"
        />
        <!-- 支付状态 -->
        <a-table-column
          dataIndex="pay_status_txt"
          title="支付状态"
          align="center"
        />
        <!-- 销售名称 -->
        <a-table-column
          dataIndex="sales_name"
          title="销售姓名"
          align="center"
        />

        <!-- 销售电话 -->
        <a-table-column
          dataIndex="sales_phone"
          title="销售电话"
          align="center"
        />

        <!-- 订单时间 -->
        <a-table-column
          dataIndex="created_at"
          title="订单时间"
          align="center"
        />

        <!-- 金额 -->
        <a-table-column
          dataIndex="money"
          title="金额"
          align="center"
        />

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
          this._getSellPlatformSellerVipShareList(page)
          this.pagination.current = page
        },
      },

    }
  },
  created() {
    console.log(this.$route)
    const { sellUserId } = this.$route.params
    sellUserId && (this.sellUserId = sellUserId)

    this._getSellPlatformSellerVipShareList()
  },
  methods: {
    /**
     * 获取销售开单详情列表
     */
    async _getSellPlatformSellerVipShareList(page = 1) {
      if (!this.sellUserId) return
      const param = { page, size: this.pagination.pageSize }
      this.tableDataLoading = true

      try {
        const { data: vipShareData } = await sellPlatformApi.getSellPlatformSellerVipShareListApi(param)
        this.tableDataList = vipShareData.data
        this.pagination.total = vipShareData.total
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
