<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">待审核数量：{{ pagination.total }}</span>
      <Cascader :options="typeList" placeholder="案件类型" @change="chooseCaseType" style="width: 160px; margin: 5px" />
      <Cascader :options="types" placeholder="需求类型" @change="chooseNeedType" style="width: 160px; margin: 5px" />
      <a-input
        allow-clear
        placeholder="搜索用户名/手机号"
        v-model="search"
        @keyup.enter="getSearchPage"
        style="margin: 0 5px; width: 180px"
      />
      <a-button type="primary" @click="getSearchPage" style="margin: 5px"> 搜索 </a-button>
      <a-range-picker
        @change="onDateChange"
        :placeholder="rangePlaceholder"
        style="width: 200px; margin: 5px"
        :default-value="[startDate, endDate]"
      />
    </a-layout-header>

    <a-card class="content">
      <a-table
        :data-source="data"
        bordered
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => String(record.demand_id)"
      >
        <a-table-column key="user" title="发布人">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.user.nickname"
              :avatar="record.user.avatar"
              :mobile="record.user.mobile"
              :user-id="String(record.user.user_id)"
              :size="userSize"
              @open="openUser(String(record.user.user_id), 'user')"
            />
          </template>
        </a-table-column>
        <a-table-column key="lawyer_tag" title="案件类型">
          <template slot-scope="record">
            {{ record.lawyer_tag }}
          </template>
        </a-table-column>
        <a-table-column key="demand_type" title="需求类型">
          <template slot-scope="record">
            <span>{{ record.demand_type }}</span>
          </template>
        </a-table-column>
        <a-table-column key="content" title="案件经过">
          <template slot-scope="record">
            <text-with-row-button :text="record.content" :over-max="38" />
          </template>
        </a-table-column>

        <a-table-column key="created_at" title="发起时间">
          <template slot-scope="record"> {{ record.created_at }}|{{ record.address }} </template>
        </a-table-column>
        <a-table-column key="expected_money" title="期望金额">
          <template slot-scope="record">
            {{ record.expected_money }}
          </template>
        </a-table-column>
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="text, record">
            <a-button type="primary" style="margin-right: 16px" size="small" @click="gotodetail(record)">
              {{ record.check_status === 0 ? '审核' : '详情' }}
            </a-button>
            <a-popconfirm @confirm="deleteData(record)" v-show="record.check_status === 0">
              <a-input allow-clear slot="title" placeholder="请输入驳回理由" v-model="deleteContent" />
              <a-button
                style="
                  margin-right: 16px;
                  margin-top: 5px;
                  border-color: #ff9700;
                  background-color: #ff9700;
                  color: #ffffff;
                "
                size="small"
              >
                驳回
              </a-button>
            </a-popconfirm>
            <a-button
              v-show="record.check_status === 1"
              style="margin-right: 16px; margin-top: 5px; border-color: #ff9700; color: #ff9700"
              size="small"
            >
              已审核
            </a-button>
            <a-button
              v-show="record.check_status === 2"
              style="margin-right: 16px; margin-top: 5px; border-color: #ff9700; color: #ff9700"
              size="small"
            >
              已驳回
            </a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
    <input id="input" style="opacity: 0; position: absolute" />
    <a-drawer
      title="录音播放"
      placement="right"
      :closable="false"
      :visible="state.recordVisible"
      @close="state.recordVisible = false"
      width="400"
    >
      <single-audio-player :src="currentPlayRecord" />
    </a-drawer>

    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" :mode="dialogType" @close="state.userDialog = false" />
    </q-dialog>
    <q-dialog v-model="state.evaluateDialog">
      <order-evaluate-dialog
        :nickname="currentOrder.nickname"
        :evaluate="currentOrder.evaluate"
        :evaluate-score="currentOrder.evaluate_score"
        :evaluate-reasons="currentOrder.order_evaluate_reasons"
      />
    </q-dialog>
    <a-modal
      v-model="state.modalLodaing"
      title="退款确认"
      @ok="state.modalLodaing = false"
      ok-text="确认"
      cancel-text="取消"
    >
    </a-modal>
  </a-layout>
</template>

