<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card>
          <a-row>
            <a-col :span="4">
              <h5 style="margin: 0">
                <b> 案件数量:{{ pagination.total }}</b>
              </h5>
            </a-col>
            <a-col :span="5"> </a-col>
            <a-col :span="5">
              <a-input-search placeholder="手机号/订单号" style="width: 200px" v-model="search" @search="onSearch" />
            </a-col>
            <a-col :span="5"></a-col>
            <a-col :span="5">
              <a-range-picker @change="onData" :Format="dateFormat" />
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-table
            :data-source="tableData"
            bordered
            :pagination="pagination"
            :loading="state.loading"
            :rowKey="(record) => record.fundraising_id"
          >
            <a-table-column key="user" title="发起人">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.litigant.nickname"
                  :avatar="record.litigant.avatar"
                  :mobile="record.litigant.mobile"
                  :user-id="record.litigant.user_id"
                  @open="openUser(record.litigant.user_id, 'user')"
                />
              </template>
            </a-table-column>
            <a-table-column key="title" width="250px" title="项目详情">
              <template slot-scope="record">
                <text-with-row-button :text="record.content" :over-max="40" />
              </template>
            </a-table-column>
            <a-table-column key="view_number" align="center" title="负责客服">
              <template slot-scope="record">
                {{ record.admin.nickname }}
                <br />
                {{ record.admin.real_name }}
              </template>
            </a-table-column>
            <a-table-column key="like_number" title="实名认证">
              <template slot-scope="record">
                <label v-if="record.is_auth === 1" style="color: #2cbf78">已实名认证</label>
                <label v-else style="color: #ff9700">未实名认证</label>
              </template>
            </a-table-column>
            <a-table-column key="comment_number" data-index="fundraising_id" align="center" title="已证实人数" />
            <a-table-column key="timed_status" align="center" title="推荐类型">
              <template slot-scope="record">
                {{ record.created_at }}
              </template>
            </a-table-column>
            <a-table-column key="action" title="操作">
              <template slot-scope="text, record">
                <a-button
                  type="primary"
                  @click="goDetails(record)"
                  style="width: 150px; margin: 5px 0; left: calc(50% - 80px)"
                >
                  审核
                </a-button>
                <br />

                <a-button
                  style="
                    color: #fff;
                    background-color: #2cbf78;
                    border-color: #2cbf78;
                    width: 150px;
                    margin: 5px 0;
                    left: calc(50% - 80px);
                  "
                  >已审核</a-button
                >
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <a-modal v-model="state.modalLoading" title="请输入退还金额" @ok="handleOk" @cancel="handleCancel">
      <a-input placeholder="请输入金额/单位:元" style="width: 300px" v-model="modalMoney" />
    </a-modal>
    <a-modal v-model="state.modalLoading1" title="请确认是否提前结束众筹" @ok="closeFundraising" @cancel="handleCancel">
      提示：该操作不能撤回,确认后将结束筹款
    </a-modal>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" :mode="userType" @close="state.userDialog = false" />
    </q-dialog>
  </div>
</template>
  <script>
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import { getFundraisingListPage, postFundraisingRefund, postFundraisingClose } from '@/api/fundraising'
import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  name: 'Index',
  components: {
    UserVipCell,
    UserDetailDialog,
    TextWithRowButton,
  },
  props: {},
  data() {
    return {
      userType: '',
      search: '',
      select: -1,
      dateFormat: 'YYYY-MM-DD',
      state: { loading: true, userDialog: false, modalLoading: false, modalLoading1: false },
      timeDate: {
        startDate: '',
        endDate: '',
      },
      modalMoney: '',
      fundraisingId: '',
      currentUserId: 0,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.geData(page)
          this.pagination.current = page
        },
      },
      tableData: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    const condition = this.$route.params.condition
    if (condition) {
      this.pagination.current = condition.current
      this.search = condition.search
      this.timeDate.startDate = condition.startDate
      this.timeDate.endDate = condition.endDate
      this.geData(this.pagination.current, this.type, this.search, this.timeDate.startDate, this.timeDate.endDate)
    } else {
      this.geData(1, this.type, this.search, this.timeDate.startDate, this.timeDate.endDate)
    }
  },
  mounted() {},
  methods: {
    geData(page) {
      const perPage = this.pagination.pageSize
      getFundraisingListPage(page, this.search, this.timeDate.startDate, this.timeDate.endDate, perPage)
        .then((data) => {
          // console.log(data)
          this.pagination.pageSize = data.data.per_page
          this.tableData = data.data.data
          this.pagination.total = data.data.total
        })
        .finally(() => {
          this.state.loading = false
        })
    },

    openUser(userId, type) {
      this.state.userDialog = true
      this.currentUserId = userId
      if (type === 'user') {
        this.userType = 'user'
      } else {
        this.userType = 'lawyer'
      }
    },
    // changeType(value) {
    //   console.log(this.select)
    // },
    onSearch() {
      // console.log(this.search)
      this.state.loading = true
      this.geData(1)
    },
    openmodal(id, code, key) {
      this.fundraisingId = id
      if (code === 0) {
        this.state.modalLoading = true
      } else {
        this.state.modalLoading1 = true
      }
    },
    handleCancel() {
      this.modalMoney = ''
      this.state.modalLoading = false
      this.state.modalLoading1 = false
    },
    handleOk() {
      const money = this.modalMoney
      const id = this.fundraisingId
      postFundraisingRefund(id, money)
        .then(() => {
          this.$message.success('已返还')
          this.modalMoney = ''
        })
        .finally(() => {
          this.state.modalLoading = false
        })
    },
    moment,
    onData(value, dateString) {
      // console.log(value, dateString)
      this.timeDate.startDate = dateString[0]
      this.timeDate.endDate = dateString[1]
      this.geData(1)
    },
    startFundraising() {
      // console.log('发起了筹款')
    },
    goDetails(record) {
      const fundraisingId = record.fundraising_id
      const condition = {}
      condition['current'] = this.pagination.current
      condition['search'] = this.search
      condition['startDate'] = this.timeDate.startDate
      condition['endDate'] = this.timeDate.endDate
      this.$router.push({
        name: 'FundraisingInitiate',
        params: { fundraisingId, record, condition },
      })
    },
    closeFundraising() {
      postFundraisingClose(this.fundraisingId, 1).then(() => {
        this.$message.success('已提前结束筹款')
        this.state.modalLoading1 = false
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].fundraising_id === this.fundraisingId) {
            this.tableData[i].is_close = 1
          }
        }
      })
    },
  },
}
</script>
 <style scoped>
</style>
