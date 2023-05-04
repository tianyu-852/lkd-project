<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <!-- <span class="focus-text">待审核数量：{{ pagination.total }}</span> -->
      <a-input allow-clear placeholder="搜索用户名/手机号" v-model="search" @keyup.enter="getSearchPage" style="width: 180px; margin: 0 5px" />
      <a-button type="primary" @click="getSearchPage">搜索</a-button>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>
      
      <a-tabs v-model="activeTabKey">
        <!-- 待审核律师 -->
        <a-tab-pane key="1" :tab="'待审核律师 ' + '(' + tableCheckPagination.total + ')'">
          <a-table
            :data-source="tableCheckList"
            :loading="tableCheckLoading"
            :pagination="tableCheckPagination"
            :rowKey="(record) => Number(record.lawyer_auth_id)"
            bordered
          >
            <a-table-column key="nickname" title="姓名">
              <template slot-scope="text, record">
                {{ record.nickname }}
                <img v-show="record.is_better === 1" :src="iconList[0].url" style="width: 32px; height: 16px" />
              </template>
            </a-table-column>
            <a-table-column key="mobile" data-index="mobile" title="手机号" />
            <a-table-column key="lawyer_grade_chinese" title="认证类型">
              <template slot-scope="text, record">
                {{ record.lawyer_grade_chinese }}
              </template>
            </a-table-column>
            <a-table-column key="is_guarantee" title="保障计划">
              <template slot-scope="text, record">
                <span v-show="record.is_guarantee === 1" style="color: #2cbf78">已加入</span>
                <span v-show="record.is_guarantee !== 1" style="color: #ff9700">未加入</span>
              </template>
            </a-table-column>
            <a-table-column key="login_at" title="最后登录时间|地点">
              <template slot-scope="record">
                <div>{{ record.login_at }} {{ record.location ? '|' + record.location : '' }}</div>
              </template>
            </a-table-column>
            <a-table-column key="action" title="操作">
              <template slot-scope="text, record, index">
                <a-button
                  v-if="record.apply_times > 1"
                  type="primary"
                  :style="{ marginRight: '16px', backgroundColor: '#FF9700', borderColor: '#FF9700' }"
                  size="small"
                  @click="navToLawyerCheckDetail(record.lawyer_auth_id)"
                >
                  {{ record.apply_times }}次审核
                </a-button>

                <a-button
                  v-else
                  type="primary"
                  :style="{ marginRight: '16px', backgroundColor: '#2CBF78', borderColor: '#2CBF78' }"
                  size="small"
                  @click="navToLawyerCheckDetail(record.lawyer_auth_id)"
                >
                  审核
                </a-button>

                <a-popconfirm
                  placement="leftBottom"
                  ok-text="确认"
                  cancel-text="不行"
                  @confirm="deleteLawyer(record.lawyer_auth_id, index)"
                >
                  <!-- <template slot="title" slot-scope="record, index"> 是否确认要删除该律师申请？ </template> -->
                  <template slot="title"> 是否确认要删除该律师申请？ </template>
                  <a-button type="danger" size="small">删除</a-button>
                </a-popconfirm>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 修改地址律师 -->
        <a-tab-pane key="2" :tab="'修改地址律师 ' + '(' + tableAddrPagination.total + ')'">
          <a-table
            :data-source="tableAddrList"
            :loading="tableAddrLoading"
            :pagination="tableAddrPagination"
            :rowKey="(record) => Number(record.lawyer_update_log_id)"
            bordered
          >
            <a-table-column key="nickname" title="姓名">
              <template slot-scope="text, record">
                {{ record.user.nickname }}
              </template>
            </a-table-column>

            <a-table-column dataIndex="user.mobile" title="手机号" />

            <a-table-column dataIndex="data.lawyer_office_address" title="新地址" />

            <a-table-column title="最后登录时间|地点">
              <template slot-scope="record">
                <div>{{ record.user.login_at }} {{ record.user.location ? '|' + record.user.location : '' }}</div>
              </template>
            </a-table-column>

            <a-table-column dataIndex="data.created_at" title="创建时间" />

            <a-table-column key="action" title="操作">
              <template slot-scope="record">
                <a-button type="primary" size="small" @click="navToLawyerAddrDetail(record)">修改地址</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-layout>
</template>

<script>
import { deleteLawyerAuth, getLawyerAuthPage } from '@/api/lawyer'
import * as lawyerApi from '@/api/lawyer'
import JSONbig from 'json-bigint'

