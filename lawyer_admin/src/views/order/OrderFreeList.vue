<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div>
        <span class="focus-text">咨询数量：{{ pagination.total }}</span>
        <a-input
          allow-clear
          placeholder="搜索用户名/手机号"
          v-model="search"
          @keyup.enter="getSearchPage"
          style="width: 180px; margin: 0 5px"
        />
        <a-button type="primary" @click="getSearchPage">搜索</a-button>
      </div>

      <div>
        <a-range-picker @change="onDateChange" :placeholder="rangePlaceholder" :default-value="[startDate, endDate]" style="width: 300px" />
      </div>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="getOrderPage(pagination.current)">刷新</a-button>
      </div>

      <a-table
        :data-source="tableDataList"
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="(record) => record.order_no"
        :scroll="{ x: 1800 }"
        bordered
      >
        <!-- 发布人 -->
        <a-table-column key="user" title="发布人" align="center">
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
        <!-- 当前律师 -->
        <a-table-column key="lawyer" title="当前律师" align="center">
          <template slot-scope="record">
            <user-vip-cell
              :nickname="record.lawyer.nickname"
              :avatar="record.lawyer.avatar"
              :mobile="record.lawyer.mobile"
              :user-id="String(record.lawyer.user_id)"
              :size="userSize"
              @open="openLawyer(String(record.lawyer.user_id), 'lawyer')"
            />
          </template>
        </a-table-column>
        <!-- 订单号 -->
        <a-table-column key="order_no" title="订单号" align="center">
          <template slot-scope="record">
            <span>{{ record.order_no }}</span>
            | <a @click="copyOrderNo(record)">复制</a>
            <br />
            {{ record.created_at }}
          </template>
        </a-table-column>
        <!-- 评价 -->
        <a-table-column key="lawyers" title="评价" align="center">
          <template slot-scope="record">
            <div style="display: flex; flex-direction: column; align-items: center">
              <span v-show="record.evaluate_score === 0 || record.evaluate_score === null">未评价</span>
              <img
                v-show="record.evaluate_score === 1"
                :src="require('@/assets/Order/my_icon_sel@2x.png')"
                style="width: 22px; height: 22px"
              />
              <span style="color: #ffa577" v-show="record.evaluate_score === 1"> 满意 </span>
              <img
                v-show="record.evaluate_score === 2"
                :src="require('@/assets/Order/yb_icon_sel@2x.png')"
                style="width: 22px; height: 22px"
              />
              <span style="color: #ff7864" v-show="record.evaluate_score === 2"> 一般 </span>
              <img
                v-show="record.evaluate_score === 3"
                :src="require('@/assets/Order/bmy_icon_sel@2x.png')"
                style="width: 22px; height: 22px"
              />
              <span style="color: #9db4dd" v-show="record.evaluate_score === 3"> 不满意 </span>
            </div>
          </template>
        </a-table-column>
        <!-- 服务次数 -->
        <a-table-column key="service_times" title="服务次数" align="center">
          <template slot-scope="record">
            <span> {{ record.service_times }}次 </span>
          </template>
        </a-table-column>
        <!-- 订单状态 -->
        <a-table-column key="status" align="center">
          <div slot="title">
            <div>订单状态</div>
            <a-select :default-value="0" class="top-select" v-model="chooseType" @change="getSearchPage">
              <a-select-option v-for="type in types" :value="type.value" :key="type.label">
                {{ type.label }}
              </a-select-option>
            </a-select>
          </div>
          <template slot-scope="record">
            {{ record.free_call_status }}
          </template>
        </a-table-column>
        <!-- 录音 -->
        <a-table-column align="center" title="录音">
          <template slot-scope="record">
            <a-select style="width: 100px;" v-model="tableDataList[record.index].activeRecord">
              <a-select-option v-for="sItem in record.records" :value="sItem.record_path" :key="sItem.record_path">
                {{ sItem.duration }}秒
              </a-select-option>
            </a-select>
            <a-button type="link" :loading="record.voiceTranslateLoading" style="padding: 0; margin: 0 5px;" @click="translateVoice(record)">翻译</a-button>
            <a-button type="link" style="padding: 0;" @click="playVoice(record)">播放</a-button>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="210px">
          <template slot-scope="text, record">
            <a-button type="primary" style="margin-right: 16px" size="small" @click="openEvaluate(record)" v-show="record.status > 30">评价详情</a-button>
            <a-button style="margin-right: 16px; margin-top: 5px" size="small" type="primary" @click="gotodetail(record)" >查看详情</a-button>
            <a-button v-show="false" style="margin-right: 16px; margin-top: 5px" size="small" type="primary" @click="gotodetail(record)" > 详情 </a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <input id="input" style="opacity: 0; position: absolute" />

    <!-- 语音翻译 modal -->
    <voice-translate-modal ref="voiceTranslateModalRef" />
    <!-- audio hidden -->
    <audio ref="audioRef" controls="controls" src="" id="audio" hidden />
    
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
      <user-detail-dialog :user-id="String(currentUserId)" @close="state.userDialog = false" />
    </q-dialog>

    <q-dialog v-model="state.lawyerDialog">
      <user-detail-dialog :user-id="String(currentLawyerId)" mode="lawyer" @close="state.lawyerDialog = false" />
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
import { getOrderPage } from '@/api/order'
import UserCell from '@/components/User/UserCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import OrderEvaluateDialog from '@/components/Order/OrderEvaluateDialog'
import voiceTranslateModal from '@/components/voice-translate-modal/voice-translate-modal'

