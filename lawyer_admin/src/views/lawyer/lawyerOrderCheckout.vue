
<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text" style="margin-right: 10px;">订单结算</span>

      <!-- <a-input allow-clear placeholder="搜索姓名/手机号" v-model="searchKey" @keyup.enter="_getOrderAwaitCheckoutList" style="margin: 0 5px; width: 180px" />
      <a-button type="primary" style="margin-right: 10px;" @click="_getOrderAwaitCheckoutList">搜索</a-button> -->

      <!-- 时间筛选 -->
      <a-range-picker
        @change="onRangePickerChange"
        @ok="refreshTableData()"
        style="width: 344px; margin: 0 10px;"
        format="YYYY-MM-DD HH:mm:ss"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
      />

      <a-button type="primary" style="margin-left: auto" @click="openPublishCauseSourceModal">发布新案源</a-button>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData" >刷新</a-button>
      </div>

      <a-tabs v-model="activeTabKey">
        <!-- 待结算 -->
        <a-tab-pane key="1" :tab="'待结算 ' + '(' + tableAwaitPagination.total + ')'">
          <a-table
            :data-source="tableAwaitList"
            :loading="tableAwaitLoading"
            :pagination="tableAwaitPagination"
            :rowKey="(record) => String(record.local_case_source_id)"
            bordered
          >
            <!-- 用户 -->
            <a-table-column title="用户" align="center">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                  <user-vip-cell
                    :nickname="record.case_user.nickname"
                    :avatar="record.case_user.avatar"
                    :mobile="record.case_user.mobile"
                    :user-id="String(record.case_user.user_id)"
                    size="sm"
                  />
                </div>
              </template>
            </a-table-column>

            <!-- 接单律师 -->
            <a-table-column title="接单律师" align="center">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                  <user-vip-cell
                    :nickname="record.case_user.nickname"
                    :avatar="record.case_user.avatar"
                    :mobile="record.case_user.mobile"
                    :user-id="String(record.case_user.user_id)"
                    size="sm"
                  />
                </div>
              </template>
            </a-table-column>

            <!-- 订单类型 -->
            <a-table-column dataIndex="lawyer_tag" title="订单类型" align="center" />

            <!-- 订单金额 -->
            <a-table-column dataIndex="price" title="订单金额" align="center" />

            <!-- 时间 -->
            <a-table-column dataIndex="created_at" title="时间" align="center" />

            <!-- 操作 -->
            <a-table-column key="action" title="操作" fixed="right" align="center" :width="220">
              <template slot-scope="record">
                <a-popconfirm title="请确认是否结算?" ok-text="确认" cancel-text="取消" @confirm="delCauseSourceFeature(record)">
                  <a-button type="primary" size="small">结算</a-button>
                </a-popconfirm>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 已结算 -->
        <a-tab-pane key="2" :tab="'已结算 ' + '(' + tableEndPagination.total + ')'">
          <a-table
            :data-source="tableEndList"
            :loading="tableEndLoading"
            :pagination="tableEndPagination"
            :rowKey="(record) => String(record.local_case_source_id)"
            bordered
          >
          </a-table>
        </a-tab-pane>

        <!-- 已失效 -->
        <a-tab-pane key="3" :tab="'已失效 ' + '(' + tableEndPagination.total + ')'">
          <a-table
            :data-source="tableEndList"
            :loading="tableEndLoading"
            :pagination="tableEndPagination"
            :rowKey="(record) => String(record.local_case_source_id)"
            bordered
          >
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-layout>
</template>

<script>
import * as causeSourceApi from '@/api/causeSourceApi'
import * as lawyerApi from '@/api/lawyer'
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import UserVipCell from '@/components/User/UserVipCell'
import moment from 'moment'

// 本地案源 modal
const NATIVE_CAUSESOURCE_MODAL = {
  isShowPublishModal: false, // 是否显示附件 modal
  province_id: '', // 地域省份 id
  city_id: '', // 地域城市 id
  user_mobile: '', // 用户手机号
  lawyer_tag: '', // 案源标签
}

