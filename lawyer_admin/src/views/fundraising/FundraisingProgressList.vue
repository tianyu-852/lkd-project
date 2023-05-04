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
              <a-input-search placeholder="手机号/订单号" style="width: 200px" v-model="search" @search="onSearch" />
            </a-col>
            <a-col :span="5" :offset="10">
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
            :rowKey="(record) => record.fundraising_progress_item_auth_id"
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
            <a-table-column key="content" width="250px" title="项目详情">
              <template slot-scope="record">
                <text-with-row-button :text="record.content" :over-max="40" />
              </template>
            </a-table-column>
            <a-table-column key="admin" align="center" title="负责客服">
              <template slot-scope="record">
                <b>{{ record.admin.nickname }}</b>
                <br />
                {{ record.admin.alias }}
              </template>
            </a-table-column>
            <a-table-column key="lawyer" title="委托律师">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.lawyer.nickname"
                  :avatar="record.lawyer.avatar"
                  :mobile="record.lawyer.mobile"
                  :user-id="record.lawyer.user_id"
                  @open="openUser(record.lawyer.user_id, 'lawyer')"
                />
              </template>
            </a-table-column>
            <!-- <a-table-column key="fundraising_progress	" width="250px" title="上个进度">
              <template slot-scope="record">
                {{ record.fundraising_progress }}
              </template>
            </a-table-column> -->
            <a-table-column key="fundraising_progress	" width="250px" title="当前进度">
              <template slot-scope="record">
                {{ record.fundraising_progress }}
              </template>
            </a-table-column>
            <a-table-column key="action" title="案件详情">
              <template slot-scope="text, record">
                <a-button type="primary" @click="goDetails(record.fundraising_progress_item_auth_id)">
                  查看案件筹款详情
                </a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" :mode="typeUser" @close="state.userDialog = false" />
    </q-dialog>
  </div>
</template>
  <script>
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import { getFundraisingProgressPage } from '@/api/fundraising'
import TextWithRowButton from '@/components/Common/TextWithRowButton'
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
      typeUser: '',
      search: '',
      dateFormat: 'YYYY-MM-DD',
      state: { loading: true, userDialog: false },
      currentUserId: 0,
      timeDate: {
        startDate: '',
        endDate: '',
      },
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
      const startDate = this.timeDate.startDate
      const endDate = this.timeDate.endDate
      getFundraisingProgressPage(page, this.search, startDate, endDate).then((data) => {
        this.tableData = data.data.data
        this.pagination.total = data.data.total
        this.pagination.pageSize = data.data.per_page
        // console.log(this.tableData)
      })
      this.state.loading = false
    },
    openUser(userId, type) {
      this.state.userDialog = true
      this.currentUserId = userId
      this.typeUser = type
    },
    changeType() {
      // console.log(this.select)
    },
    onSearch() {
      // console.log(this.search)
      this.state.loading = true
      this.geData(1, this.status, this.search, this.timeDate.startDate, this.timeDate.endDate)
    },
    moment,
    onData(value, dateString) {
      // console.log(value, dateString)
      this.timeDate.startDate = dateString[0]
      this.timeDate.endDate = dateString[1]
      this.geData(1, this.status, this.search, this.timeDate.startDate, this.timeDate.endDate)
    },
    onOk(value) {
      // console.log('onOk: ', value)
    },
    goDetails(fundraisingProgressItemAuthId) {
      this.$router.push({ name: 'FundraisingProgress', params: { fundraisingProgressItemAuthId } })
    },
  },
}
</script>
 <style scoped>
</style>
