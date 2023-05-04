
<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">百姓律师用户购买企业会员总数：{{ pagination.total }}</span>

      <!-- 搜索输入框 -->
      <!-- <div class="mobile-input-wrap">
        <a-input allow-clear placeholder="搜索企业名称" v-model="searchEnterpriseName" @keyup.enter="getSearchData" style="margin: 0 5px; width: 160px" />
        <a-button type="primary" @click="getSearchData">搜索</a-button>
      </div> -->

      <!-- 时间筛选 -->
      <!-- <a-range-picker
        @change="onRangePickerChange"
        @ok="getSearchData"
        style="width: 340px; margin-left: 30px;"
        format="YYYY-MM-DD HH:mm:ss"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
      /> -->
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getUserVipList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.user_id)"
        bordered
      >

        <!-- 用户名称 -->
        <a-table-column dataIndex="nickname" title="用户名称" align="center" />

        <!-- 用户手机号 -->
        <a-table-column dataIndex="mobile" title="用户手机号" align="center" />

        <!-- 套餐类型 -->
        <a-table-column title="会员类型" align="center" width="170px">
          <template slot-scope="record">
            {{ record.husbandman_enterprise_vip.title }}/￥{{ record.husbandman_enterprise_vip.price }}
          </template>
        </a-table-column>

        <!-- 套餐开通时间 -->
        <a-table-column dataIndex="husbandman_enterprise_vip.husbandman_open_time" title="会员开通时间" align="center" />

        <!-- 套餐结束时间 -->
        <a-table-column dataIndex="husbandman_enterprise_vip.husbandman_end_time" title="会员结束时间" align="center" />
      </a-table>
    </a-card>

  </a-layout>
</template>

<script>
import * as userApi from '@/api/user'
import moment from 'moment'


export default {
  name: 'EnterpriseServeList',
  data() {
    return {
      tableDataList: [], // table 列表
      tableDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getUserVipList(page)
          this.pagination.current = page
        },
      },

      searchEnterpriseName: '', // 搜索企业名称
      lawServeVipId: '', // 法律套餐类型 id
      lawServeVipSelectList: [], // 套餐类型 select 列表
      
      // 过滤条件
      filterInfo: {
        startDate: '', // 开始时间
        endDate: '', // 结束时间
      },

    }
  },
  created() {
    this._getUserVipList()
  },
  methods: {
    moment,

    /**
     * 获取用户会员列表
     */
     async _getUserVipList(page = 1) {
       const param = { page, size: this.pagination.pageSize }
       // 企业套餐 id 条件
      //  this.lawServeVipId && (param.enterprise_vip_id = this.lawServeVipId)
       // 时间段 条件
      //  this.filterInfo.startDate && (param.start_time = this.filterInfo.startDate)
      //  this.filterInfo.endDate && (param.end_time = this.filterInfo.endDate)
       // 企业名称  
      //  this.searchEnterpriseName && (param.name = this.searchEnterpriseName)
       
       this.tableDataLoading = true

       try {
         const { data: enterpriseLawServeData } = await userApi.getUserVipListApi(param)
         this.tableDataList = enterpriseLawServeData.data
         this.pagination.total = enterpriseLawServeData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * RangePicker 发生变化的回调
     */
    onRangePickerChange(date, dateStrAry) {
      this.filterInfo.startDate = dateStrAry[0]
      this.filterInfo.endDate = dateStrAry[1]
      // 清空日期选择重新请求一次
      if (!dateStrAry[0] || !dateStrAry[1]) this._getUserVipList()
    },

    /**
     * 搜索
     */
    getSearchData() {
      this._getUserVipList()
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
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 13px;
  }
}
</style>
