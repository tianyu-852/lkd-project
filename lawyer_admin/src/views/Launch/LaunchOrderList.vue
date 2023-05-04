<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card>
          <a-row>
            <a-col :span="6">
              <h5 style="margin: 0">
                <b> 投放订单数量:{{ pagination.total }}</b>
              </h5>
            </a-col>
            <a-col :span="10" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
              <div style="width: 450px; margin-bottom: 5px" v-for="(i, key) in list" :key="key">
                <a-select style="width: 100px" v-model="i.type">
                  <a-select-option :value="0">律师姓名</a-select-option>
                  <a-select-option :value="1">订单号</a-select-option>
                  <a-select-option :value="2">付款金额</a-select-option>
                  <a-select-option :value="3">付款状态</a-select-option>
                </a-select>
                <a-select style="width: 200px" v-model="i.value" v-show="i.type === 3" @change="logList">
                  <a-select-option :value="10">未付款</a-select-option>
                  <a-select-option :value="40">已付款</a-select-option>
                  <a-select-option :value="90">订单取消</a-select-option>
                </a-select>
                <a-input-search v-show="i.type !== 3" style="width: 200px" v-model="i.value" @search="logList" />
                <span @click="addSearchList" style="color: #2cbf78; cursor: pointer; margin: 0 10px" v-if="key === 0">
                  <img
                    :src="require('@/assets/common/icon_add_green.png')"
                    style="height: 16px; width: 16px; margin: 0 3px 3px 0"
                  />
                  添加筛选条件
                </span>
                <a-button v-show="key !== 0" type="danger" style="margin: 0 10px" @click="delSearchList(key)">
                  删除筛选
                </a-button>
              </div>
            </a-col>
            <a-col :span="3" style="height: 37px; display: flex; align-items: center; flex-direction: row"> </a-col>
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
            :rowKey="(record) => record.order_no"
          >
            <a-table-column key="user" align="center" title="律师信息">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.user.nickname"
                  :avatar="record.user.avatar"
                  :mobile="record.user.mobile"
                  :user-id="String(record.user.user_id)"
                  size="sm"
                  @open="openUser(String(record.user.user_id), 'lawyer')"
                />
              </template>
            </a-table-column>
            <a-table-column key="order_no" align="center" title="订单号">
              <template slot-scope="record">
                {{ record.order_no }}
              </template>
            </a-table-column>
            <a-table-column key="created_at" align="center" title="下单时间">
              <template slot-scope="record">
                {{ record.created_at }}
              </template>
            </a-table-column>
            <a-table-column key="lawyer_number" align="center" title="优惠券">
              <template slot-scope="record">
                {{
                  record.money_total === record.money_real
                    ? record.status_chinese === '已完成'
                      ? '未使用优惠券'
                      : '未付款'
                    : record.money_total - record.money_real + '元'
                }}
              </template>
            </a-table-column>
            <a-table-column key="money_real" align="center" title="实付金额/订单金额">
              <template slot-scope="record"> {{ record.money_real }}/{{ record.money_total }} </template>
            </a-table-column>
            <a-table-column key="status_chinese" align="center" title="付款状况">
              <template slot-scope="record">
                <span :style="record.status_chinese === '已完成' ? 'color:#2CBF78' : 'color:#FF524C'">
                  {{ record.status_chinese }}
                </span>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" :mode="userType" @close="state.userDialog = false" />
    </q-dialog>
  </div>
</template>
  <script>
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import { getAdvertisementOrderPage } from '@/api/launch'
import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  name: 'LaunchOrderIndex',
  components: {
    UserVipCell,
    UserDetailDialog,
    TextWithRowButton,
  },
  props: {},
  data() {
    return {
      list: [
        {
          type: 0,
          value: '',
        },
      ],
      advertisementData: [],
      userType: '',
      search: '',
      select: -1,
      dateFormat: 'YYYY-MM-DD',
      state: {
        loading: true,
        userDialog: false,
      },
      timeDate: {
        startDate: '',
        endDate: '',
      },
      modalMoney: '',
      currentUserId: 0,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
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
      let searchOrderStatus = ''
      let searchOrderNo = ''
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].type === 1) {
          searchOrderNo = this.list[i].value
        } else if (this.list[i].type === 3) {
          searchOrderStatus = this.list[i].value
        } else if (this.list[i].type === 0) {
          this.search = this.list[i].value
        }
      }
      getAdvertisementOrderPage(
        page,
        this.search,
        this.timeDate.startDate,
        this.timeDate.endDate,
        searchOrderNo,
        searchOrderStatus
      )
        .then((data) => {
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
    onSearch() {
      this.state.loading = true
      this.getData(1)
    },
    moment,
    onData(value, dateString) {
      this.timeDate.startDate = dateString[0]
      this.timeDate.endDate = dateString[1]
      this.getData(1)
    },
    addSearchList() {
      if (this.list.length < 4) {
        this.list.push({ type: '', value: '' })
      } else {
        this.$message.warning('筛选条件已达上限')
      }
    },
    delSearchList(key) {
      this.list.splice(key, 1)
    },
    logList() {
      this.getData(1)
    },
  },
}
</script>
 <style scoped lang="less">
</style>
