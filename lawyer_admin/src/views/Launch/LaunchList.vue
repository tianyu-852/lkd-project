<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card>
          <a-row>
            <a-col :span="4">
              <h5 style="margin: 0">
                <b> 投放数量:{{ pagination.total }}</b>
              </h5>
            </a-col>
            <a-col :span="10"> </a-col>
            <a-col :span="5">
              <a-input-search placeholder="手机号/订单号" style="width: 200px" v-model="search" @search="onSearch" />
            </a-col>
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
            :rowKey="(record) => record.advertisement_id"
          >
            <a-table-column key="user" title="律师信息">
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
            <a-table-column key="status" title="投放状态">
              <template slot-scope="record">
                <a-select style="width: 80px" v-model="record.status" @change="putAdvertisementStatus(record)">
                  <a-select-option :value="0">开启中</a-select-option>
                  <a-select-option :value="1">已关闭</a-select-option>
                  <a-select-option :value="2">已禁止</a-select-option>
                </a-select>
              </template>
            </a-table-column>
            <a-table-column key="total_exposure_number" title="剩余展示/总展示(次)">
              <template slot-scope="record">
                <div>{{ record.remain_exposure_number }} /{{ record.total_exposure_number }}</div>
              </template>
            </a-table-column>
            <a-table-column key="remain_exposure_number" align="center" title="曝光数">
              <template slot-scope="record">
                <div>
                  {{ record.total_exposure_number - record.remain_exposure_number }}
                </div>
              </template>
            </a-table-column>
            <a-table-column key="click_number" data-index="click_number" align="center" title="点击数" />
            <a-table-column
              key="call_phone_user_number"
              data-index="call_phone_user_number"
              align="center"
              title="咨询数"
            />
            <a-table-column key="created_at" data-index="created_at" align="center" title="开始时间" />
            <a-table-column key="title" title="展示位置">
              <template slot-scope="record">
                <span @click="openDetail(record, 0)" style="cursor: pointer">
                  {{ record.advertisement_positions[0].title }}、{{ record.advertisement_positions[1].title }}……
                  <a-icon type="form" />
                </span>
              </template>
            </a-table-column>
            <a-table-column key="title341" title="广告样式">
              <template slot-scope="record">
                <a-popover placement="left">
                  <template #content>
                    <img :src="record.banner" style="height: 200px; width: 400px; object-fit: contain" />
                  </template>
                  <span style="cursor: pointer">查看图片 <a-icon type="picture" /></span>
                  <!-- <a-icon type="form" @click="openDetail(record, 1) /> -->
                </a-popover>
              </template>
            </a-table-column>
            <a-table-column key="action" title="操作">
              <template slot-scope="text, record">
                <a-button @click="gotoDetail(record)">查看详情</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <a-modal v-model="state.modalStyle" title="广告样式编辑">
      <a-table
        :data-source="advertisementData"
        bordered
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => record.fundraising_id"
      >
        <a-table-column key="user" title="类型">
          <template slot-scope="record">
            {{ record }}
          </template>
        </a-table-column>
        <a-table-column key="image" title="图片">
          <template slot-scope="record">
            {{ record }}
          </template>
        </a-table-column>
        <a-table-column key="time" title="上传时间">
          <template slot-scope="record">
            {{ record }}
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作">
          <template slot-scope="record">
            <a-button type="primary" @click="openDetail(record, 2)">编辑图片</a-button>
            <a-button type="danger" @click="openDetail(record, 2)">删除</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-modal>
    <a-modal v-model="state.modalPosition" title="编辑位置" @ok="adPositionChange">
      <div class="bannerAd">
        <div class="bannerAd-title">
          <img :src="require('@/assets/common/ring-blue-28.png')" />
          <span> BANNER广告</span>
          <a-divider />
        </div>
        <a-checkbox-group v-model="bannerList" style="display: flex; flex-direction: column; align-items: flex-start">
          <a-checkbox style="display: none"> </a-checkbox>
          <a-checkbox :value="1"> 首页头部 </a-checkbox>
          <a-checkbox :value="2"> 社区列表 </a-checkbox>
          <a-checkbox :value="3"> 找律师 </a-checkbox>
          <a-checkbox :value="4"> 我的 </a-checkbox>
          <a-checkbox :value="11"> 社区关注列表 </a-checkbox>
        </a-checkbox-group>
      </div>
      <a-divider />
      <div class="suspensionAd">
        <div class="suspensionAd-title">
          <img :src="require('@/assets/common/ring-red.png')" />
          <span> 悬浮窗广告</span>
          <a-divider />
        </div>
        <a-checkbox-group
          v-model="suspensionList"
          style="display: flex; flex-direction: column; align-items: flex-start"
        >
          <a-checkbox style="display: none"> </a-checkbox>
          <a-checkbox :value="5"> 社区列表 </a-checkbox>
          <a-checkbox :value="6"> 帖子详情 </a-checkbox>
          <a-checkbox :value="7"> 发布问答 </a-checkbox>
          <a-checkbox :value="8"> 30秒社区 </a-checkbox>
        </a-checkbox-group>
      </div>
      <a-divider />
      <div class="lawyerAd">
        <div class="lawyerAd-title">
          <img :src="require('@/assets/common/ring-yellow.png')" />
          <span> 律师广告</span>
          <a-divider />
        </div>
        <a-checkbox-group v-model="lawyerAdList" style="display: flex; flex-direction: column; align-items: flex-start">
          <a-checkbox style="display: none"> </a-checkbox>
          <a-checkbox :value="9"> 找律师 </a-checkbox>
          <a-checkbox :value="10"> 消息列表 </a-checkbox>
        </a-checkbox-group>
      </div>
    </a-modal>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="String(currentUserId)" :mode="userType" @close="state.userDialog = false" />
    </q-dialog>
  </div>
