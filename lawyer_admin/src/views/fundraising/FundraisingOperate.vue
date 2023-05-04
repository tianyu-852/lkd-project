<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card>
          <a-row>
            <a-col :span="4">
              <h5 style="margin: 0">
                <b> 待审核数量：{{ pagination.total }}</b>
              </h5>
            </a-col>
            <a-col :span="5"> </a-col>
            <a-col :span="5">
              <a-input-search placeholder="手机号/订单号" style="width: 200px" v-model="search" @search="onSearch" />
            </a-col>
            <a-col :span="5" :offset="5">
              <a-range-picker
                @change="onData"
                :Format="dateFormat"
                :default-value="[timeDate.startDate, timeDate.endDate]"
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
            :rowKey="(record) => record.fundraising_registration_id"
          >
            <a-table-column key="service" title="负责客服">
              <template slot-scope="record">
                <div>
                  <user-vip-cell
                    :nickname="record.admin.nickname"
                    :avatar="record.admin.avatar"
                    :mobile="record.admin.mobile"
                    :user-id="record.admin_id"
                    @open="openUser(record.admin_id, 'user')"
                  />
                </div>
              </template>
            </a-table-column>
            <a-table-column key="user" title="申请用户">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.creator.nickname"
                  :avatar="record.creator.avatar"
                  :mobile="record.creator.mobile"
                  :user-id="record.creator.user_id"
                  :is-bot="record.is_bot"
                  @open="openUser(record.creator.user_id, 'user')"
                />
              </template>
            </a-table-column>
            <a-table-column key="like_number" title="当事人">
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
            <a-table-column key="time" title="发起时间/地点">
              <template slot-scope="record">
                <div>
                  {{ record.created_at }}
                  <br />
                  {{ record.litigant.province }}{{ record.litigant.city }}
                </div>
              </template>
            </a-table-column>
            <a-table-column key="is_auth" align="center" title="订单状态">
              <template slot-scope="record">
                {{ record.status }}
              </template>
            </a-table-column>
            <a-table-column key="created_at" align="center" title="备注">
              <template slot-scope="record">
                <div>
                  <text-with-row-button :text="record.remark" :over-max="20" />
                </div>
              </template>
            </a-table-column>
            <a-table-column key="action" title="操作">
              <template slot-scope="text, record">
                <a-button type="primary" style="margin: 5px" @click="goDetails(record)">
                  {{
                    record.status === '制作视频' || record.status === '运营确定素材' ? record.status : '提交素材清单'
                  }}
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
    <a-modal v-model="state.modalLodaing" title="备注" @ok="uploadText">
      <a-textarea v-model="modalValue" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
    </a-modal>
  </div>
</template>
  <script>
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import { getFundraisingPage, deleteFundraisingDelete } from '@/api/fundraising'
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
      dateFormat: 'YYYY-MM-DD',
      state: { loading: true, userDialog: false, modalLodaing: false },
      currentUserId: 0,
      modalValue: '',
      timeDate: {
        startDate: '',
        endDate: '',
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getFundraisingPage(page, this.status, this.search, this.timeDate.startDate, this.timeDate.endDate)
          this.pagination.current = page
        },
      },
      search: '',
      tableData: [],
      status: 1, //  0: "老板审核分页",1: "运营分页数据",
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
      this.getFundraisingPage(
        this.pagination.current,
        this.type,
        this.search,
        this.timeDate.startDate,
        this.timeDate.endDate
      )
    } else {
      this.getFundraisingPage(1, this.status, this.search, this.timeDate.startDate, this.timeDate.endDate)
    }
  },
  mounted() {},
  methods: {
    getFundraisingPage(page, status, search, startDate, endDate) {
      getFundraisingPage(page, status, search, startDate, endDate).then((data) => {
        this.pagination.total = data.data.total
        this.tableData = data.data.data
        this.pagination.pageSize = data.data.per_page
        this.state.loading = false
      })
    },
    openUser(userId, type) {
      this.state.userDialog = true
      this.currentUserId = userId
      this.typeUser = type
    },
    goDetails(record) {
      const type = 'operate'
      const condition = {}
      condition['current'] = this.pagination.current
      condition['search'] = this.search
      condition['startDate'] = this.timeDate.startDate
      condition['endDate'] = this.timeDate.endDate
      const fundraisingProgressId = record.fundraising_progress_id
      sessionStorage.setItem('fundraisingProgressId', JSON.stringify(fundraisingProgressId))
      this.$router.push({
        name: 'FundraisingDetailsCheck',
        params: { record, type, fundraisingProgressId, condition },
      })
    },
    onSearch() {
      this.state.loading = true
      this.getFundraisingPage(1, this.status, this.search, this.timeDate.startDate, this.timeDate.endDate)
    },
    moment,
    onData(value, dateString) {
      this.timeDate.startDate = dateString[0]
      this.timeDate.endDate = dateString[1]
      this.getFundraisingPage(1, this.status, this.search, this.timeDate.startDate, this.timeDate.endDate)
    },
    uploadText() {
      this.state.modalLodaing = false
      this.modalValue = ''
    },
  },
}
</script>
 <style scoped>
</style>
