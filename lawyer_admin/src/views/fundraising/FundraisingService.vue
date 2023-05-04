<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card>
          <a-row>
            <a-col :span="6">
              <h5 style="margin: 0">
                <b> 待审核数量：{{ pagination.total }}</b>
              </h5>
            </a-col>
            <a-col
              :span="5"
              style="height: 32px; display: flex; align-items: center; flex-direction: row; justify-content: center"
            >
              <div @click="changeScreen(0)" style="cursor: pointer; margin: 0 10px">
                <img
                  v-show="screen.isPendingHandle === 0"
                  :src="iconList[0].url"
                  style="width: 14px; height: 14px; margin-right: 5px"
                />
                <img
                  v-show="screen.isPendingHandle === 1"
                  :src="iconList[1].url"
                  style="width: 14px; height: 14px; margin-right: 5px"
                />待跟进
              </div>
              <div @click="changeScreen(1)" style="cursor: pointer; margin: 0 10px">
                <img
                  v-show="screen.isCollect === 0"
                  :src="iconList[0].url"
                  style="width: 14px; height: 14px; margin-right: 5px"
                />
                <img
                  v-show="screen.isCollect === 1"
                  :src="iconList[2].url"
                  style="width: 14px; height: 14px; margin-right: 5px"
                />收藏
              </div>
              <div @click="changeScreen(2)" style="cursor: pointer; margin: 0 10px">
                <img
                  v-show="screen.isGiveUp === 0"
                  :src="iconList[0].url"
                  style="width: 14px; height: 14px; margin-right: 5px"
                />
                <img
                  v-show="screen.isGiveUp === 1"
                  :src="iconList[3].url"
                  style="width: 14px; height: 14px; margin-right: 5px"
                />放弃
              </div>
            </a-col>
            <a-col :span="5">
              <a-input-search placeholder="手机号/订单号" style="width: 200px" v-model="search" @search="onSearch" />
            </a-col>
            <a-col :span="5" :offset="3">
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
            :rowKey="(record) => record.fundraising_progress_id"
            :rowClassName="rowClassName"
          >
            <a-table-column key="user" title="发起人姓名">
              <template slot-scope="record">
                <div style="display: flex; align-items: center; flex-direction: row">
                  <img
                    v-show="record.remark_status === 2"
                    :src="require('@/assets/Fundraising/sc_icon_sel@3x.png')"
                    style="height: 16px; width: 16px"
                  />
                  <div v-show="record.remark_status !== 2" style="height: 16px; width: 16px"></div>
                  <user-vip-cell
                    :nickname="record.create_user_nickname"
                    :avatar="record.create_avatar"
                    :mobile="record.create_mobile"
                    :user-id="record.user_id"
                    @open="openUser(record.create_user_id, 'user')"
                  />
                </div>
              </template>
            </a-table-column>
            <a-table-column key="like_number" title="当事人姓名">
              <template slot-scope="record">
                <!-- v-if="record.litigant_user_id !== record.create_user_id && record.litigant_user_id !== null" -->
                <user-vip-cell
                  :nickname="record.litigant_user_nickname"
                  :avatar="record.litigant_avatar"
                  :mobile="record.litigant_mobile"
                  :user-id="record.litigant_user_id"
                  @open="openUser(record.create_user_id, 'user')"
                />
              </template>
            </a-table-column>
            <a-table-column key="created_at" title="发起时间/地点">
              <template slot-scope="record">
                <div>
                  {{ record.created_at }}
                  <br />
                  {{ record.created_province }}{{ record.created_city }}
                </div>
              </template>
            </a-table-column>
            <a-table-column key="fundraise_money" align="center" title="订单状态">
              <template slot-scope="text, record">
                <div v-if="record.status === 50">
                  <label><a>筹款进度</a></label>
                  <br />
                  已筹金额：{{ record.fundraise_money }}元
                  <br />
                  目标金额： {{ record.target_money }}元
                </div>
                <div v-else>
                  {{ record.status_chinese }}
                </div>
              </template>
            </a-table-column>
            <a-table-column key="created_text" align="center" title="备注">
              <template slot-scope="record">
                <text-with-row-button :text="record.remark" :over-max="20" />
              </template>
            </a-table-column>
            <a-table-column key="action" title="操作" align="center">
              <template slot-scope="text, record">
                <a-button type="primary" @click="goDetails(record)" style="margin: 0 5px">查看详情</a-button>
                <a-button
                  v-if="record.remark === ''"
                  @click="openModal(record)"
                  style="color: #2cbf78; border-color: #2cbf78; margin: 5px"
                >
                  备注
                </a-button>
                <a-button v-else @click="openModal(record)" style="color: #ff9700; border-color: #ff9700; margin: 5px">
                  已备注
                </a-button>
                <a-select
                  v-model="record.remark_status_cn"
                  style="width: 80px; margin: 5px"
                  @change="handleChange(record)"
                >
                  <a-select-option value="1"> 待跟进 </a-select-option>
                  <a-select-option value="2"> 收藏 </a-select-option>
                  <a-select-option value="3"> 放弃 </a-select-option>
                </a-select>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <a-modal v-model="state.modalLodaing" title="备注" @ok="uploadText" ok-text="确认" cancel-text="取消">
      <a-textarea v-model="modalValue" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
    </a-modal>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" mode="user" @close="state.userDialog = false" />
    </q-dialog>
  </div>
