<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div>
        <span class="focus-text">订单数量：{{ pagination.total }}</span>
        <a-select :default-value="-1" class="top-select" v-model="type">
          <a-select-option v-for="type in typeList" :value="type.value" :key="type.label">
            {{ type.label }}
          </a-select-option>
        </a-select>
        <a-select :default-value="0" class="top-select" v-model="chooseType">
          <a-select-option v-for="type in types" :value="type.value" :key="type.label">
            {{ type.label }}
          </a-select-option>
        </a-select>

        <a-input
          allow-clear
          placeholder="搜索用户名/手机号"
          v-model="search"
          @keyup.enter="getSearchPage"
          style="width: 180px; margin: 0 5px"
        />
        <a-button type="primary" @click="getSearchPage"> 搜索 </a-button>
      </div>
      <div @click="changePay" style="cursor: pointer; margin: 0 5px">
        <img
          v-show="is_paid === 0"
          :src="require('@/assets/lawyer/xzfalse_icon_sel@2x.png')"
          style="width: 14px; height: 14px"
        />
        <img
          v-show="is_paid === 1"
          :src="require('@/assets/lawyer/xztrue_icon_sel@2x.png')"
          style="width: 14px; height: 14px"
        />
        <span>是否支付</span>
      </div>
      <div>
        <a-range-picker
          @change="onDateChange"
          :placeholder="rangePlaceholder"
          style="width: 200px"
          :default-value="[startDate, endDate]"
        />
      </div>
    </a-layout-header>

    <!-- 内容区 -->
    <a-card class="content">
      <a-table
        :data-source="data"
        bordered
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => String(record.order_no)"
      >
        <!-- 发布人 -->
        <a-table-column key="user" title="发布人">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.user.nickname"
              :avatar="record.user.avatar"
              :mobile="record.user.mobile"
              :user-id="String(record.user.user_id)"
              size="sm"
              @open="openUser(String(record.user.user_id), 'user')"
            />
          </template>
        </a-table-column>

        <!-- 当前律师 -->
        <a-table-column key="lawyer" title="当前律师">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.lawyer.nickname"
              :avatar="record.lawyer.avatar"
              :mobile="record.lawyer.mobile"
              :user-id="String(record.lawyer.user_id)"
              size="sm"
              @open="openUser(String(record.lawyer.user_id), 'lawyer')"
            />
          </template>
        </a-table-column>
        
        <!-- 订单号 -->
        <a-table-column key="order_no" title="订单号">
          <template slot-scope="record">
            <span>{{ record.order_no }}</span>
            | <a @click="copyOrderNo(record)">复制</a>
            <br />
            {{ record.created_at }}
          </template>
        </a-table-column>

        <!-- 接通状态 -->
        <a-table-column data-index="free_call_status" title="接通状态" align="center">
        </a-table-column>

        <!-- 文字备注 -->
        <a-table-column key="remark" title="文字备注" align="center">
          <template slot-scope="record">
            <TextWithRowButton :text="record.remark" :overMax="10" />
            <a v-if="record.remark" @click="remarkModal.orderNo = record.order_no; remarkModal.remark = record.remark; remarkModal.isShowRemarkModal = true;">修改备注</a>
            <a v-else @click="remarkModal.orderNo = record.order_no; remarkModal.isShowRemarkModal = true;">添加备注</a>
          </template>
        </a-table-column>
        
        <!-- 订单类型 -->
        <a-table-column key="is_charge" title="订单类型">
          <template slot-scope="record">
            {{ record.type_chinese }}
          </template>
        </a-table-column>
        
        <!-- 退款状态 -->
        <a-table-column key="service_times" title="退款状态">
          <template slot-scope="record">
            {{ record.refund_status_chinese }}
          </template>
        </a-table-column>

        <!-- 订单状态 -->
        <a-table-column key="status" title="订单状态">
          <template slot-scope="record">
            {{ record.status_chinese }}
          </template>
        </a-table-column>

        <!-- 费用 -->
        <a-table-column key="created_at" data-index="price" title="费用(元)" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="text, record">
            <a-button
              type="primary"
              style="margin-right: 16px"
              size="small"
              @click="openEvaluate(record)"
              v-show="record.status > 30"
            >
              评价详情
            </a-button>
            <a-button
              style="margin-right: 16px; margin-top: 5px"
              size="small"
              type="primary"
              @click="gotodetail(record)"
            >
              查看详情
            </a-button>
            <a-button
              v-show="false"
              style="margin-right: 16px; margin-top: 5px"
              size="small"
              type="primary"
              @click="gotodetail(record)"
            >
              详情
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

    <!-- 文字备注 modal -->
    <a-modal
      v-model="remarkModal.isShowRemarkModal"
      :width="500"
      :afterClose="() => { remarkModal.remark = ''; remarkModal.orderNo = 0; }"
      title="文字备注"
      destroyOnClose
      @ok="onRemarkModalOkEvt"
    >
      <div class="remark-modal">
        <div class="modal-body">
          <a-textarea v-model="remarkModal.remark" placeholder="请输入备注信息" :auto-size="{ minRows: 4 }" />
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import { getOrderPage } from '@/api/order'
import * as orderApi from '@/api/order'
import UserCell from '@/components/User/UserCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import OrderEvaluateDialog from '@/components/Order/OrderEvaluateDialog'
import TextWithRowButton from '@/components/Common/TextWithRowButton'