export default {
  name: 'CauseSourceNativePage',
  components: { UserVipCell, TextWithRowButton },
  data() {
    return {
      activeTabKey: '1',
      
      tableAwaitList: [], // 待结算列表
      tableAwaitLoading: false,
      tableAwaitPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getOrderAwaitCheckoutList(page)
          this.tableAwaitPagination.current = page
        },
      },

      tableEndList: [], // 已关闭案源
      tableEndLoading: false,
      tableEndPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getOrderEndCheckoutList(page)
          this.tableEndPagination.current = page
        },
      },

      searchKey: '', // 搜索用户过关键字

      // 时间条件
      timeFactorInfo: { startDate: '', endDate: '' },
    }
  },
  created() {
    this._getOrderAwaitCheckoutList()
    this._getOrderEndCheckoutList()
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
      if (!dateStrAry[0] || !dateStrAry[1]) this._getOrderAwaitCheckoutList()
    },

    /**
     * 获取订单待结算 table 列表
     */
    async _getOrderAwaitCheckoutList(page = 1) {
      const param = {
        page,
        size: this.tableAwaitPagination.pageSize,
        status: 1,
        sort: 1,
      }
      // 时间筛选
      this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
      this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)

      this.tableAwaitLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCaseSourceNativeListApi(param)
        this.tableAwaitList = causeSourceData.data
        this.tableAwaitPagination.total = causeSourceData.total
        this.tableAwaitPagination.current = page
        this.tableAwaitLoading = false
      } catch (error) {
        this.tableAwaitLoading = false
        console.log(error)
      }
    },

    /**
     * 获取订单结算 table 列表
     */
    async _getOrderEndCheckoutList(page = 1) {
      const param = {
        page,
        size: this.tableEndPagination.pageSize,
        status: 2,
        sort: 1,
      }

      // 时间筛选
      this.timeFactorInfo.startDate && (param.start_time = this.timeFactorInfo.startDate)
      this.timeFactorInfo.endDate && (param.end_time = this.timeFactorInfo.endDate)

      this.tableEndLoading = true

      try {
        const { data: causeSourceData } = await causeSourceApi.getCaseSourceNativeListApi(param)
        this.tableEndList = causeSourceData.data
        this.tableEndPagination.total = causeSourceData.total
        this.tableEndPagination.current = page
        this.tableEndLoading = false
      } catch (error) {
        this.tableEndLoading = false
        console.log(error)
      }
    },

    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      if (this.activeTabKey === '1') this._getOrderAwaitCheckoutList(this.tableAwaitPagination.current)
      if (this.activeTabKey === '2') this._getOrderEndCheckoutList(this.tableEndPagination.current)
    },

    /**
     * 查看律师详情
     */
    navToLawyerDetail(record) {
      const userId = String(record.lawyer.user_id)
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
    },
    /**
     * 删除案源精选
     */
    async delCauseSourceFeature(record) {
      const param = { order_no: record.local_case_source_id }
      try {
        const { data: causeSourceData } = await causeSourceApi.delCauseSourceFeatureApi(param)
        this._getOrderAwaitCheckoutList(this.tableAwaitPagination.current)
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
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
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

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  // 列 标签
  .column-label {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
    cursor: pointer;
    .ant-tag {
      margin-right: 0;
      max-width: 100px;
      cursor: pointer;
      -webkit-line-clamp: 1;
      white-space: normal;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .column-image {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    .image-item {
      height: 80px;
      cursor: pointer;
    }
  }
  .column-file {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 6px;
    .file-item {
      font-size: 12px;
      color: #0085FF;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      /* ! autoprefixer: off */
      -webkit-box-orient: vertical;
      cursor: pointer;
    }
  }
}

// 发布线索 modal
.publish-modal {
  .publish-info-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #333;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .publish-info-left {
      min-width: 100px;
      .info-title {
        font-size: 14px;
        font-weight: 600;
      }
    }
    .publish-info-middle {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .input {
        width: 180px;
      }
    }
  }
}
</style>
