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
            <a-col :span="5">
              <!-- 类型:
              <a-select default-value="全部" style="width: 120px" @change="changeType" v-model="select">
                <a-select-option :value="-1"> 全部订单 </a-select-option>
                <a-select-option :value="1"> 律师发票 </a-select-option>
                <a-select-option :value="0"> 法院已受理 </a-select-option>
              </a-select> -->
            </a-col>
            <a-col :span="5">
              <a-input-search placeholder="手机号/订单号" style="width: 200px" v-model="search" @search="onSearch" />
            </a-col>
            <a-col :span="5">
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
            <!-- <a-col :span="5">
              <a-button
                type="primary"
                style="float: right; background-color: #2cbf78; border: none"
                @click="startFundraising"
              >
                发起筹款案件</a-button
              >
            </a-col> -->
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
            <a-table-column key="lawyer_number" title="竞标律师">
              <template slot-scope="record">
                {{ record.lawyer_number }}
                <!-- <user-vip-cell
                  :nickname="record.lawyer.nickname"
                  :avatar="record.lawyer.avatar"
                  :mobile="record.lawyer.mobile"
                  :user-id="record.lawyer.user_id"
                  @open="openUser(record.lawyer.user_id, 'lawyer')"
                /> -->
              </template>
            </a-table-column>
            <a-table-column key="comment_number" data-index="created_at" align="center" title="发起时间" />
            <a-table-column key="timed_status" align="center" title="筹款进度">
              <template slot-scope="text, record">
                <label>已筹金额：{{ record.fundraise_money }}</label>
                <label>目标金额：{{ record.target_money }}</label>
              </template>
            </a-table-column>
            <a-table-column key="action" title="案件详情">
              <template slot-scope="text, record">
                <a-button
                  type="primary"
                  @click="goDetails(record)"
                  style="width: 150px; margin: 5px 0; left: calc(50% - 75px)"
                >
                  查看案件筹款详情
                </a-button>
                <br />
                <!-- refundMoney(record.fundraising_id, record.fundraise_money) -->
                <a-button
                  type="primary"
                  :disabled="record.is_refund_litigation_costs === 1 ? true : false"
                  @click="openmodal(record.fundraising_id, 0)"
                  style="
                    background-color: #fff;
                    border-color: #ff9700;
                    color: #ff9700;
                    width: 150px;
                    margin: 5px 0;
                    left: calc(50% - 75px);
                  "
                >
                  返还诉讼费
                </a-button>
                <br />
                <a-button
                  type="primary"
                  @click="openmodal(record.fundraising_id, 1)"
                  :disabled="record.is_close === 1 ? true : false"
                  style="
                    background-color: #fff;
                    border-color: #ff524c;
                    color: #ff524c;
                    width: 150px;
                    margin: 5px 0;
                    left: calc(50% - 75px);
                  "
                >
                  提前结束筹款
                </a-button>
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
        pageSize: 2, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getData(page)
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
      window.sessionStorage.removeItem('searchData')
      this.getData(this.pagination.current, this.type, this.search, this.timeDate.startDate, this.timeDate.endDate)
    } else {
      this.getData(1, this.type, this.search, this.timeDate.startDate, this.timeDate.endDate)
    }
  },
  mounted() {},
  methods: {
    getData(page) {
      getFundraisingListPage(page, this.search, this.timeDate.startDate, this.timeDate.endDate)
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
      this.getData(1)
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
      this.getData(1)
    },
    onOk(value) {
      // console.log('onOk: ', value)
    },
    // startFundraising() {
    //   // console.log('发起了筹款')
    // },
    goDetails(record) {
      const fundraisingProgressId = record.fundraising_progress_id
      const condition = {}
      condition['current'] = this.pagination.current
      condition['search'] = this.search
      condition['startDate'] = this.timeDate.startDate
      condition['endDate'] = this.timeDate.endDate
      this.$router.push({
        name: 'FundraisingDetailsService',
        params: { fundraisingProgressId, record, condition },
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