<script>
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import { getOrderDemandCheckPage, getOrderDemandTypes, postOrderDemandCheck } from '@/api/order'
import { getFundraisingQuestionTags } from '@/api/fundraising'
import UserCell from '@/components/User/UserCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import OrderEvaluateDialog from '@/components/Order/OrderEvaluateDialog'
import { Cascader } from 'ant-design-vue'
export default {
  name: 'OrderList',
  components: {
    TextWithRowButton,
    Cascader,
    UserVipCell,
    OrderEvaluateDialog,
    UserDetailDialog,
    SingleAudioPlayer,
    UserCell,
  },
  data() {
    return {
      deleteContent: '',
      lawyerTagId: 0,
      demandTypeId: 0,
      userSize: 'sm',
      data: [],
      search: '',
      startDate: '',
      endDate: '',
      currentPlayRecord: '',
      currentUserId: 0,
      currentLawyerId: 0,
      currentOrder: {},
      dialogType: '',
      type: -1,
      state: {
        loading: false,
        recordVisible: false,
        userDialog: false,
        lawyerDialog: false,
        evaluateDialog: false,
        modalLodaing: false,
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getOrderDemandCheckPage(page, this.search)
          this.pagination.current = page
        },
      },
      types: [],
      chooseType: 0,
      typeList: [],
      rangePlaceholder: ['开始日期', '结束日期'],
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition.search = this.search
      condition.startDate = this.startDate
      condition.endDate = this.endDate
      condition.chooseType = this.chooseType
      condition.type = this.type
      condition.page = this.pagination.current
      return condition
    },
  },
  created() {
    if (JSON.parse(sessionStorage.getItem('demandOrderBossCondition'))) {
      const condition = JSON.parse(sessionStorage.getItem('demandOrderBossCondition'))
      this.search = condition.search
      this.startDate = condition.startDate
      this.endDate = condition.endDate
      this.chooseType = condition.chooseType
      this.type = condition.type
      this.pagination.current = condition.page
      window.sessionStorage.removeItem('demandOrderBossCondition')
      this.getOrderDemandCheckPage(condition.page, this.search)
    } else {
      this.getOrderDemandCheckPage(1, '')
    }
    this.getOrderDemandTypes()
    this.getFundraisingQuestionTags()
  },
  mounted() {
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    beforeunloadFn(e) {
      sessionStorage.setItem('demandOrderBossCondition', JSON.stringify(this.conditionData))
    },
    getOrderDemandTypes() {
      getOrderDemandTypes().then((data) => {
        const typelist = JSON.stringify(data.data)
        this.types = JSON.parse(typelist.replace(/demand_type_id/g, 'value').replace(/demand_type/g, 'label'))
      })
    },
    getFundraisingQuestionTags() {
      getFundraisingQuestionTags().then((data) => {
        const typelist = JSON.stringify(data.data)
        this.typeList = JSON.parse(
          typelist
            .replace(/lawyer_tag_id/g, 'value')
            .replace(/lawyer_tag_group/g, 'label')
            .replace(/lawyer_tags/g, 'children')
            .replace(/lawyer_tag/g, 'label')
        )
        for (let i = 0; i < this.typeList.length; i++) {
          this.typeList[i].value = i + 1
        }
      })
    },
    chooseNeedType(value) {
      if (value[1]) {
        this.demandTypeId = value[1]
      } else {
        this.demandTypeId = value[0]
      }
    },
    chooseCaseType(value) {
      this.lawyerTagId = value[1]
    },
    deleteData(record) {
      postOrderDemandCheck(record.demand_id, 1, this.deleteContent).then(() => {
        this.getOrderDemandCheckPage(this.pagination.current, this.search)
      })
    },
    openEvaluate(order) {
      this.state.evaluateDialog = true
      this.currentOrder = order
    },
    openUser(userId, type) {
      this.state.userDialog = true
      this.currentUserId = userId
      if (type === 'user') {
        this.dialogType = 'user'
      } else {
        this.dialogType = 'lawyer'
      }
    },
    openLawyer(lawyerUserId) {
      this.state.lawyerDialog = true
      this.currentLawyerId = lawyerUserId
    },
    openRecord(recordUrl) {
      this.state.recordVisible = true
    },
    getSearchPage() {
      this.getOrderDemandCheckPage(1, this.search)
    },
    getOrderDemandCheckPage(page, search) {
      this.state.loading = true
      getOrderDemandCheckPage(page, this.lawyerTagId, this.demandTypeId, search, this.startDate, this.endDate)
        .then(({ data }) => {
          this.pagination.total = data.total
          this.pagination.current = page
          this.data = data.data
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    onDateChange(date, dateString) {
      ;[this.startDate, this.endDate] = dateString
    },
    copyOrderNo(record) {
      // var span = document.getElementById(record.order_no).innerText
      var input = document.getElementById('input')
      // input.value = span // 修改文本框的内容
      input.value = record.order_no
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success('已复制！')
      } else {
        this.$message.error('复制失败！')
      }
    },
    gotodetail(data) {
      const demandId = String(data.demand_id)
      sessionStorage.setItem('demandOrderBossCondition', JSON.stringify(this.conditionData))
      this.$router.push({ name: 'DemandDetailBoss', params: { demandId } })
    },
    handleChange(value) {
      this.currentPlayRecord = value
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    height: 90px;
    align-items: center;
    justify-content: space-between;

    &-select {
      margin-right: 20px;
      width: 120px;
    }

    input {
      width: 170px;
      margin-right: 20px;
    }

    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }

  .content {
    margin-top: 16px;
  }
}
</style>
