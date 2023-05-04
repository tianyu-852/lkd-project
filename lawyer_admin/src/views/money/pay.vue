<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">支付记录：{{ pagination.total }}</span>
      <div style="margin-right: 30px;">
        类型：
        <a-select style="width: 120px" @change="onChange1" v-model="type">
          <a-select-option :value="-1"> 全部 </a-select-option>
          <a-select-option :value="1"> 微信 </a-select-option>
          <a-select-option :value="2"> 支付宝</a-select-option>
          <a-select-option :value="99"> 苹果内购</a-select-option>
        </a-select>
      </div>
      <a-range-picker
        style="margin-right: 30px;"
        @change="onData"
        :default-value="[startDate, endDate]"
        :Format="dateFormat"
        @onOk=" { onOk } "
      />

      <a-input-search placeholder="手机号/订单号" style="width: 200px; margin-right: 30px;" @search="onSearch" allow-clear />
    </a-layout-header>
          
    <a-card class="content">
      <a-table
        :columns="columns"
        :data-source="paymentData"
        bordered
        :pagination="pagination"
        :rowKey="(record) => record.order_no"
        :loading="loading"
      >
        <div slot="nickname" slot-scope="text, record" class="userDiv">
          <user-vip-cell
            :nickname="record.nickname"
            :avatar="record.avatar"
            :mobile="record.mobile"
            :user-id="String(record.user_id)"
            @open="openUser(String(record.user_id))"
          />
        </div>
        <!-- 支付对象 -->
        <div slot="deal_target">
          <div>平台</div>
        </div>
      </a-table>
    </a-card>

    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" mode="lawyer" @close="state.userDialog = false" />
    </q-dialog>
  </a-layout>
</template>

<script>
import AStyleButton from '@/components/Common/AStyleButton.vue'
import { getPaymentStatistics } from '@/api/assets'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import UserMutedButton from '@/components/User/UserMutedButton'
import moment from 'moment'
import 'moment/locale/zh-cn'

const columns = [
  {
    title: '用户',
    key: 'nickname',
    dataIndex: 'nickname',
    slots: { title: 'nickname' },
    scopedSlots: { customRender: 'nickname' },
  },
  {
    title: '支付对象',
    dataIndex: 'deal_target',
    scopedSlots: { customRender: 'deal_target' },
  },
  {
    title: '交易号',
    dataIndex: 'deal_no',
  },
  {
    title: '订单号',
    dataIndex: 'order_no',
  },
  {
    title: '金额',
    dataIndex: 'money_real',
  },
  {
    title: '类型',
    dataIndex: 'payment_type',
  },
  // {
  //   title: '状态',
  //   dataIndex: 'transfertime',
  //   scopedSlots: { customRender: 'transfertime' },
  // },
  {
    title: '时间',
    dataIndex: 'created_at',
  },
]

export default {
  components: { UserDetailDialog, UserVipCell, UserMutedButton },
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      AStyleButton,
      columns,
      loading: true,
      paymentData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        showTotal: (total) => `共${total}条`,
        showQuickJumper: true,
        onChange: (page) => {
          this.getPaymentpage(page)
          this.pagination.current = page
        },
      },
      type: -1,
      startDate: '',
      endDate: '',
      search: '',
      currentUserId: 0,
      state: {
        userDialog: false,
      },
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['type'] = this.type
      condition['search'] = this.search
      condition['startDate'] = this.startDate
      condition['endDate'] = this.endDate
      return condition
    },
  },
  created() {
    const condition = JSON.parse(sessionStorage.getItem('payCondition'))
    if (condition) {
      this.pagination.current = condition.current
      this.type = condition.type
      this.search = condition.search
      this.startDate = condition.startDate
      this.endDate = condition.endDate
      window.sessionStorage.removeItem('payCondition')
      this.getPaymentpage(condition.current)
    } else {
      this.getPaymentpage(1)
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
      sessionStorage.setItem('payCondition', JSON.stringify(this.conditionData))
    },
    onChange(pageNumber) {
      console.log('Page: ', pageNumber)
      this.getPaymentpage(pageNumber, this.type, this.search, this.startDate, this.endDate)
    },
    moment,
    onData(value, dateString) {
      this.startDate = dateString[0]
      this.endDate = dateString[1]
      this.getPaymentpage(1)
    },
    onOk(value) {
      console.log('onOk: ', value)
    },
    onChange1(e) {
      this.type = e
      this.getPaymentpage(1)
    },
    onSearch(value) {
      this.search = value
      this.getPaymentpage(1)
    },
    openUser(id) {
      // this.state.userDialog = true
      this.currentUserId = id
    },
    getPaymentpage(page) {
      getPaymentStatistics(page, this.type, this.search, this.startDate, this.endDate)
        .then((data) => {
          this.pagination.total = data.data.total
          this.paymentData = data.data.data
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
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
  }
}

.content {
  margin-top: 16px;
}

.imgUser {
  height: 50px;
  width: 50px;
  margin-right: 10px;
}
.userDiv {
  display: flex;
  justify-self: start;
}
</style>
