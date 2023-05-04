<template>
  <div class="InterviewList">
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <a-card>
          <a-row>
            <a-col :span="4">
              <h5>
                <b> 案件数量:{{ pagination.total }}</b>
              </h5>
            </a-col>
            <a-col :span="5"> </a-col>
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
            <a-col :span="5">
              <a-button type="primary" style="float: right" @click="buildInterview"> 创建线下约谈</a-button>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-table :data-source="tableData" bordered :pagination="pagination" :loading="state.loading">
            <a-table-column key="user" title="发起人">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.nickname"
                  :avatar="record.avatar"
                  :mobile="record.mobile"
                  :vip-icon="record.vip_icon"
                  :user-id="record.user_id"
                  :is-bot="record.is_bot"
                  @open="openUser"
                />
              </template>
            </a-table-column>
            <a-table-column key="title" width="250px" title="当事人">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.nickname"
                  :avatar="record.avatar"
                  :mobile="record.mobile"
                  :vip-icon="record.vip_icon"
                  :user-id="record.user_id"
                  :is-bot="record.is_bot"
                  @open="openUser"
                />
              </template>
            </a-table-column>
            <a-table-column key="view_number" align="center" data-index="view_number" title="负责客服" />
            <a-table-column key="like_number" title="委托律师">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.nickname"
                  :avatar="record.avatar"
                  :mobile="record.mobile"
                  :vip-icon="record.vip_icon"
                  :user-id="record.user_id"
                  :is-bot="record.is_bot"
                  @open="openUser"
                />
              </template>
            </a-table-column>
            <a-table-column key="comment_number" data-index="comment_number" align="center" title="约见地点" />
            <a-table-column key="timed_status" data-index="timed_status" align="center" title="约见时间" />
            <a-table-column key="action" title="操作">
              <template slot-scope="text, record">
                <a-button
                  type="primary"
                  :title="record"
                  style="color: #2cbf78; background-color: #ffffff; border-color: #2cbf78"
                >
                  提醒
                </a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" @close="state.userDialog = false" />
    </q-dialog>
    <a-modal
      ok-text="确认"
      cancel-text="取消"
      title="创建新的线下约谈"
      v-model="state.buildLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      width="720px"
    >
      <a-card bordered>
        <a-card-grid
          style="
            width: 100%;
            text-align: center;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          "
          :hoverable="false"
        >
          <img style="background-color: greenyellow; width: 50px; height: 50px" />
          <span>发起人：</span>
          <label style="margin-right: 10px">{{ UserName0 }}</label>
          <!-- 根据号码自动填写姓名 -->
          <span>手机号码：</span>
          <a-input
            placeholder="请输入发起人的手机号"
            style="width: 160px"
            v-model="usernumber0"
            @pressEnter="getNickname(0)"
          >
          </a-input>
        </a-card-grid>
        <a-card-grid
          style="
            width: 100%;
            text-align: center;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          "
          :hoverable="false"
        >
          <img style="background-color: greenyellow; width: 50px; height: 50px" />
          <span>当事人：</span>
          <label style="margin-right: 10px">{{ UserName1 }}</label>
          <span>手机号码：</span>
          <a-input
            placeholder="请输入当事人的时间号"
            style="width: 160px"
            v-model="usernumber1"
            @pressEnter="getNickname(1)"
          ></a-input>
        </a-card-grid>
        <a-card-grid
          style="
            width: 100%;
            text-align: center;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          "
          :hoverable="false"
        >
          <img style="background-color: greenyellow; width: 50px; height: 50px" />
          <span>委托律师：</span>
          <label style="margin-right: 10px">{{ UserName2 }}</label>
          <span>手机号码：</span>
          <a-input
            placeholder="请输入委托律师的手机号"
            style="width: 160px"
            v-model="usernumber2"
            @pressEnter="getNickname(2)"
          >
          </a-input>
        </a-card-grid>
        <a-card-grid style="width: 100%" :hoverable="false">
          <label>约见地点</label>
          <div
            style="
              width: 100%;
              text-align: center;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              margin: 10px 0;
            "
          >
            省份：
            <a-select
              :default-value="provinceData[0]"
              style="width: 120px  margin:0 10px ;"
              @change="handleProvinceChange"
            >
              <a-select-option v-for="province in provinceData" :key="province">
                {{ province }}
              </a-select-option>
            </a-select>
            城市：
            <a-select v-model="secondCity" style="width: 120px  margin:0 10px ;">
              <a-select-option v-for="city in cities" :key="city">
                {{ city }}
              </a-select-option>
            </a-select>
            时间：
            <a-date-picker show-time placeholder="Select Time" @change="onChange" @ok="onOk" />
          </div>
          <a-textarea rows="4"></a-textarea>
        </a-card-grid>
      </a-card>
    </a-modal>
  </div>
