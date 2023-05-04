<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back-wrap" @click="$router.back()">
        <a-icon type="arrow-left" />
        <span style="margin-left: 6px;">「{{ bestLawyerDetail.nickname }}」广告位访问埋点</span>
        <!-- <span style="margin-right: 30px;">{{ bestLawyerDetail.nickname }}</span> -->
      </div>
      

      <!-- 时间筛选 -->
      <a-range-picker
        @change="onRangePickerChange"
        @ok="_getLawyerAdvertLogList(1)"
        style="width: 340px; margin-left: 30px;"
        format="YYYY-MM-DD HH:mm:ss"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
      />

    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>

      <a-tabs v-model="advertSeatNavCardTabKey" type="card" @change="onAdvertSeatNavCardChangeEvt">
        <a-tab-pane key="0" tab="点击广告" />
        <a-tab-pane key="1" tab="点击私聊" />
      </a-tabs>

      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.user.user_id)"
        bordered
      >

        <!-- 用户 -->
        <a-table-column title="用户" align="center" :width="260">
          <template slot-scope="record">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
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

        <!-- 点击次数 -->
        <a-table-column dataIndex="num" title="点击次数" align="center" />

        <!-- 最新点击时间 -->
        <a-table-column dataIndex="updated_at" title="最新点击时间" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" :width="120">
          <template slot-scope="record">
            <a-button v-if="record.user.type === 1" type="link" style="padding: 0; margin-right: 10px;" @click="$router.push({ name: 'LawyerDetail', params: { userId: String(record.user.user_id) } })">查看律师</a-button>
            <a-button v-else type="link" style="padding: 0; margin-right: 10px;" @click="$router.push({ name: 'UserDetail', params: { userId: String(record.user.user_id) } })">查看用户</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
  </a-layout>
</template>

<script>
import moment from 'moment'
import * as pointLogApi from '@/api/pointLogApi'
import UserVipCell from '@/components/User/UserVipCell'

export default {
  name: 'UserPointLog',
  components: { UserVipCell },
  data() {
    return {
      advertSeatNavCardTabKey: '0', // 当前激活card tab 面板的 key
      advertisementId: '', // 位置 id
      bestLawyerDetail: {}, // 律师信息

      tableDataList: [],
      tableDataLoading: true,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerAdvertLogList(page)
          this.pagination.current = page
        },
      },

      timeFactorInfo: { startDate: '', endDate: '', },
    }
  },
  created() {
    if (this.$route.query.advertisementId) this.advertisementId = this.$route.query.advertisementId

    const bestLawyerDetail = JSON.parse(sessionStorage.getItem('bestLawyerDetail'))
    this.bestLawyerDetail = bestLawyerDetail

    this._getLawyerAdvertLogList()
  },
  methods: {
    moment,
    /**
     * RangePicker 发生变化的回调
     */
    onRangePickerChange(date, dateStrAry) {
      this.timeFactorInfo.startDate = dateStrAry[0]
      this.timeFactorInfo.endDate = dateStrAry[1]
      // 清空日期选择重新请求一次
      // if (!dateStrAry[0] || !dateStrAry[1]) this._getLawyerAdvertLogList()
      if (!dateStrAry[0] || !dateStrAry[1]) this.refreshTableData()
    },

    /**
     * 监听广告位导航card change 事件
     */
    onAdvertSeatNavCardChangeEvt(activeKey) {
      if (activeKey === '0') {
        this._getLawyerAdvertLogList()
      } else if (activeKey === '1') {
        this._getLawyerAdvertChatLogList()
      }
    },

    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      if (this.advertSeatNavCardTabKey === '0') {
        this._getLawyerAdvertLogList()
      } else if (this.advertSeatNavCardTabKey === '1') {
        this._getLawyerAdvertChatLogList()
      }
    },

    /**
     * 获取律师广告点击 埋点列表
     */
     async _getLawyerAdvertLogList(page = 1) {
       this.tableDataLoading = true
       const param = {
         page,
         size: this.pagination.pageSize,
         advertisement_id: this.advertisementId
        }

        // 时间段 条件
        this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
        this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)

       try {
         const { data: clientCompanyData } = await pointLogApi.getLawyerAdvertLogApi(param)
         this.tableDataList = clientCompanyData.data
         this.pagination.total = clientCompanyData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
     },

    /**
     * 获取律师广告点击 埋点列表
     */
     async _getLawyerAdvertChatLogList(page = 1) {
       this.tableDataLoading = true
       const param = {
         page,
         size: this.pagination.pageSize,
         advertisement_id: this.advertisementId
        }

        // 时间段 条件
        this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
        this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)

       try {
         const { data: clientCompanyData } = await pointLogApi.getLawyerAdvertChatLogApi(param)
         this.tableDataList = clientCompanyData.data
         this.pagination.total = clientCompanyData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
     },

    /**
     * 导航进用户与对应律师消费记录页面
     */
    navToUserToLawyerBillPage(userId, lawyerId) {
      this.$router.push({ name: 'userToLawyerBillRoute', query: { userId, lawyerId } })
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
    .back-wrap {
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
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
</style>
