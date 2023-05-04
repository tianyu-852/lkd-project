
<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back">
        <span class="icon-back" @click="$router.back(-1)">←</span>
        <span>{{ lawyerInfo.user.nickname }}，开通记录：{{ tablePagination.total }}</span>
      </div>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData" >刷新</a-button>
      </div>

      <!-- 投放中 -->
      <a-table
        :data-source="tableList"
        :loading="tableLoading"
        :pagination="tablePagination"
        :rowKey="(record) => String(record.source_match_package_warehouse_id)"
        :scroll="{ x: 1600 }"
        bordered
      >
        <!-- 律师 -->
        <a-table-column title="律师" align="center" :width="180">
          <template slot-scope="record">
            <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
              <user-vip-cell
                :nickname="record.user.nickname"
                :avatar="record.user.avatar"
                :mobile="record.user.mobile"
                :user-id="String(record.user.user_id)"
                size="sm"
              />
            </div>
          </template>
        </a-table-column>

        <!-- 套餐类型 -->
        <a-table-column title="套餐类型" align="center" :width="240">
          <template slot-scope="record">
            <div class="column-menuType-wrap" :style="{ color: '#666' }">
              <div style="font-weight: 600;">
                套餐：{{ record.source_match_package.name }}
                <a-tag v-if="record.type === 1" color="#41b583">普通会员</a-tag>
                <a-tag v-else color="#f56c6c">独家会员</a-tag>
              </div>
              <div>匹配数量：<span style="color: #409eff;">{{ record.already_matched_num }}</span> / {{ record.total_num }}</div>
              <div>金额：￥{{ record.pay_money }}</div>
            </div>
          </template>
        </a-table-column>

        <!-- 套餐时间 -->
        <a-table-column title="套餐时间" align="center" :width="220">
          <template slot-scope="record">
            <div class="column-menuTime-wrap" :style="{ color: '#666' }">
              <div>{{ record.open_time }}</div>
              <div>至</div>
              <div>{{ record.end_time }}</div>
            </div>
          </template>
        </a-table-column>

        <!-- 案源地区-->
        <a-table-column title="案源地区" align="center" :width="140">
          <template slot-scope="record">
            <div>{{ record.province }}/{{ record.city }}</div>
          </template>
        </a-table-column>

        <!-- 销售 -->
        <a-table-column title="销售" align="center" :width="140">
          <template slot-scope="record">
            <div>{{ record.sales.name }}</div>
          </template>
        </a-table-column>

        <!-- 状态 -->
        <a-table-column title="状态" align="center" :width="140">
          <template slot-scope="record">
            <span v-if="record.status === 0" style="color: #41b583">{{ record.status_txt }}</span>
            <span v-else-if="record.status === 2" style="color: #409eff">{{ record.status_txt }}</span>
          </template>
        </a-table-column>

        <!-- 开通渠道 -->
        <a-table-column title="开通渠道" align="center">
          <template slot-scope="record">
            <div v-if="record.source === 1">APP</div>
            <div v-else-if="record.source === 2">后台-{{ record.admin.nickname }}</div>
            <div v-else-if="record.source === 3">微信小程序</div>
            <div v-else>APP</div>
          </template>
        </a-table-column>

        <!-- 创建时间 -->
        <a-table-column dataIndex="created_at" title="创建时间" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" fixed="right" align="center" :width="220">
          <template slot-scope="record">
            <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToLawerCaseSourceUseRecordPage(record)">案源记录</a-button>
            <!-- 移除会员 -->
            <a-popconfirm v-if="userInfo && openVipRoleList.includes(userInfo.name)" title="是否确认要移除该律师案源会员？" @confirm="removeLawyerCaseSourceVip(record)">
              <a-button type="link" style="padding: 0; margin-right: 10px; color: #F56C6C;">移除会员</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

  </a-layout>
</template>

<script>
import * as causeSourceApi from '@/api/causeSourceApi'
import * as lawyerApi from '@/api/lawyer'
import * as lawManagerApi from '@/api/lawManagerApi'
import UserVipCell from '@/components/User/UserVipCell'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: 'CaseSourceMatchPage',
  components: { UserVipCell },
  data() {
    return {
      lawyerUserId: 0, // 用户 id
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
  computed: {
    ...mapState(['dataRoleList', 'openVipRoleList']),
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    this.lawyerUserId = this.$route.query.lawyerUserId
    const lawyerInfo = JSON.parse(sessionStorage.getItem('lawyerInfo'))
    console.log(lawyerInfo)
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
      const param = { page, size: this.tablePagination.pageSize, user_id: this.lawyerUserId }

      this.tableLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCaseSourceMatchVipListApi(param)
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

    /**
     * 进入律师案源会员使用记录
     */
    navToLawerCaseSourceUseRecordPage(record) {
      sessionStorage.setItem('lawyerInfo', JSON.stringify(record))
      const userId = String(record.user.user_id)
      this.$router.push({ name: 'causeSourceMatchUseRecordRoute', query: { lawyerUserId: userId, vipRecordId: record.source_match_package_warehouse_id } })
    },
    /**
     * 移除律师 案源匹配vip
     */
    async removeLawyerCaseSourceVip(record) {
      const param = { source_match_package_warehouse_id: record.source_match_package_warehouse_id }

      try {
        await causeSourceApi.removeLawyerCaseSourceVipApi(param)
        this.refreshTableData()
        this.$notification.success({ message: '移除成功', duration: 3 })
      } catch (error) {
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
