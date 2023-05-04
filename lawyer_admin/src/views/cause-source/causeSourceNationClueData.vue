
<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back">
        <span class="icon-back" @click="$router.back(-1)">←</span>
        <span>全国今日新增线索总数：{{ caseSourceMatchData.city_num }}</span>
      </div>

      <span style="font-weight: 500;">时间筛选：</span>
      <a-date-picker v-model="vipOpenDate" format="YYYY-MM-DD" @change="refreshTableData" />
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getNationClueDataList()">刷新</a-button>
      </div>

      <a-table
        :data-source="tableList"
        :loading="tableLoading"
        :pagination="tablePagination"
        :rowKey="(record) => String(record.source_match_success_id)"
        bordered
      >
        <!-- 地区-->
        <a-table-column title="地区" align="center">
          <template slot-scope="record">
            <div>{{ record.city }}</div>
          </template>
        </a-table-column>

        <!-- 今日新增线索 -->
        <a-table-column title="今日新增线索" align="center">
          <template slot-scope="record">
            <div>{{ record.lawyer_num }}</div>
          </template>
        </a-table-column>

        <!-- 昨日新增线索 -->
        <!-- <a-table-column title="昨日新增线索" align="center">
          <template slot-scope="record">
            <div>{{ record.wait_match_num }}</div>
          </template>
        </a-table-column> -->
      </a-table>
    </a-card>
  </a-layout>
</template>

<script>
import * as causeSourceApi from '@/api/causeSourceApi'
import moment from 'moment'

export default {
  name: 'CaseSourceMatchRegionPage',
  data() {
    return {
      caseSourceMatchData: {}, // 律师信息
      vipOpenDate: '', // 律师套餐开通时间
      
      tableList: [], // table 列表
      tableLoading: true, // 数据是否加载中
      tablePagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getNationClueDataList(page)
          this.tablePagination.current = page
        },
      },
    }
  },
  created() {
    this._getNationClueDataList()
  },
  methods: {
    moment,

    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      this._getNationClueDataList()
    },

    /**
     * 获取全国线索线索新增数据 table 列表
     */
    async _getNationClueDataList(page = 1) {
      this.tableLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCaseSourceMatchRegionListApi()
        this.tableList = causeSourceData.data
        delete causeSourceData.data
        this.caseSourceMatchData = causeSourceData
        this.tableLoading = false
      } catch (error) {
        this.tableLoading = false
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
    padding: 10px;
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

.tool-module {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 16px;
  height: 60px;
  padding: 0;
  padding-left: 10px;
  .company-name {
    font-size: 16px;
    font-weight: 600;
  }
  .data-num {
    font-size: 14px;
    font-weight: 600;
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
  .column-menuType-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .column-menuTime-wrap {
    font-weight: 600;
    color: #666;
  }
}
</style>
