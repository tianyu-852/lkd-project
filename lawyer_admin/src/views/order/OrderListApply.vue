<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div>
        <span class="focus-text">回拨数量：{{ pagination.total }}</span>
        当前状态：
        <a-select :default-value="-1" class="top-select" v-model="type" @change="getSearchPage()">
          <a-select-option v-for="type in typeList" :value="type.value" :key="type.value">
            {{ type.label }}
          </a-select-option>
        </a-select>
        <a-input
          allow-clear
          placeholder="搜索用户名/手机号"
          v-model="search"
          @keyup.enter="getSearchPage"
          style="width: 180px; margin: 0 5px"
        />
        <a-button type="primary" @click="getSearchPage"> 搜索 </a-button>
      </div>
      <div>
        <a-range-picker
          @change="onDateChange"
          :placeholder="rangePlaceholder"
          :default-value="[startDate, endDate]"
          style="width: 300px"
        />
      </div>
    </a-layout-header>
    <a-card class="content">
      <a-table
        :data-source="data"
        bordered
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => (record.order_no ? record.order_no : record.Nokey)"
      >
        <a-table-column key="user" title="发布人">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.user.nickname"
              :avatar="record.user.avatar"
              :mobile="record.user.mobile"
              :user-id="String(record.user.user_id)"
              :size="userSize"
              @open="openUser(String(record.user.user_id), 'user')"
            />
          </template>
        </a-table-column>
        <a-table-column key="lawyer" title="当前律师">
          <template slot-scope="record">
            <user-vip-cell
              :size="userSize"
              :nickname="record.lawyer.nickname"
              :avatar="record.lawyer.avatar"
              :mobile="record.lawyer.mobile"
              :user-id="String(record.lawyer.user_id)"
              @open="openLawyer(String(record.lawyer.user_id), 'lawyer')"
            />
          </template>
        </a-table-column>
        <a-table-column key="order_no" title="订单号">
          <template slot-scope="record">
            <span>{{ record.order_no ? record.order_no : '未回拨暂无订单号' }}</span>
            <a v-show="record.order_no" @click="copyOrderNo(record)">|复制</a>
            <br />
            {{ record.created_at }}
          </template>
        </a-table-column>
        <a-table-column key="lawyers" title="录音">
          <template slot-scope="record">
            <a-select style="width: 120px" placeholder="请选择录音" @change="handleChange">
              <a-select-option v-for="(i, key) in record.records" :key="key" :value="i.record_path">
                {{ i.duration }}
              </a-select-option>
            </a-select>
            <a @click="openRecord">播放</a>
          </template>
        </a-table-column>
        <a-table-column key="order_status" title="订单状态">
          <template slot-scope="record">
            {{ record.order_status }}
          </template>
        </a-table-column>
        <a-table-column key="apply_status" title="申请状态">
          <template slot-scope="record">
            {{ record.apply_status }}
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="text, record">
            <a-button
              :disabled="record.order_no ? false : true"
              style="margin-right: 16px; margin-top: 5px"
              size="small"
              type="primary"
              @click="gotodetail(record)"
            >
              查看详情
            </a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
    <input id="input" style="opacity: 0; position: absolute" />
    <a-drawer
      title="录音播放"
      placement="right"
      :closable="false"
      :visible="state.recordVisible"
      @close="state.recordVisible = false"
      width="400"
    >
      <single-audio-player :src="currentPlayRecord" />
    </a-drawer>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" @close="state.userDialog = false" />
    </q-dialog>
    <q-dialog v-model="state.lawyerDialog">
      <user-detail-dialog :user-id="currentLawyerId" mode="lawyer" @close="state.lawyerDialog = false" />
    </q-dialog>
    <q-dialog v-model="state.evaluateDialog">
      <order-evaluate-dialog
        :nickname="currentOrder.nickname"
        :evaluate="currentOrder.evaluate"
        :evaluate-score="currentOrder.evaluate_score"
        :evaluate-reasons="currentOrder.order_evaluate_reasons"
      />
    </q-dialog>
    <a-modal
      v-model="state.modalLodaing"
      title="退款确认"
      @ok="state.modalLodaing = false"
      ok-text="确认"
      cancel-text="取消"
    >
    </a-modal>
  </a-layout>