// 跟进记录 modal info
const REMARK_MODAL_INFO = {
  isShowRemarkModal: false, // 是否显示
  remark: '', // 备注内容
  orderNo: 0, // 订单号
}

export default {
  name: 'OrderList',
  components: { UserVipCell, OrderEvaluateDialog, UserDetailDialog, SingleAudioPlayer, UserCell, TextWithRowButton },
  data() {
    return {
      data: [], // 数据列表
      search: '', // 搜索关键字
      startDate: '', // 日期筛选开始日期
      endDate: '', // 日期筛选截止日期
      currentPlayRecord: '',
      currentUserId: 0,
      currentLawyerId: 0,
      currentOrder: {},
      dialogType: '',
      type: -1,
      is_paid: 0,
      state: {
        loading: false,
        recordVisible: false,
        userDialog: false,
        lawyerDialog: false,
        evaluateDialog: false,
        modalLodaing: false,
      },
      // 分页器信息
      pagination: {
        total: 0, // 数据总数
        current: 1, // 当前页数
        pageSize: 10, // 每页条数
        showQuickJumper: true, // 是否可以快速跳转至某页
        // 页码改变的回调
        onChange: (page) => {
          this.getOrderPage(page, this.search)
          this.pagination.current = page
        },
      },
      types: [
        {
          label: '全部订单',
          value: 0,
        },
        {
          label: '待接单',
          value: 13,
        },
        {
          label: '待完成',
          value: 20,
        },
        {
          label: '待交付',
          value: 23,
        },
        {
          label: '已交付',
          value: 24,
        },
        {
          label: '待确认',
          value: 25,
        },
        {
          label: '待评价',
          value: 30,
        },
        {
          label: '订单完成',
          value: 40,
        },
        {
          label: '取消订单',
          value: 90,
        },
      ],
      chooseType: 0,
      typeList: [
        {
          label: '全部类型',
          value: -1,
        },
        {
          label: '案件分析',
          value: 7,
        },
        {
          label: '合同文书',
          value: 8,
        },
        {
          label: '诉讼委托',
          value: 9,
        },
        {
          label: '见面咨询',
          value: 10,
        },
      ],
      rangePlaceholder: ['开始日期', '结束日期'],
      remarkModal: { ...REMARK_MODAL_INFO }, // 文字备注 modal 
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
      condition.is_paid = this.is_paid
      return condition
    },
  },
  created() {
    if (JSON.parse(sessionStorage.getItem('orderListCondition'))) {
      const condition = JSON.parse(sessionStorage.getItem('orderListCondition'))
      this.search = condition.search
      this.startDate = condition.startDate
      this.endDate = condition.endDate
      this.chooseType = condition.chooseType
      this.type = condition.type
      this.pagination.current = condition.page
      this.is_paid = condition.is_paid
      window.sessionStorage.removeItem('orderListCondition')
      this.getOrderPage(condition.page, this.search)
    } else {
      this.getOrderPage(1, '')
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
      sessionStorage.setItem('orderListCondition', JSON.stringify(this.conditionData))
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
      this.getOrderPage(1, this.search)
    },
    /**
     * 获取订单数据列表
     */
    getOrderPage(page, search) {
      this.state.loading = true
      getOrderPage(page, this.type, this.chooseType, search, this.startDate, this.endDate, this.is_paid)
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
      this.startDate = dateString[0]
      this.endDate = dateString[1]
    },
    /**
     * 复制号码
     */
    copyOrderNo(record) {
      var input = document.getElementById('input')
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
      const orderId = String(data.order_no)
      const orderPage = [0, data.order_refund_id]
      sessionStorage.setItem('orderListCondition', JSON.stringify(this.conditionData))
      sessionStorage.setItem('orderPage', JSON.stringify(orderPage))
      this.$router.push({ name: 'OrderDetail', params: { orderId } })
    },
    changePay() {
      if (this.is_paid === 0) {
        this.is_paid = 1
      } else {
        this.is_paid = 0
      }
      this.getOrderPage(1, this.search)
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
    /**
     * 确定备注 ok 事件
     */
    async onRemarkModalOkEvt() {
      const { remarkModal } = this
      console.log(remarkModal)

      const param = {
        order_no: remarkModal.orderNo,
        remark: remarkModal.remark.trim(),
      }

      try {
        const { data } = await orderApi.updateOrderRemarkApi(param)
        this.remarkModal.isShowRemarkModal = false
        this.getOrderPage(this.pagination.current, this.search)
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    }
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
