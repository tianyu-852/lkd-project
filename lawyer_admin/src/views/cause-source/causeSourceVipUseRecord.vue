<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="icon-back" style="cursor: pointer; padding-right: 10px;" @click="$router.back(-1)">←</span>
      <span class="focus-text">{{ lawyerInfo.nickname }}案源条数剩余: {{ lawyerInfo.causeSourceNum }}</span>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>

      <a-tabs v-model="activeTabKey">
        <!-- 条数增加记录 -->
        <a-tab-pane key="1" :tab="'条数增加记录 ' + '(' + tableTotalPagination.total + ')'">
          <a-table
            :data-source="tableTotalList"
            :loading="tableTotalLoading"
            :pagination="tableTotalPagination"
            :rowKey="(record) => String(record.local_case_source_statistics_id)"
            bordered
          >
            <!-- 条数 -->
            <a-table-column dataIndex="num" title="增加条数" align="center" />

            <!-- 来源 -->
            <a-table-column title="来源" align="center">
              <template slot-scope="record">
                <span>{{ record.status_text }}</span>
              </template>
            </a-table-column>

            <!-- 增加时间 -->
            <a-table-column dataIndex="created_at" title="增加时间" align="center" />
          </a-table>
        </a-tab-pane>

        <!-- 条数使用记录 -->
        <a-tab-pane key="2" :tab="'条数使用记录 ' + '(' + tableCheckPagination.total + ')'">
          <a-table
            :data-source="tableCheckList"
            :loading="tableCheckLoading"
            :pagination="tableCheckPagination"
            :rowKey="(record) => String(record.local_case_source_statistics_id)"
            bordered
          >
            <!-- 条数 -->
            <a-table-column dataIndex="num" title="使用条数" align="center" />

            <!-- 使用详情 -->
            <a-table-column title="使用详情" align="center">
              <template slot-scope="record">
                <span>{{ record.status_text }}</span>
              </template>
            </a-table-column>

            <!-- 使用时间 -->
            <a-table-column dataIndex="created_at" title="使用时间" align="center" />
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-layout>
</template>

<script>
import { mapState } from 'vuex'
import * as lawyerApi from '@/api/lawyer'
import * as causeSourceApi from '@/api/causeSourceApi'

export default {
  name: 'CauseSourceVipUseRecordPage',
  data() {
    return {
      lawyerUserId: '', // 用户 id
      lawyerInfo: {}, // 律师信息
      activeTabKey: '1', // 激活的 tab

      tableTotalList: [], // 推广大使全部列表
      tableTotalLoading: false,
      tableTotalPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerGetNumList(page)
          this.tableTotalPagination.current = page
        },
      },

      tableCheckList: [], // 待审核列表
      tableCheckLoading: false,
      tableCheckPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerUseList(page)
          this.tableCheckPagination.current = page
        },
      },
    }
  },
  computed: {
    ...mapState(['dataRoleList', 'openVipRoleList']),
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    this.lawyerUserId = this.$route.query.userId
    const lawyerInfo = JSON.parse(sessionStorage.getItem('lawyerInfoSession'))
    this.lawyerInfo = lawyerInfo

    this._getLawyerGetNumList()
    this._getLawyerUseList()
  },
  methods: {
    /**
     * 获取律师增加条数 列表
     */
     async _getLawyerGetNumList(page = 1) {
       this.tableTotalLoading = true

       const param = {
        page,
        size: this.tableTotalPagination.pageSize,
        type: 1,
        user_id: this.lawyerUserId
       }

       try {
         const { data: tableTotalData } = await causeSourceApi.getLawyerCauseSourceUseRecordApi(param)
         this.tableTotalList = tableTotalData.data
         this.tableTotalPagination.total = tableTotalData.total
         this.tableTotalPagination.current = page
         this.tableTotalLoading = false
       } catch (error) {
         this.tableTotalLoading = false
         console.log(error)
       }
    },

    /**
     * 获取律师条数 使用列表
     */
     async _getLawyerUseList(page = 1) {
       this.tableCheckLoading = true

       const param = {
        page,
        size: this.tableTotalPagination.pageSize,
        type: 2,
        user_id: this.lawyerUserId
       }

       try {
         const { data: tableTotalData } = await causeSourceApi.getLawyerCauseSourceUseRecordApi(param)
         this.tableCheckList = tableTotalData.data
         this.tableCheckPagination.total = tableTotalData.total
         this.tableCheckPagination.current = page
         this.tableCheckLoading = false
       } catch (error) {
         this.tableCheckLoading = false
         console.log(error)
       }
    },

    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      const { activeTabKey } = this

      if (activeTabKey === '1') this._getLawyerGetNumList(this.tableTotalPagination.current)
      if (activeTabKey === '2') this._getLawyerUseList(this.tableCheckPagination.current)
    },

    /**
     * 查看律师主页
     */
    navToLawyerDetailPage(record) {
      const userId = String(record.user_id)
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
    },
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 90px;
    font-size: 16px;
    font-weight: 600;
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
  }
  .column-menu-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-weight: 600;
  }
}

.income-modal-box {
  .income-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
    &:last-child { margin-bottom: 0; }
    .income-item-left {
      font-size: 14px;
      font-weight: 600;
      margin-right: 30px;
    }
  }
}
</style>