</template>
<script>
import { getOrderCallPhoneApply } from '@/api/order'
import UserCell from '@/components/User/UserCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import OrderEvaluateDialog from '@/components/Order/OrderEvaluateDialog'
export default {
  name: 'OrderList',
  components: { UserVipCell, OrderEvaluateDialog, UserDetailDialog, SingleAudioPlayer, UserCell },
  data() {
    return {
      userSize: 'sm',
      data: [],
      search: '',
      startDate: null,
      endDate: null,
      currentPlayRecord: '',
      currentUserId: 0,
      currentLawyerId: 0,
      currentOrder: {},
      type: -1,
      state: {
        loading: false,
        recordVisible: false,
        userDialog: false,
        lawyerDialog: false,
        evaluateDialog: false,
        modalLodaing: false,
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        onChange: (page) => {
          this.getOrderCallPhoneApply(page, this.search)
          this.pagination.current = page
        },
      },
      typeList: [
        {
          label: '全部',
          value: -1,
        },
        {
          label: '待回拨',
          value: 0,
        },
        {
          label: '律师已回拨',
          value: 1,
        },
        {
          label: '律师已忽略',
          value: 2,
        },
      ],
      rangePlaceholder: ['开始日期', '结束日期'],
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition.search = this.search
      condition.startDate = this.startDate
      condition.endDate = this.endDate
      condition.type = this.type
      condition.page = this.pagination.current
      return condition
    },
  },
  created() {
    if (JSON.parse(sessionStorage.getItem('orderApplyCondition'))) {
      const condition = JSON.parse(sessionStorage.getItem('orderApplyCondition'))
      this.search = condition.search
      this.startDate = condition.startDate
      this.endDate = condition.endDate
      this.type = condition.type
      this.pagination.current = condition.page
      window.sessionStorage.removeItem('orderApplyCondition')
      this.getOrderCallPhoneApply(condition.page, this.search)
    } else {
      this.getOrderCallPhoneApply(1, '')
    }
  },
  mounted() {
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    beforeunloadFn(e) {
      sessionStorage.setItem('orderApplyCondition', JSON.stringify(this.conditionData))
    },
    openEvaluate(order) {
      this.state.evaluateDialog = true
      this.currentOrder = order
    },
    openUser(userId) {
      this.state.userDialog = true
      this.currentUserId = userId
    },
    openLawyer(lawyerUserId) {
      this.state.lawyerDialog = true
      this.currentLawyerId = lawyerUserId
    },
    openRecord(recordUrl) {
      this.state.recordVisible = true
    },
    getSearchPage() {
      this.getOrderCallPhoneApply(1, this.search)
    },
    getOrderCallPhoneApply(page, search) {
      this.state.loading = true
      if (this.startDate === '') {
        this.startDate = null
      }
      if (this.endDate === '') {
        this.endDate = null
      }
      getOrderCallPhoneApply(page, this.type, search, this.startDate, this.endDate)
        .then(({ data }) => {
          this.pagination.total = data.total
          this.pagination.current = page
          this.data = data.data
          for (let i = 0; i < this.data.length; i++) {
            this.data[i].Nokey = i
          }
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    onDateChange(date, dateString) {
      ;[this.startDate, this.endDate] = dateString
      this.getOrderCallPhoneApply(1, this.search)
    },
    copyOrderNo(record) {
      var input = document.getElementById('input')
      input.value = record.order_no
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success('已复制！')
      } else {
        this.$message.error('复制失败！')
      }
    },
    gotodetail(data) {
      const orderId = String(data.order_no)
      const orderPage = [3, data.order_refund_id]
      sessionStorage.setItem('orderApplyCondition', JSON.stringify(this.conditionData))
      sessionStorage.setItem('orderPage', JSON.stringify(orderPage))
      this.$router.push({ name: 'OrderDetail', params: { orderId } })
    },
    handleChange(value) {
      this.currentPlayRecord = value
      console.log(this.currentPlayRecord)
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
    justify-content: space-between;
    &-select {
      margin-right: 20px;
      width: 120px;
    }
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
</style>
