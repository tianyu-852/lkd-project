<template>
  <div>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <a-card>
          <a-row>
            <a-col :span="4">
              <h5><b>转账记录</b></h5>
            </a-col>

            <a-col :span="4" :offset="1">
              <a-input-search placeholder="手机号/订单号" style="width: 200px" @search="onSearch" allow-clear />
            </a-col>
            <a-col :span="6" :offset="5">
              <a-range-picker @change="onData" :default-value="[startDate, endDate]" />
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <a-col :span="24">
        <a-card>
          <a-table
            :columns="columns"
            :data-source="transferData"
            bordered
            :pagination="pagination"
            :rowKey="(record) => record.withdraw_id"
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
            <template slot="withdrawn_images" slot-scope="text, record">
              <li v-for="i in record.withdrawn_images.length" :key="i">
                <img :src="record.withdrawn_images[i]" class="imgUser" />
              </li>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>

    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" mode="lawyer" @close="state.userDialog = false" />
    </q-dialog>
  </div>
</template>

<script>
import AStyleButton from '@/components/Common/AStyleButton.vue'
import { getSuccessStatistics } from '@/api/assets'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import UserMutedButton from '@/components/User/UserMutedButton'
import moment from 'moment'

const columns = [
  {
    title: '用户',
    key: 'nickname',
    dataIndex: 'nickname',
    slots: { title: 'nickname' },
    scopedSlots: { customRender: 'nickname' },
  },
  {
    title: '订单号',
    dataIndex: 'withdraw_no',
  },
  {
    title: '金额',
    dataIndex: 'withdraw_money',
  },
  {
    title: '类型',
    dataIndex: 'withdraw_type',
  },
  {
    title: '转账详情',
    dataIndex: 'withdrawn_images',
    scopedSlots: { customRender: 'withdrawn_images' },
  },
  {
    title: '时间',
    dataIndex: 'created_at',
  },
]

export default {
  name: 'TransferCheck',
  components: { UserDetailDialog, UserVipCell, UserMutedButton },
  data() {
    return {
      dateFormat: 'YYYY/MM/DD',
      AStyleButton,
      columns,
      loading: true,
      transferData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        showTotal: (total) => `共${total}条`,
        showQuickJumper: true,
        onChange: (page) => {
          this.pagination.current = page
          this.getSuccessPage(page)
        },
      },
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
      condition['search'] = this.search
      condition['startDate'] = this.startDate
      condition['endDate'] = this.endDate
      return condition
    },
  },
  created() {
    const condition = JSON.parse(sessionStorage.getItem('transferCondition'))
    if (condition) {
      this.pagination.current = condition.current
      this.search = condition.search
      this.startDate = condition.startDate
      this.endDate = condition.endDate
      window.sessionStorage.removeItem('transferCondition')
      this.getSuccessPage(condition.current)
    } else {
      this.getSuccessPage(1, '')
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
      sessionStorage.setItem('transferCondition', JSON.stringify(this.conditionData))
    },
    onChange(pageNumber) {
      console.log('Page: ', pageNumber)
      this.getSuccessPage(pageNumber, this.search, this.startDate, this.endDate)
    },
    openUser(id) {
      // this.state.userDialog = true
      this.currentUserId = id
    },
    moment,
    onData(value, dateString) {
      this.startDate = dateString[0]
      this.endDate = dateString[1]
      this.getSuccessPage(1, this.search, this.startDate, this.endDate)
    },
    onSearch(value) {
      this.search = value
      this.getSuccessPage(1, this.search, this.startDate, this.endDate)
    },
    getSuccessPage(page) {
      getSuccessStatistics(page, this.search, this.startDate, this.endDate)
        .then((data) => {
          this.pagination.total = data.data.total
          this.transferData = data.data.data
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

<style >
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