</template>
  <script>
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import { getFundraisingUserNumber } from '@/api/fundraising'
import moment from 'moment'
import 'moment/locale/zh-cn'
const provinceData = ['浙江', '江苏']
const cityData = {
  浙江: ['杭州', '宁波', '温州'],
  江苏: ['南京', '苏州', '镇江'],
}
export default {
  name: 'Index',
  components: {
    UserVipCell,
    UserDetailDialog,
  },
  props: {},
  data() {
    return {
      search: '',
      usernumber0: '',
      usernumber1: '',
      usernumber2: '',
      UserName0: '默认名字',
      UserName1: '默认名字',
      UserName2: '默认名字',
      provinceData,
      cityData,
      cities: cityData[provinceData[0]],
      secondCity: cityData[provinceData[0]][0],
      dateFormat: 'YYYY-MM-DD',
      state: {
        loading: false,
        userDialog: false,
        buildLoading: false,
      },
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
          this.getQuestionPage(page, this.search)
          this.pagination.current = page
        },
      },
      tableData: [
        {
          user_id: 16990,
          mobile: '15279473859',
          nickname: 'bxls_152794pSn',
          vip_type: '未开通',
          active_at: '2021-03-23 17:39',
          location_address: '浙江省温州市',
          register_at: '2021-03-23 17:39',
          register_address: '浙江省温州市',
          status: 0,
          is_muted: 0,
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.geData()
  },
  mounted() {},
  methods: {
    geData() {
      this.state.loading = false
    },
    onChange(value, dateString) {
      // console.log('Selected Time: ', value)
      // console.log('Formatted Selected Time: ', dateString)
    },

    handleProvinceChange(value) {
      this.cities = cityData[value]
      this.secondCity = cityData[value][0]
    },
    openUser(userId) {
      this.state.userDialog = true
      this.currentUserId = userId
    },
    handleOk(e) {
      // console.log('好的')
      this.state.buildLoading = false
    },
    handleCancel(e) {
      // console.log('不行')
      this.state.buildLoading = false
    },
    onSearch() {
      // console.log(this.search)
      //  this.state.loading = true
      //  this.getServicePage(1, this.status, this.search, this.timeDate.startDate, this.timeDate.endDate)
    },
    moment,
    onData(value, dateString) {
      // console.log(value, dateString)
      this.timeDate.startDate = dateString[0]
      this.timeDate.endDate = dateString[1]
      //   this.getServicePage(1, this.status, this.search, this.timeDate.startDate, this.timeDate.endDate)
    },
    onOk(value) {
      // console.log('onOk: ', value)
    },
    buildInterview() {
      // console.log('发起了筹款')
      this.state.buildLoading = true
    },
    getNickname(value) {
      if (value === 0) {
        getFundraisingUserNumber(this.usernumber0).then((data) => {
          this.UserName0 = data.nickname
        })
      } else if (value === 1) {
        getFundraisingUserNumber(this.usernumber1).then((data) => {
          this.UserName1 = data.nickname
        })
      } else {
        getFundraisingUserNumber(this.usernumber2).then((data) => {
          this.UserName2 = data.nickname
        })
      }
    },
  },
}
</script>
 <style scoped>
</style>
