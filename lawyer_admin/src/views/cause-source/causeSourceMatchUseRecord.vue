
<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back">
        <span class="icon-back" @click="$router.back(-1)">←</span>
        <span>{{ lawyerInfo.user.nickname }}，案源记录：{{ tablePagination.total }}</span>
      </div>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>

      <!-- 投放中 -->
      <a-table
        :data-source="tableList"
        :loading="tableLoading"
        :pagination="tablePagination"
        :rowKey="(record) => String(record.source_match_success_id)"
        bordered
      >
        <!-- 用户 -->
        <a-table-column title="用户" align="center">
          <template slot-scope="record">
            <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
              <user-vip-cell
                :nickname="record.match_user.nickname"
                :avatar="record.match_user.avatar"
                :mobile="record.match_user.mobile"
                :user-id="String(record.match_user.user_id)"
                size="sm"
              />
            </div>
          </template>
        </a-table-column>

        <!-- 案源地区-->
        <a-table-column title="案源地区" align="center">
          <template slot-scope="record">
            <div>{{ record.province }}/{{ record.city }}</div>
          </template>
        </a-table-column>

        <!-- 案源标签 -->
        <a-table-column dataIndex="lawyer_tag" title="案源标签" align="center" />

        <!-- 创建时间 -->
        <a-table-column dataIndex="created_at" title="创建时间" align="center" />

        <!-- 来源-->
        <a-table-column title="来源" align="center">
          <template slot-scope="record">
            <div>{{ record.type_cn }}</div>
            <div v-if="record.admin_nickname">后台-{{ record.admin_nickname }}</div>
          </template>
        </a-table-column>

        <!-- 备注 -->
        <a-table-column dataIndex="remark2" title="备注" align="center" />

        <!-- 状态 -->
        <!-- <a-table-column dataIndex="compensation.text" title="状态" align="center" /> -->
        <!-- 状态-->
        <a-table-column title="状态" align="center">
          <template slot-scope="record">
            <div>
              <span>{{ record.compensation.text }}</span>
              <template v-if="record.compensation.remaining_timestamp">
                <Countdown :time="record.compensation.remaining_timestamp" format="hh:mm:ss">
                  <template slot-scope="{ time }">{{ time }}</template>
                </Countdown>
              </template>
            </div>
          </template>
        </a-table-column>

        <!-- 赔付状态 -->
        <a-table-column dataIndex="compensation.label" title="赔付状态" align="center" />
      </a-table>
    </a-card>
  </a-layout>
</template>

<script>
import * as causeSourceApi from '@/api/causeSourceApi'
import UserVipCell from '@/components/User/UserVipCell'
import Countdown from '@choujiaojiao/vue2-countdown'
import moment from 'moment'

export default {
  name: 'CaseSourceMatchPage',
  components: { UserVipCell, Countdown },
  data() {
    return {
      lawyerUserId: 0, // 用户 id
      vipRecordId: 0, // vip记录 id
      lawyerInfo: {}, // 律师信息
      
      tableList: [], // table 列表
      tableLoading: true, // 数据是否加载中
      tablePagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getCauseSourceVaildList(page)
          this.tablePagination.current = page
        },
      },
    }
  },
  created() {
    this.lawyerUserId = this.$route.query.lawyerUserId
    this.vipRecordId = this.$route.query.vipRecordId
    const lawyerInfo = JSON.parse(sessionStorage.getItem('lawyerInfo'))
    this.lawyerInfo = lawyerInfo

    this._getCauseSourceVaildList()
  },
  methods: {
    moment,

    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      this._getCauseSourceVaildList(this.tablePagination.current)
    },

    /**
     * 获取案源匹配有效 table 列表
     */
    async _getCauseSourceVaildList(page = 1) {
      const param = {
        page,
        size: this.tablePagination.pageSize,
        user_id: this.lawyerUserId,
        source_match_package_warehouse_id: this.vipRecordId
      }

      this.tableLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCaseSourceVipUseRecordApi(param)
        this.tableList = causeSourceData.data
        this.tablePagination.total = causeSourceData.total
        this.tablePagination.current = page
        this.tableLoading = false
      } catch (error) {
        this.tableLoading = false
        console.log(error)
      }
    },

    /**
     * 查看律师详情
     */
    navToLawyerDetail(record) {
      const userId = String(record.user.user_id)
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
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

.checkbox-img {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  margin-left: auto;
  cursor: pointer;
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
