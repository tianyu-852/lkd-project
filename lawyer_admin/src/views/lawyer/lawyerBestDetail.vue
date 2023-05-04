<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back">
        <span class="icon-back" @click="$router.back(-1)">←</span>
        <span>订单数量：{{ pagination.total }}</span>
      </div>

      <div style="margin-right: 30px;">{{ bestLawyerDetail.nickname }}</div>
      <div style="margin-right: 30px;">次数：{{ bestLawyerDetail.optimization_order_num }}/{{ bestLawyerDetail.total_num }}</div>
      <div>收益：￥{{ bestLawyerDetail.earnings }}/{{ bestLawyerDetail.expected_earnings }}</div>

      <!-- 时间筛选 -->
      <a-range-picker
        @change="onRangePickerChange"
        @ok="_getBestLawyerDetail()"
        style="width: 340px; margin-left: 30px; margin-right: 30px;"
        format="YYYY-MM-DD HH:mm:ss"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
      />

      <span style="margin-right: 10px;">超时订单: </span>
      <a-switch v-model="timeoutFactor" @change="_getBestLawyerDetail()" />
    </a-layout-header>

    <a-card class="content">
      <div v-if="userInfo && openVipRoleList.includes(userInfo.name)" class="tool-wrap">
        <a-popconfirm v-if="timeFactorInfo.endDate" style="margin-left: auto;" title="是否恢复本时间段的次数？" @confirm="confirmBatchRecoverLawyerOrder()" >
          <a-button type="primary" size="small">批量恢复次数</a-button>
        </a-popconfirm>
        <a-button icon="sync" size="small" :style="{ marginLeft: timeFactorInfo.endDate ? '20px' : 'auto' }" @click="_getBestLawyerDetail(pagination.current)">刷新</a-button>
      </div>

      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.optimization_push_log_id)"
        bordered
      >
        <!-- 订单号 -->
        <a-table-column dataIndex="order_no" title="订单号" align="center" />

        <!-- 客户名称 -->
        <a-table-column dataIndex="user.nickname" title="用户名称" align="center" />

        <!-- 推送时间 -->
        <a-table-column dataIndex="created_at" title="推送时间" align="center" />

        <!-- 抢单时间 -->
        <a-table-column dataIndex="lawyer_grabbed_at" title="抢单时间" align="center" />

        <!-- 订单类型 -->
        <a-table-column dataIndex="order_title" title="订单类型" align="center" />

        <!-- 收益 -->
        <a-table-column dataIndex="order_earns" title="收益" align="center" />

        <!-- 状态 -->
        <a-table-column dataIndex="text" title="状态" align="center" />
        
        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="290px">
          <template slot-scope="record">
            <a-popconfirm v-if="userInfo && openVipRoleList.includes(userInfo.name) && [1, 3, 5].includes(record.is_compute)" title="是否恢复接单次数？" placement="top" @confirm="confirmRecoverLawyerGrabOrderNum(record)">
              <a-button type="link" size="small">恢复本次数</a-button>
            </a-popconfirm>
            <a-popconfirm v-if="userInfo && openVipRoleList.includes(userInfo.name) && ([5].includes(record.is_compute) || ([2].includes(record.is_compute) && record.order_grab === 1))" title="是否扣除抢单？" placement="top" @confirm="confirmRecoverLawyerGrabOrderOrIncome(record)">
              <a-button type="link" size="small">抢单扣除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
  </a-layout>
</template>

<script>
import moment from 'moment'
import JSONbig from 'json-bigint'
import { mapState } from 'vuex'
import * as lawyerApi from '@/api/lawyer'

export default {
  name: 'LawyerBestDetail',
  data() {
    return {
      lawyerUserId: 0, // 用户 id
      
      tabelDataList: [], // 标签列表
      tabelDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getBestLawyerDetail(page)
          this.pagination.current = page
        },
      },

      // 时间过滤条件
      timeFactorInfo: { startDate: '', endDate: '', },
      timeoutFactor: false, // 超时条件

      bestLawyerDetail: {}, // 律师信息
    }
  },
  computed: {
    ...mapState(['openVipRoleList']),

    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    this.lawyerUserId = this.$route.query.lawyerUserId

    const bestLawyerDetail = JSON.parse(sessionStorage.getItem('bestLawyerDetail'))
    this.bestLawyerDetail = bestLawyerDetail
    
    this._getBestLawyerDetail()
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
      if (!dateStrAry[0] || !dateStrAry[1]) this._getBestLawyerDetail()
    },

    /**
     * 获取订单详情列表
     */
     async _getBestLawyerDetail(page = 1) {
      if (!this.lawyerUserId) return
       this.tabelDataLoading = true

       // 请求参数
       const param = {
        page,
        size: this.pagination.pageSize,
        lawyer_user_id: this.lawyerUserId
       }

      //  超市条件
       if (this.timeoutFactor) param.type = 1

       // 时间筛选条件
       if (this.timeFactorInfo.endDate) {
        param.start_time = moment(this.timeFactorInfo.startDate).format('YYYY-MM-DD HH:mm:ss')
        param.end_time = moment(this.timeFactorInfo.endDate).format('YYYY-MM-DD HH:mm:ss')
       }

       try {
         const { data: labelListData } = await lawyerApi.getBestLawyerDetailApi(param)
         this.tabelDataList = labelListData.data
         this.pagination.total = labelListData.total
         this.pagination.current = page
         this.tabelDataLoading = false
       } catch (error) {
         this.tabelDataLoading = false
         console.log(error)
       }
    },

    /**
     * 恢复律师接单次数
     */
    async confirmRecoverLawyerGrabOrderNum(record) {
      const param = { optimization_push_log_id: record.optimization_push_log_id }

      try {
        await lawyerApi.recoverLawyerGrabOrderNumApi(param)
        this._getBestLawyerDetail(this.pagination.current)
        this.$notification.success({ message: '恢复成功', duration: 3 })
      } catch (error) {
        this.tabelDataLoading = false
        console.log(error)
      }
    },

    /**
     * 扣除律师抢单
     */
    async confirmRecoverLawyerGrabOrderOrIncome(record) {
      const param = { optimization_push_log_id: record.optimization_push_log_id }

      try {
        await lawyerApi.recoverLawyerOrderOrIncomeApi(param)
        this._getBestLawyerDetail(this.pagination.current)
        this.$notification.success({ message: '恢复成功', duration: 3 })
      } catch (error) {
        this.tabelDataLoading = false
        console.log(error)
      }
    },

    /**
     * 批量恢复律师接单次数
     */
    async confirmBatchRecoverLawyerOrder() {
      const param = {
        // lawyer_user_id: this.lawyerUserId,
        lawyer_user_id: JSONbig.parse(this.lawyerUserId),
        start_time: moment(this.timeFactorInfo.startDate).format('YYYY-MM-DD HH:mm:ss'),
        end_time: moment(this.timeFactorInfo.endDate).format('YYYY-MM-DD HH:mm:ss')
      }

      try {
        await lawyerApi.batchRecoverLawyerOrderApi(param)
        this._getBestLawyerDetail()
        this.$notification.success({ message: '恢复成功', duration: 3 })
      } catch (error) {
        this.tabelDataLoading = false
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
    align-items: center;
    justify-content: flex-start;
    height: 90px;
    font-size: 16px;
    font-weight: 600;
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

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 12px;
  }
  .column-order {
    cursor: pointer;
  }
}

.label-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .input-title {
      font-size: 14px;
      font-weight: 500;
    }
    .input {
      flex: 1;
    }
  }
}
</style>