export default {
  name: 'LawyerAuth',
  data() {
    return {
      activeTabKey: '1',

      search: '',
      state: {
        loading: false,
      },
      iconList: [ { url: require('@/assets/user/zs_icon@2x.png'), }, ],
      // data: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getLawyerPage(page, this.search)
          this.pagination.current = page
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
          this.getLawyerPage(page, this.search)
          this.tableCheckPagination.current = page
        },
      },

      tableAddrList: [], // 修改地址列表
      tableAddrLoading: false,
      tableAddrPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerUpdateAddrLogList(page, this.search)
          this.tableAddrPagination.current = page
        },
      },
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['search'] = this.search
      return condition
    },
  },
  created() {
    const { upaddr } = this.$route.query
    if (upaddr) this.activeTabKey = '2'

    const condition = JSON.parse(sessionStorage.getItem('lawyerAuthCondition'))
    if (condition) {
      this.pagination.current = condition.current
      this.search = condition.search
      // window.sessionStorage.removeItem('lawyerAuthCondition')
      sessionStorage.clear()
      this.getLawyerPage(condition.current, condition.search)
    } else {
      this.getLawyerPage(1, '')
    }

    this.getLawyerPage(1, '')
    this._getLawyerUpdateAddrLogList()
  },

  mounted() {
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    beforeunloadFn(e) {
      sessionStorage.setItem('lawyerAuthCondition', JSON.stringify(this.conditionData))
    },
    /**
     * 进入律师审核详情页面
     */
    navToLawyerCheckDetail(lawyerAuthId) {
      sessionStorage.setItem('lawyerAuthCondition', JSON.stringify(this.conditionData))
      const lawyerAuthIdN = String(lawyerAuthId)

      const lawyerUpdateAddrInfo = null
      sessionStorage.setItem('lawyerUpdateAddrInfo', JSON.stringify(lawyerUpdateAddrInfo))
      this.$router.push({ name: 'LawyerAuthDetail', params: { lawyerAuthId: lawyerAuthIdN } })
    },
    /**
     * 导航进律师修改地址页面
     */
    navToLawyerAddrDetail(record) {
      const lawyerUpdateAddrInfo = { lawyer_update_log_id: record.lawyer_update_log_id, ...record.data }
      sessionStorage.setItem('lawyerUpdateAddrInfo', JSON.stringify(lawyerUpdateAddrInfo))
      this.$router.push({ name: 'LawyerAuthDetail', params: { lawyerAuthId: String(record.user.last_auth_id) } })
    },
    /**
     * 获取待审核律师
     */
    getLawyerPage(page, search) {
      this.tableCheckLoading = true
      getLawyerAuthPage(page, search)
        .then(({ data }) => {
          // this.pagination.total = data.total
          // this.pagination.current = page
          // this.data = data.data
          this.tableCheckPagination.total = data.total
          this.tableCheckPagination.current = page
          this.tableCheckList = data.data
        })
        .finally(() => {
          this.tableCheckLoading = false
        })
    },

    /**
     * 获取更新地址律师 列表
     */
     async _getLawyerUpdateAddrLogList(page = 1) {
       this.tableAddrLoading = true

       const param = {
        page,
        size: this.tableAddrPagination.pageSize,
        is_read: 0
      }

       try {
         const { data: addrLawyerData } = await lawyerApi.getLawyerUpdateAddrLogApi(param)
         this.tableAddrList = addrLawyerData.data
         this.tableAddrPagination.total = addrLawyerData.total
         this.tableAddrPagination.current = page
         this.tableAddrLoading = false
       } catch (error) {
         this.tableAddrLoading = false
         console.log(error)
       }
    },
    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      if (this.activeTabKey === '1') this.getLawyerPage(this.tableCheckPagination.current)
      if (this.activeTabKey === '2') this._getLawyerUpdateAddrLogList(this.tableAddrPagination.current)
    },
    /**
     * 删除审核律师
     */
    deleteLawyer(lawyerAuthId, index) {
      this.state.loading = true

      deleteLawyerAuth(lawyerAuthId)
        .then(() => {
          this.pagination.total -= 1
          this.data.splice(index, 1)
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    /**
     * 搜索
     */
    getSearchPage() {
      this.getLawyerPage(1, this.search)
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    height: 90px;
    align-items: center;

    input {
      width: 170px;
      margin-right: 20px;
    }

    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }

  .content {
    margin-top: 16px;
  }
}

.tool-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
}
</style>
