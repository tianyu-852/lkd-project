<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">律师广告埋点：{{ pagination.total }}</span>

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
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getLawyerAdvertLogList(pagination.current)">刷新</a-button>
      </div>

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
        <a-table-column dataIndex="num" title="点击次数" align="center" :width="200" />

        <!-- 广告位律师 -->
        <a-table-column title="广告位律师" align="center" :width="260">
          <template slot-scope="record">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
              <user-vip-cell
                :nickname="record.lawyer.nickname"
                :avatar="record.lawyer.avatar"
                :mobile="record.lawyer.mobile"
                :user-id="String(record.lawyer.user_id)"
                size="sm"
              />
            </div>
          </template>
        </a-table-column>

        <!-- 最新点击时间 -->
        <a-table-column dataIndex="updated_at" title="最新点击时间" align="center" :width="200" />

        <!-- 有无产生消费 -->
        <a-table-column title="有无产生消费" align="center" :width="260">
          <template slot-scope="record">
            <a-button v-if="record.is_have_order" type="link" style="color: #41b583;" @click="navToUserToLawyerBillPage(record.user.user_id, record.lawyer.user_id)">详情</a-button>
            <span v-else>无</span>
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
      if (!dateStrAry[0] || !dateStrAry[1]) this._getLawyerAdvertLogList()
    },

    /**
     * 获取律师广告点击 埋点列表
     */
     async _getLawyerAdvertLogList(page = 1) {
       this.tableDataLoading = true
       const param = {
         page,
         size: this.pagination.pageSize,
         type: 2,
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