</template>
  <script>
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import { getAdvertisementPage, putAdvertisementStatus, putAdvertisementPositions } from '@/api/launch'
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
      advertisementData: [],
      userType: '',
      search: '',
      select: -1,
      modalDetailvalue: 0,
      dateFormat: 'YYYY-MM-DD',
      state: { loading: true, userDialog: false, modalStyle: false, modalPosition: false },
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
      chooseData: {},
      bannerList: [],
      suspensionList: [],
      lawyerAdList: [],
    }
  },
  computed: {},
  watch: {
    chooseData() {
      this.bannerList = []
      this.suspensionList = []
      this.lawyerAdList = []
      console.log(this.chooseData)
      const allList = this.chooseData.advertisement_positions
      for (let i = 0; i < allList.length; i++) {
        if (allList[i].advertisement_position_id < 4) {
          this.bannerList.push(allList[i].advertisement_position_id)
        } else if (allList[i].advertisement_position_id > 4 && allList[i].advertisement_position_id < 9) {
          this.suspensionList.push(allList[i].advertisement_position_id)
        } else {
          this.lawyerAdList.push(allList[i].advertisement_position_id)
        }
      }
    },
  },
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
      getAdvertisementPage(page, this.search, this.timeDate.startDate, this.timeDate.endDate)
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
    putAdvertisementStatus(record) {
      putAdvertisementStatus(record.advertisement_id, record.status).then(() => {
        this.$message.success('修改成功')
      })
    },
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
    openDetail(record, key) {
      if (key === 0) {
        this.state.modalPosition = true
      } else if (key === 1) {
        this.state.modalStyle = true
      }
      this.chooseData = record
    },

    gotoDetail(record) {
      const advertisementId = record.advertisement_id
      this.$router.push({ name: 'LaunchDetail', params: { advertisementId } })
    },
    adPositionChange() {
      const advertisementPositionIds = []
      advertisementPositionIds.push.apply(advertisementPositionIds, this.bannerList)
      advertisementPositionIds.push.apply(advertisementPositionIds, this.suspensionList)
      advertisementPositionIds.push.apply(advertisementPositionIds, this.lawyerAdList)
      putAdvertisementPositions(this.chooseData.advertisement_id, JSON.stringify(advertisementPositionIds)).then(() => {
        this.$message.success('修改展示位置成功')
        this.getData(1)
      })
      this.state.modalPosition = false
    },
  },
}
</script>
 <style scoped lang="less">
.bannerAd,
.suspensionAd,
.lawyerAd {
  padding: 0 32px;
  &-title {
    img {
      width: 14px;
      height: 14px;
    }
  }
}
</style>
