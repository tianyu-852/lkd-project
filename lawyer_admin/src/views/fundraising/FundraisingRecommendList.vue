<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card>
          <a-col :span="6">
            <h5 style="margin: 0">
              <b> 案件数量:{{ pagination.total }}</b>
            </h5>
          </a-col>
          <a-col :span="6">
            <!-- 类型:
            <a-select default-value="全部" style="width: 120px" v-model="select" @change="changeType">
              <a-select-option :value="-1"> 全部 </a-select-option>
              <a-select-option :value="1"> 自媒体推荐位 </a-select-option>
              <a-select-option :value="0"> 首页推荐位 </a-select-option>
            </a-select> -->
          </a-col>
          <a-col :span="6">
            <a-input-search placeholder="手机号/订单号" style="width: 200px" v-model="search" @search="onSearch" />
          </a-col>
          <a-col :span="6">
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
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-table
            :rowKey="(record) => record.fundraising_recommend_auth_id"
            :data-source="tableData"
            bordered
            :pagination="pagination"
            :loading="state.loading"
          >
            <a-table-column key="user" title="发起人">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.nickname"
                  :avatar="record.avatar"
                  :mobile="record.mobile"
                  :vip-icon="record.vip_icon"
                  :user-id="record.user_id"
                  :is-bot="record.is_bot"
                  @open="openUser(record.user_id, 'user')"
                />
              </template>
            </a-table-column>
            <a-table-column key="title" width="250px" title="项目详情">
              <template slot-scope="record">
                {{ record.content }}
              </template>
            </a-table-column>
            <a-table-column key="admin_nickname" align="center" data-index="admin_nickname" title="负责客服" />
            <a-table-column key="like_number" title="委托律师">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.lawyer_nickname"
                  :avatar="record.lawyer_avatar"
                  :mobile="record.lawyer_mobile"
                  :vip-icon="record.vip_icon"
                  :user-id="record.user_id"
                  :is-bot="record.is_bot"
                  @open="openUser(record.user_id, 'lawyer')"
                />
              </template>
            </a-table-column>
            <a-table-column key="comment_number" data-index="confirm_number" align="center" title="已证实人数" />
            <a-table-column key="timed_status" data-index="type" align="center" title="推荐类型" />
            <a-table-column key="action" title="操作">
              <template slot-scope="text, record">
                <a-button
                  type="primary"
                  style="margin: 10px"
                  @click="recommendAuth(record, 1)"
                  :loading="state.btnloading"
                >
                  审核成功
                </a-button>
                <br />
                <a-button
                  style="margin: 10px"
                  type="danger"
                  @click="recommendAuth(record, 2)"
                  :loading="state.btnloading"
                >
                  审核失败
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
import { getFundraisingRecommendData, postFundraisingRecommendCheck } from '@/api/fundraising'
import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  name: 'Index',
  components: {
    UserVipCell,
    UserDetailDialog,
  },
  props: {},
  data() {
    return {
      typeUser: '',
      search: '',
      select: -1,
      dateFormat: 'YYYY-MM-DD',
      state: { loading: true, userDialog: false, btnloading: false },
      timeDate: {
        startDate: '',
        endDate: '',
      },
      currentUserId: 0,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getFundraisingRecommendData(page, this.search)
          this.pagination.current = page
        },
      },
      tableData: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    // const condition = this.$route.params.condition
    // if (condition) {
    //   this.pagination.current = condition.current
    //   this.search = condition.search
    //   this.timeDate.startDate = condition.startDate
    //   this.timeDate.endDate = condition.endDate
    //   this.getFundraisingRecommendData(
    //     this.pagination.current,
    //     this.type,
    //     this.search,
    //     this.timeDate.startDate,
    //     this.timeDate.endDate
    //   )
    // } else {
    this.getFundraisingRecommendData(1, this.type, this.search, this.timeDate.startDate, this.timeDate.endDate)
    // }
  },
  mounted() {},
  methods: {
    getFundraisingRecommendData(page) {
      const startDate = this.timeDate.startDate
      const endDate = this.timeDate.endDate
      getFundraisingRecommendData(page, this.select, this.search, startDate, endDate).then((data) => {
        this.tableData = data.data.data
        this.pagination.total = data.data.total
        this.pagination.pageSize = data.data.per_page
        this.state.loading = false
      })
    },
    openUser(userId, type) {
      this.state.userDialog = true
      this.currentUserId = userId
      this.typeUser = type
    },
    // changeType() {
    //   this.getFundraisingRecommendData(1)
    // },
    onSearch() {
      this.state.loading = true
      this.getFundraisingRecommendData(1)
    },
    moment,
    onData(value, dateString) {
      this.state.loading = true
      this.timeDate.startDate = dateString[0]
      this.timeDate.endDate = dateString[1]
      this.getFundraisingRecommendData(1)
    },
    onOk(value) {
      // console.log('onOk: ', value)
    },
    recommendAuth(record, status) {
      this.state.btnloading = true
      const fundraisingRecommendAuthId = record.fundraising_recommend_auth_id
      postFundraisingRecommendCheck(fundraisingRecommendAuthId, status)
        .then(() => {
          this.$message.success('已审核')
        })
        .catch(() => {
          this.$message.error('审核失败')
        })
        .finally(() => {
          this.state.btnloading = false
        })
    },
  },
}
</script>
 <style scoped>
</style>