</template>
  <script>
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import { getFundraisingServicePage, putFundraisingRemark, putFundraisingRemarkStatus } from '@/api/fundraising'
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
      dateFormat: 'YYYY-MM-DD',
      state: { loading: false, userDialog: false, modalLodaing: false },
      currentUserId: 0,
      timeDate: {
        startDate: '',
        endDate: '',
      },
      screen: {
        isPendingHandle: 0,
        isCollect: 0,
        isGiveUp: 0,
      },
      iconList: [
        {
          url: require('@/assets/Fundraising/xz_icon_black.png'),
        },
        {
          url: require('@/assets/Fundraising/xz_icon_blue.png'),
        },
        {
          url: require('@/assets/Fundraising/xz_icon_yellow.png'),
        },
        {
          url: require('@/assets/Fundraising/xz_icon_red.png'),
        },
        {
          url: require('@/assets/Fundraising/sc_icon_sel@3x.png'),
        },
      ],
      current: 4,
      modalValue: '',
      modalId: 0,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getServicePage(page, this.status, this.search, this.timeDate.startDate, this.timeDate.endDate)
          this.pagination.current = page
        },
      },
      tableData: [],
      status: -1,
      search: '',
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['search'] = this.search
      condition['startDate'] = this.timeDate.startDate
      condition['endDate'] = this.timeDate.endDate
      condition['screen'] = this.screen
      return condition
    },
  },
  watch: {
    updata(value) {
      console.log(value)
    },
  },
  created() {
    const condition = JSON.parse(sessionStorage.getItem('fundraisingServiceCondition'))
    if (condition) {
      this.pagination.current = condition.current
      this.search = condition.search
      this.timeDate.startDate = condition.startDate
      this.timeDate.endDate = condition.endDate
      this.screen = condition.screen
      window.sessionStorage.removeItem('fundraisingServiceCondition')
      this.getServicePage(
        this.pagination.current,
        this.status,
        this.search,
        this.timeDate.startDate,
        this.timeDate.endDate
      )
    } else {
      this.getServicePage(1, this.status, this.search, this.timeDate.startDate, this.timeDate.endDate)
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
      sessionStorage.setItem('fundraisingServiceCondition', JSON.stringify(this.conditionData))
    },
    getServicePage(page, status, search, startDate, endDate) {
      getFundraisingServicePage(
        page,
        status,
        search,
        startDate,
        endDate,
        this.screen.isPendingHandle,
        this.screen.isCollect,
        this.screen.isGiveUp
      ).then((data) => {
        this.tableData = data.data.data
        this.pagination.total = data.data.total
        this.pagination.pageSize = data.data.per_page
        this.state.loading = false
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].remark_status === 0) {
            this.tableData[i].remark_status_cn = '无'
          }
          if (this.tableData[i].remark_status === 1) {
            this.tableData[i].remark_status_cn = '待跟进'
          }
          if (this.tableData[i].remark_status === 2) {
            this.tableData[i].remark_status_cn = '收藏'
          }
          if (this.tableData[i].remark_status === 3) {
            this.tableData[i].remark_status_cn = '放弃'
          }
        }
      })
    },
    openUser(userId) {
      this.state.userDialog = true
      this.currentUserId = userId
    },
    goDetails(record) {
      const fundraisingProgressId = record.fundraising_progress_id
      sessionStorage.setItem('fundraisingProgressId', JSON.stringify(fundraisingProgressId))
      sessionStorage.setItem('fundraisingServiceCondition', JSON.stringify(this.conditionData))
      this.$router.push({
        name: 'FundraisingDetailsService',
        params: { fundraisingProgressId, record },
      })
    },
    onSearch() {
      this.state.loading = true
      this.getServicePage(1, this.status, this.search, this.timeDate.startDate, this.timeDate.endDate)
    },
    moment,
    onData(value, dateString) {
      this.timeDate.startDate = dateString[0]
      this.timeDate.endDate = dateString[1]
      this.getServicePage(1, this.status, this.search, this.timeDate.startDate, this.timeDate.endDate)
    },
    openModal(record) {
      this.state.modalLodaing = true
      this.modalValue = record.remark
      this.modalId = record.fundraising_progress_id
    },
    uploadText() {
      putFundraisingRemark(this.modalId, this.modalValue).then((data) => {
        this.state.modalLodaing = false
        this.getServicePage(
          this.pagination.current,
          this.status,
          this.search,
          this.timeDate.startDate,
          this.timeDate.endDate
        )
      })
    },
    handleChange(record) {
      putFundraisingRemarkStatus(record.fundraising_progress_id, record.remark_status_cn).then(() => {
        this.getServicePage(
          this.pagination.current,
          this.status,
          this.search,
          this.timeDate.startDate,
          this.timeDate.endDate
        )
      })
    },
    changeScreen(e) {
      if (e === 0) {
        if (this.screen.isPendingHandle === 1) {
          this.screen.isPendingHandle = 0
        } else {
          this.screen.isPendingHandle = 1
        }
      } else if (e === 1) {
        if (this.screen.isCollect === 1) {
          this.screen.isCollect = 0
        } else {
          this.screen.isCollect = 1
        }
      } else {
        if (this.screen.isGiveUp === 1) {
          this.screen.isGiveUp = 0
        } else {
          this.screen.isGiveUp = 1
        }
      }
      this.getServicePage(1, this.status, this.search, this.timeDate.startDate, this.timeDate.endDate)
    },
    rowClassName(record) {
      if (record.remark_status === 1) {
        // 待跟进
        return 'table-back1'
      } else if (record.remark_status === 2) {
        // 收藏
        return 'table-back2'
      } else if (record.remark_status === 3) {
        // 放弃
        return 'table-back3'
      } else {
        // 默认
        return ''
      }
    },
  },
}
</script>
 <style scoped lang="less">
/deep/.table-back1 {
  background-color: #f6fcff;
}
/deep/.table-back2 {
  background-color: #fff9f6;
}
/deep/.table-back3 {
  background-color: #fef2f2;
}
</style>
