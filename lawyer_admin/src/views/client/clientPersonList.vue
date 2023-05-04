<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">个人客户：{{ pagination.total }}</span>

      <!-- 搜索输入框 -->
      <div class="mobile-input-wrap">
        <a-input allow-clear placeholder="搜索手机号" v-model="searchMobile" @keyup.enter="getSearchData" style="margin: 0 5px; width: 180px" />
        <a-button type="primary" @click="getSearchData">搜索</a-button>
      </div>

      <!-- 时间筛选 -->
      <!-- <a-range-picker
        class="date-range-picker"
        @change="onDateChange"
        @ok="getSearchData"
        :placeholder="['开始日期', '结束日期']"
        :default-value="[filterInfo.startDate, filterInfo.endDate]"
        format="YYYY-MM-DD HH:mm:ss"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
        }"
      /> -->

    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getClientPersonList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.user_id)"
        bordered
      >
        <!-- id -->
        <a-table-column dataIndex="user_id" title="用户ID" align="center" />

        <!-- 用户名称 -->
        <a-table-column dataIndex="nickname" title="用户名称" align="center" />

        <!-- 手机号 -->
        <a-table-column dataIndex="mobile" title="手机号" align="center" />

        <!-- 套餐 -->
        <a-table-column dataIndex="vip_name" title="套餐" align="center" />

        <!-- 价格 -->
        <a-table-column dataIndex="vip_discount_price" title="价格" align="center" />

        <!-- 开户时间 -->
        <a-table-column dataIndex="vip_new_time" title="开户时间" align="center" />

        <!-- 应支出 -->
        <a-table-column dataIndex="all_order_price" title="应支出" align="center" />

        <!-- 实际支出 -->
        <a-table-column dataIndex="price" title="实际支出" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="100px">
          <template slot-scope="record">
            <a-button type="link" style="margin-right: 10px" @click="navToOrderdetail(record)">发单详情</a-button>
          </template>
        </a-table-column>
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
          this._getClientPersonList(page)
          this.pagination.current = page
        },
      },

      // 过滤条件
      filterInfo: {
        startDate: moment().add(-1, 'years').startOf('year').format('YYYY-MM-DD HH:mm:ss'), // 开始时间
        endDate: moment().format('YYYY-MM-DD HH:mm:ss'), // 结束时间
      },

      searchMobile: '', // 搜索手机号
    }
  },
  created() {
    this._getClientPersonList()
  },
  methods: {
    moment,
    /**
     * RangePicker 发生变化的回调
     */
    onDateChange(date, dateStrAry) {
      this.filterInfo.startDate = dateStrAry[0]
      this.filterInfo.endDate = dateStrAry[1]
      // 清空日期选择重新请求一次
      if (!dateStrAry[0] || !dateStrAry[1]) this._getQiyeClientList()
    },
    /**
     * 获取销售提成详情列表
     */
     async _getClientPersonList(page = 1) {
       this.tabelDataLoading = true
       // 请求参数
       const params = {
         page,
         size: this.pagination.pageSize,
         mobile: this.searchMobile.trim(),
        //  start_time: this.filterInfo.startDate,
        //  end_time: this.filterInfo.endDate,
         vip_new_time_sort: 1, // 开户时间倒序
        }

       try {
         const { data: labelListData } = await clientApi.getClientPersonListApi(params)
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
     * 重新搜索
     */
    getSearchData() {
      this._getClientPersonList()
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
    .date-range-picker {
      margin-left: auto;
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
    .selected-title {
      font-size: 14px;
      font-weight: bold;
    }
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
