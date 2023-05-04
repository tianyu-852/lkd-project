<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back-wrap" @click="$router.back()">
        <a-icon type="arrow-left" />
        <span style="margin-left: 6px;">「{{ bestLawyerDetail.nickname }}」匹配的案源数据</span>
      </div>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>

      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.local_lawyer_case_source_id)"
        bordered
      >
        <!-- 用户 -->
        <a-table-column title="用户" align="center">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.case_user.nickname"
              :avatar="record.case_user.avatar"
              :mobile="record.case_user.mobile"
              :user-id="String(record.case_user.user_id)"
            />
          </template>
        </a-table-column>

        <!-- 匹配时间 -->
        <a-table-column dataIndex="pay_time" title="匹配时间" align="center" />

        <!-- 线索信息 -->
        <a-table-column title="线索信息" align="center">
          <template slot-scope="record">
            <div>{{ record.lawyer_tag }}</div>
            <div>{{ record.province }}/{{ record.city }}</div>
            <div>发布时间：{{ record.created_at }}</div>
          </template>
        </a-table-column>

        <!-- 金额 -->
        <!-- <a-table-column dataIndex="price" title="金额" align="center" /> -->

        <!-- 线索状态 -->
        <a-table-column dataIndex="local_case_source_label" title="线索状态" align="center" />

        <!-- 备注 -->
        <a-table-column dataIndex="remark" title="备注" align="center" />

        <!-- 操作 -->
        <a-table-column title="操作" align="center">
          <template slot-scope="record">
            <a-popconfirm title="是否确认要删除？" @confirm="delCauseSourceItem(record)">
              <a-button type="link" style="color: #f56c6c;" size="small">删除</a-button>
            </a-popconfirm>
            <a-button type="link" size="small" @click="openPhoneCallRecordModal(record)">通话记录</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 通话记录 modal -->
    <a-modal
      v-model="callRecordModal.isShowCallRecrodModal"
      :width="460"
      title="通话记录"
      :footer="null"
      destroyOnClose
    >
      <div class="callRecord-modal">
        <div v-for="(cItem, cIndex) in callRecordModal.callRecrdList" :key="cIndex" class="callRecord-item">
          <div>
            <div class="callRecord-user">
              <span>{{ cItem.lawyer.nickname }}</span>
              <a-icon v-if="cItem.call_type === 0" type="arrow-right" style="margin: 10px;" />
              <a-icon v-else type="arrow-left" style="margin: 10px;" />
              <span>{{ cItem.case_user.nickname }}</span>

              <span v-if="cItem.is_call_success" class="call-status" style="color: #41b583;">通话成功</span>
              <span v-else class="call-status" style="color: #999;">未接通</span>
            </div>
          </div>
          <div class="callRecord-time">通话时间：{{ cItem.call_time }}</div>
          <audio v-if="cItem.is_call_success" ref="audioRef" controls="controls" :src="cItem.recording_file" class="audio" />
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import moment from 'moment'
import * as causeSourceApi from '@/api/causeSourceApi'
import * as lawyerApi from '@/api/lawyer'
import UserVipCell from '@/components/User/UserVipCell'

// 通话记录 modal 信息
const CALLRECORD_MODAL = {
  isShowCallRecrodModal: false,
  callRecrdList: []
}

export default {
  name: 'CauseSourceCityUnionDetailPage',
  components: { UserVipCell },
  data() {
    return {
      advertSeatNavCardTabKey: '0', // 当前激活card tab 面板的 key
      causeSourceReleaseId: '', // 位置 id
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

      callRecordModal: { ...CALLRECORD_MODAL }, // 通话记录 modal
    }
  },
  created() {
    if (this.$route.query.causeSourceReleaseId) this.causeSourceReleaseId = this.$route.query.causeSourceReleaseId

    const bestLawyerDetail = JSON.parse(sessionStorage.getItem('bestLawyerDetail'))
    this.bestLawyerDetail = bestLawyerDetail

    this._getNativeCauseSourceList()
  },
  methods: {
    moment,
    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      this._getNativeCauseSourceList()
    },

    /**
     * 获取律师匹配案源详情列表
     */
     async _getNativeCauseSourceList(page = 1) {
       const param = { local_case_source_release_id: this.causeSourceReleaseId, page, size: this.pagination.pageSize }
       this.tableDataLoading = true

       try {
         const { data: causeSourceNativeData } = await causeSourceApi.getLawyerCaseSourceNativeListApi(param)
         this.tableDataList = causeSourceNativeData.data
         this.pagination.total = causeSourceNativeData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 打开电话记录 modal
     */
    async openPhoneCallRecordModal(record) {
      const param = { local_lawyer_case_source_id: record.local_lawyer_case_source_id, size: 100 }

      try {
        const { data: callRecordData } = await causeSourceApi.getLawyerCaseSourceNativeCallRecordApi(param)
        this.callRecordModal.callRecrdList = callRecordData.data
        this.callRecordModal.isShowCallRecrodModal = true
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 删除 定时开通优选会员
     */
    async delCauseSourceItem(record) {
      const param = { local_lawyer_case_source_id: record.local_lawyer_case_source_id }

      try {
        await lawyerApi.delLawyerCauseSourceItem(param)
        this._getNativeCauseSourceList(this.pagination.current)
        this.$notification.success({ message: '删除成功', duration: 3 })
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

.callRecord-modal {
  .callRecord-item {
    margin-bottom: 20px;
    &:last-child { margin-bottom: 0; }
    .callRecord-user {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 15px;
      font-weight: 500;
      .call-status {
        margin-left: auto;
      }
    }
    .callRecord-time {
      font-size: 14px;
      color: #999;
    }
    .audio {
      width: 100%;
      height: 40px;
      margin-top: 10px;
    }
  }
}
</style>