export default {
  name: 'OrderFreeList',
  components: { UserVipCell, OrderEvaluateDialog, UserDetailDialog, SingleAudioPlayer, UserCell, voiceTranslateModal },
  data() {
    return {
      userSize: 'sm',
      tableDataList: [],
      search: '',
      startDate: '',
      endDate: '',
      currentPlayRecord: '',
      currentUserId: 0,
      currentLawyerId: 0,
      currentOrder: {},
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
        pageSize: 10,
        showQuickJumper: true,
        onChange: (page) => {
          this.getOrderPage(page, this.search)
          this.pagination.current = page
        },
      },
      types: [
        {
          label: '全部状态',
          value: 0,
        },
        {
          label: '通话成功',
          value: 40,
        },

        {
          label: '未满时间',
          value: 41,
        },
        {
          label: '未接通',
          value: 91,
        },
      ],
      chooseType: 0,
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
      condition.page = this.pagination.current
      return condition
    },
  },
  created() {
    if (JSON.parse(sessionStorage.getItem('orderFreeCondition'))) {
      const condition = JSON.parse(sessionStorage.getItem('orderFreeCondition'))
      this.search = condition.search
      this.startDate = condition.startDate
      this.endDate = condition.endDate
      this.chooseType = condition.chooseType
      this.pagination.current = condition.page
      window.sessionStorage.removeItem('orderFreeCondition')
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
      sessionStorage.setItem('orderFreeCondition', JSON.stringify(this.conditionData))
    },
    openEvaluate(order) {
      this.state.evaluateDialog = true
      this.currentOrder = order
    },
    openUser(userId) {
      this.state.userDialog = true
      this.currentUserId = userId
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
     * 获取电话咨询订单
     */
    getOrderPage(page, search) {
      this.state.loading = true
      
      getOrderPage(page, 0, this.chooseType, search, this.startDate, this.endDate)
        .then(({ data: phoneOrderData }) => {
          const phoneOrderItems = phoneOrderData.data.map((item, index) => {
            item.index = index
            item.activeRecord = ''
            item.voiceTranslateLoading = false
            return item
          })
          this.tableDataList = phoneOrderItems
          this.pagination.total = phoneOrderData.total
          this.pagination.current = page
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    onDateChange(date, dateString) {
      ;[this.startDate, this.endDate] = dateString
    },
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
      const orderPage = [2, data.order_refund_id]
      sessionStorage.setItem('orderFreeCondition', JSON.stringify(this.conditionData))
      sessionStorage.setItem('orderPage', JSON.stringify(orderPage))
      this.$router.push({ name: 'OrderDetail', params: { orderId } })
    },
    handleChange(value) {
      this.currentPlayRecord = value
      console.log(this.currentPlayRecord)
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
     * 翻译语音
     */
    async translateVoice(record) {
      const voiceUrl = record.activeRecord
      if (!voiceUrl) return this.$message.warning('请先选择录音文件')
      this.tableDataList[record.index].voiceTranslateLoading = true
      await this.$refs.voiceTranslateModalRef.translateVoiceFile(voiceUrl)
      this.tableDataList[record.index].voiceTranslateLoading = false
    },

    /**
     * 播放语音
     */
    playVoice(record) {
      const voiceUrl = record.activeRecord
      if (!voiceUrl) return this.$message.warning('请先选择录音文件')

      this.$refs.audioRef.src = voiceUrl
      this.$refs.audioRef.load()
      this.$refs.audioRef.play()
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

  .top-select {
    width: 100px;
  }
  .content {
    margin-top: 16px;
    .tool-wrap {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 13px;
    }
  }
}
</style>
