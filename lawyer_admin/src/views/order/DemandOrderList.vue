<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">需求订单：{{ pagination.total }}</span>
      <!-- 案件类型 -->
      <Cascader :options="typeList" placeholder="案件类型" @change="chooseCaseType" style="width: 160px; margin: 5px" />
      <!-- 需求类型 -->
      <Cascader :options="types" placeholder="需求类型" @change="chooseNeedType" style="width: 160px; margin: 5px" />
      
      <a-input
        placeholder="搜索用户名/手机号"
        v-model="search"
        @keyup.enter="getSearchPage"
        style="margin: 0 5px; width: 180px"
        allow-clear
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
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => String(record.demand_id)"
        bordered
      >
        <!-- 发布人 -->
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

        <!-- 案件类型 -->
        <a-table-column key="lawyer_tag" title="案件类型">
          <template slot-scope="record">
            {{ record.lawyer_tag }}
          </template>
        </a-table-column>

        <!-- 需求类型 -->
        <a-table-column key="demand_type" title="需求类型">
          <template slot-scope="record">
            <span>{{ record.demand_type }}</span>
          </template>
        </a-table-column>

        <!-- 竞标律师人数 -->
        <a-table-column key="lawyer_number" title="竞标律师人数">
          <template slot-scope="record">
            <span>{{ record.lawyer_number }}</span>
          </template>
        </a-table-column>

        <!-- 竞标状态 -->
        <a-table-column key="status_chinese" title="竞标状态">
          <template slot-scope="record">
            <span>{{ record.status_chinese }}</span>
          </template>
        </a-table-column>

        <!-- 期望金额 -->
        <a-table-column key="expected_money" title="期望金额">
          <template slot-scope="record">
            {{ record.expected_money }}
          </template>
        </a-table-column>

        <!-- 案件经过 -->
        <a-table-column key="content" title="案件经过">
          <template slot-scope="record">
            <text-with-row-button :text="record.content" :over-max="20" />
          </template>
        </a-table-column>

        <!-- 发起时间 -->
        <a-table-column key="created_at" title="发起时间">
          <template slot-scope="record">
            {{ record.created_at }}{{ record.created_at && record.address ? '|' : '' }}{{ record.address }}
          </template>
        </a-table-column>
        
        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="text, record">
            <a-button type="primary" style="margin: 5px" size="small" @click="goToDetail(record)"> 详情 </a-button>

            <a-popconfirm @confirm="deleteOrder(record)" ok-text="确定" cancel-text="取消">
              <p slot="icon"></p>
              <div slot="title">
                <a-input placeholder="请输入删除理由" v-model="deleteReason" />
                <div class="del-dispose-wrap">
                  <div v-for="(dItem, dIndex) in deleteDisposeList" :key="dIndex" style="display: flex; justify-content: flex-start; align-items: center; font-size: 14px; font-weight: 500; height: 20px; border-radius: 6px; padding: 0 4px; margin-top: 4px; cursor: pointer;" @click="activeDeleteDisposeIndex = dIndex">
                    <img v-if="activeDeleteDisposeIndex === dIndex" style="width: 18px; height: 18px; margin-right: 6px;" src="@/assets/sellPlatform/icon-checkbox.png" />
                    <img v-else style="width: 18px; height: 18px; margin-right: 6px;" src="@/assets/sellPlatform/icon-no-checkbox.png" />
                    <span>{{ dItem.name }}</span>
                  </div>
                </div>
              </div>
              <a-button style="margin: 5px" type="danger" size="small">删除</a-button>
            </a-popconfirm>

            <a-popconfirm title="请确认是否修改为已交付状态?" @confirm="updateDemandOrderStatus(record)" ok-text="确定" cancel-text="取消">
              <!-- <a-button type="danger" size="small" @click="updateDemandOrderStatus(record)">修改状态</a-button> -->
              <a-button type="danger" size="small" >修改状态</a-button>
            </a-popconfirm>
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
      <user-detail-dialog :user-id="String(currentUserId)" :mode="dialogType" @close="state.userDialog = false" />
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
import { getOrderDemandPage, getOrderDemandTypes, delOrderDemand, updateDemandOrderStatusApi } from '@/api/order'
import { getFundraisingQuestionTags } from '@/api/fundraising'
import UserCell from '@/components/User/UserCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import OrderEvaluateDialog from '@/components/Order/OrderEvaluateDialog'
import { Cascader } from 'ant-design-vue' // 级联选择框

