<template>
  <div>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <a-card>
          <a-row>
            <a-col :span="4">
              <h5><b> 资金流水</b></h5>
            </a-col>
            <a-col :span="4">
              <a-range-picker
                @change="onData"
                :Format="dateFormat"
                @onOk="
                  {
                    onOk
                  }
                "
              />
            </a-col>
            <a-col :span="2" :offset="13">
              <a-button @click.native="$router.back(-1)">返回上一页</a-button>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-table
            :columns="columns"
            :data-source="detailData"
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
import { getDetailStatistics } from '@/api/assets'
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
    title: '资金来源',
    dataIndex: 'balance_detail_type',
  },

  {
    title: '金额',
    dataIndex: 'money',
  },
  {
    title: '时间',
    dataIndex: 'created_at',
  },
  {
    title: '订单号',
    dataIndex: 'order_no',
  },
]
export default {
  components: { UserDetailDialog, UserVipCell, UserMutedButton },
  data() {
    return {
      dateFormat: 'YYYY/MM/DD',
      columns,
      id: '',
      loading: true,
      detailData: [],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        showTotal: (total) => `共${total}条`,
        onChange: this.onChange.bind(this),
        total: 1,
        showQuickJumper: true,
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
  methods: {
    onChange(pageNumber) {
      this.getDetailPage(pageNumber)
    },
    moment,
    onData(value, dateString) {
      this.loading = true
      this.startDate = dateString[0]
      this.endDate = dateString[1]
      this.getDetailPage(1)
    },
    onOk(value) {
      console.log('onOk: ', value)
    },
    openUser(id) {
      // this.state.userDialog = true
      this.currentUserId = id
    },
    getDetailPage(page) {
      getDetailStatistics(page, this.id, this.startDate, this.endDate)
        .then((data) => {
          this.pagination.total = data.data.total
          this.detailData = data.data.data
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  created() {
    this.id = this.$route.query.id
    this.getDetailPage(1, this.id)
  },
}
</script>

<style scoped>
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