export default {
  name: 'DemandOrderList',
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
      deleteReason: '', // 删除理由
      deleteDisposeList: [
        { type: 1, name: '恢复次数' },
        { type: 2, name: '恢复收益' },
        { type: 3, name: '恢复次数且恢复收益' },
        { type: 0, name: '次数和收益都不恢复' },
      ], // 删除处理项列表
      activeDeleteDisposeIndex: -1, // 激活的删除处理项下标

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
          this.getOrderDemandPage(page, this.search)
          this.pagination.current = page
        },
      },
      chooseType: 0, 
      typeList: [], // 案件类型列表
      types: [], // 需求类型列表
      rangePlaceholder: ['开始日期', '结束日期'],

      demandOrderStatusList: [], // 需求订单所有状态列表
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
    if (JSON.parse(sessionStorage.getItem('demandOrderCondition'))) {
      const condition = JSON.parse(sessionStorage.getItem('demandOrderCondition'))
      this.search = condition.search
      this.startDate = condition.startDate
      this.endDate = condition.endDate
      this.chooseType = condition.chooseType
      this.type = condition.type
      this.pagination.current = condition.page
      window.sessionStorage.removeItem('demandOrderCondition')
      this.getOrderDemandPage(condition.page, this.search)
    } else {
      this.getOrderDemandPage(1, '')
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
      sessionStorage.setItem('demandOrderCondition', JSON.stringify(this.conditionData))
    },
    /**
     * 获取需求类型列表
     */
    getOrderDemandTypes() {
      getOrderDemandTypes().then((data) => {
        const typelist = JSON.stringify(data.data)
        this.types = JSON.parse(typelist.replace(/demand_type_id/g, 'value').replace(/demand_type/g, 'label'))
      })
    },
    /**
     * 获取案件类型列表
     */
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
      this.getOrderDemandPage(1, this.search)
    },
    /**
     * 获取订单列表
     */
    getOrderDemandPage(page, search) {
      this.state.loading = true
      getOrderDemandPage(page, this.lawyerTagId, this.demandTypeId, search, this.startDate, this.endDate)
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
    goToDetail(data) {
      const demandId = String(data.demand_id)
      const orderPage = [0, data.order_refund_id]
      sessionStorage.setItem('demandOrderCondition', JSON.stringify(this.conditionData))
      sessionStorage.setItem('orderPage', JSON.stringify(orderPage))
      this.$router.push({ name: 'DemandDetail', params: { demandId } })
    },
    /**
     * 删除订单
     */
    deleteOrder(record) {
      console.log(record)
      const { activeDeleteDisposeIndex, deleteDisposeList } = this
      let type = 0
      activeDeleteDisposeIndex >= 0 && (type = deleteDisposeList[activeDeleteDisposeIndex].type)

      delOrderDemand(record.demand_id, this.deleteReason, type).then(() => {
        this.$message.success('删除成功')
        this.deleteReason = ''
        this.activeDeleteDisposeIndex = -1
        this.getOrderDemandPage(this.pagination.current, '')
      })
    },
    /**
     * 修改需求订单状态 (目前先修改为已交付)
     */
    async updateDemandOrderStatus(record) {
      const demandId = record.demand_id
      if (!demandId) return
      const order_status = 24 // 订单流程状态 已交付
      const demand_status = 40 // 需求订单状态 已结束

      try {
        const { data } =  await updateDemandOrderStatusApi(demandId, order_status, demand_status)
        this.$message.success('更新成功')
        // 刷新当页数据
        this.getOrderDemandPage(this.pagination.current, '')
      } catch (error) {
        console.log(error)
      }

    },
    handleChange(value) {
      this.currentPlayRecord = value
    },
    orderStatusText(status) {
      switch (status) {
        case 13:
          return '待接单'
        case 20:
          return '待发货 '
        case 23:
          return '律师待确认 '
        case 24:
          return ' 用户待确认 '
        case 25:
          return '等待双方确认'
        case 30:
          return '待评价'
        case 40:
          return '订单完成'
        case 90:
          return '订单取消'
        default:
          return '未知'
      }
    },
    orderStatusClass(status) {
      switch (status) {
        case 13:
          return {
            color: '#FF524C',
          }
        case 20:
          return {
            color: '#FF524C',
          }
        case 30:
          return {
            color: '#2CBF78',
          }
        case 40:
          return {
            color: '#787E8D',
          }
        default:
          return {
            color: '#FF524C',
          }
      }
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
      margin-right: 10px;
      width: 150px;
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
