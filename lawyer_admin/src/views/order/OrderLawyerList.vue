<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <a-card>
          <div>
            <label class="focus-text">
              <b> {{ activeKey !== '1' ? '已处理数量' : '待处理数量' }}:{{ pagination.total }}</b>
            </label>
            <a-select v-model="orderType" style="width: 200px; margin: 0 10px">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="0">电话咨询</a-select-option>
              <a-select-option :value="8">合同文书</a-select-option>
              <a-select-option :value="9">诉讼委托</a-select-option>
              <a-select-option :value="10">线下见面</a-select-option>
              <a-select-option :value="11">需求订单</a-select-option>
            </a-select>

            <a-input allow-clear placeholder="搜索用户名/手机号" v-model="search" @keyup.enter="getSearchPage" style="width: 180px; margin: 0 5px" />
            <a-button type="primary" @click="getOrderEvaluateComplaintPage(1)">搜索</a-button>
          </div>
        </a-card>
      </a-col>
      
      <a-col :span="24">
        <a-card>
          <div style="display: flex;">
            <a-button icon="sync" size="small" style="margin-left: auto;" @click="(pagination.current)">刷新</a-button>
          </div>
      
          <a-tabs v-model="activeKey" @change="getOrderEvaluateComplaintPage(1)">
            <a-tab-pane key="1" tab="待处理">
              <a-table
                :data-source="lawyerOrders"
                :pagination="pagination"
                :loading="state.loading"
                :rowKey="(record) => String(record.order_evaluate_complaint_id)"
                :scroll="{ x: 2000 }"
                bordered
              >
                <!-- 律师 -->
                <a-table-column key="lawyer" title="律师" align="center">
                  <template slot-scope="record">
                    <user-vip-cell
                      :nickname="record.lawyer.nickname"
                      :avatar="record.lawyer.avatar"
                      :mobile="record.lawyer.mobile"
                      :vip-icon="record.lawyer.vip_icon"
                      :user-id="String(record.lawyer.user_id)"
                      @open="openUser(String(record.lawyer.user_id), 'lawyer')"
                    />
                  </template>
                </a-table-column>
                <!-- 用户 -->
                <a-table-column key="user" title="用户" align="center">
                  <template slot-scope="record">
                    <user-vip-cell
                      :nickname="record.user.nickname"
                      :avatar="record.user.avatar"
                      :mobile="record.user.mobile"
                      :vip-icon="record.user.vip_icon"
                      :user-id="String(record.user.user_id)"
                      @open="openUser(String(record.user.user_id), 'user')"
                    />
                  </template>
                </a-table-column>

                <!-- 订单时间 -->
                <a-table-column key="created_at" data-index="created_at" title="订单时间" align="center" />
                <!-- 订单类型 -->
                <a-table-column key="order_type_chinese" title="订单类型" align="center">
                  <template slot-scope="record">
                    <div>{{ record.type_chinese }}</div>
                  </template>
                </a-table-column>

                <!-- 评价 -->
                <a-table-column key="service_time" title="评价" :width="100" align="center">
                  <template slot-scope="record">
                    <span v-show="record.evaluate_score === 0">未评价</span>
                    <img
                      v-show="record.evaluate_score === 1"
                      :src="require('@/assets/Order/my_icon_sel@2x.png')"
                      style="width: 22px; height: 22px"
                    />
                    <br v-show="record.evaluate_score === 1" />
                    <span style="color: #ffa577" v-show="record.evaluate_score === 1"> 满意 </span>

                    <img
                      v-show="record.evaluate_score === 2"
                      :src="require('@/assets/Order/yb_icon_sel@2x.png')"
                      style="width: 22px; height: 22px"
                    />
                    <br v-show="record.evaluate_score === 2" />
                    <span style="color: #ff7864" v-show="record.evaluate_score === 2"> 一般 </span>
                    <img
                      v-show="record.evaluate_score === 3"
                      :src="require('@/assets/Order/bmy_icon_sel@2x.png')"
                      style="width: 22px; height: 22px"
                    />
                    <br v-show="record.evaluate_score === 3" />
                    <span style="color: #9db4dd" v-show="record.evaluate_score === 3"> 不满意 </span>
                  </template>
                </a-table-column>

                <!-- 录音 -->
                <a-table-column key="records" title="录音" :width="180" align="center">
                  <template slot-scope="record">
                    <a-select style="width: 110px" placeholder="选择录音" @change="handleChange">
                      <a-select-option v-for="i in record.records" :key="i.record_path" :value="i.record_path">
                        {{ i.duration }}
                      </a-select-option>
                    </a-select>
                    <a @click="openRecord">播放</a>
                  </template>
                </a-table-column>

                <!-- 订单状态 -->
                <a-table-column key="status_chinese" title="订单状态" :width="100" align="center">
                  <template slot-scope="record">
                    <span v-if="record.status_chinese === '已完成'" style="color: #787e8d">{{
                      record.status_chinese
                    }}</span>
                    <span v-if="record.status_chinese === '未接单'" style="color: #ff524c">{{
                      record.status_chinese
                    }}</span>
                    <span v-if="record.status_chinese === '未完成'" style="color: #ff9700">{{
                      record.status_chinese
                    }}</span>
                    <span v-if="record.status_chinese === '待评价'" style="color: #2cbf78">{{
                      record.status_chinese
                    }}</span>
                  </template>
                </a-table-column>

                <!-- 费用(元) -->
                <a-table-column key="money" title="费用(元)" :width="120" align="center">
                  <template slot-scope="record">
                    <div>￥{{ record.money }}</div>
                  </template>
                </a-table-column>

                <!-- 律师申诉理由 -->
                <a-table-column key="reason" title="律师申诉理由(旧)" align="center">
                  <template slot-scope="record">
                    <div>{{ record.reason }}</div>
                  </template>
                </a-table-column>

                <!-- 律师对客服理由 -->
                <a-table-column key="reason" title="申诉理由(对客服)" align="center">
                  <template slot-scope="record">
                    <div>{{ record.to_customer_cotent }}</div>
                  </template>
                </a-table-column>

                <!-- 律师对用户理由 -->
                <a-table-column key="reason" title="申诉理由(对用户)" align="center">
                  <template slot-scope="record">
                    <div>{{ record.to_user_content }}</div>
                  </template>
                </a-table-column>

                <!-- 用户回复 -->
                <a-table-column key="reason" title="用户回复" align="center">
                  <template slot-scope="record">
                    <div>{{ record.user_reply_content }}</div>
                  </template>
                </a-table-column>

                <!-- 操作 -->
                <a-table-column key="action" title="操作" align="center" fixed="right" :width="160">
                  <template slot-scope="record">
                    <!-- <template v-if="record.is_show_button">
                      <a-button type="primary" style="margin: 5px 0; width: 100%" @click="openWindow(record, 0)">仅回复</a-button>
                      <a-button type="danger" style="margin: 5px 0; width: 100%" @click="openWindow(record, 1)">删除并回复</a-button>
                      <a-button type="danger" style="background-color: #f1c40f; border-color: #f1c40f; margin: 5px 0; width: 100%" @click="openWindow(record, 2)">驳回</a-button>
                    </template> -->
                    <a-button type="primary" style="margin: 5px 0; width: 100%" @click="openWindow(record, 0)">仅回复</a-button>
                    <a-button type="danger" style="margin: 5px 0; width: 100%" @click="openWindow(record, 1)">删除并回复</a-button>
                    <a-button type="danger" style="background-color: #f1c40f; border-color: #f1c40f; margin: 5px 0; width: 100%" @click="openWindow(record, 2)">驳回</a-button>
                  </template>
                </a-table-column>
              </a-table>
            </a-tab-pane>

            <a-tab-pane key="2" tab="已处理" force-render>
              <a-table
                :data-source="lawyerOrders"
                bordered
                :pagination="pagination"
                :loading="state.loading"
                :rowKey="(record) => String(record.order_evaluate_complaint_id)"
                :scroll="{ x: 2000 }"
              >
                <!-- 律师 -->
                <a-table-column key="lawyer" title="律师" align="center">
                  <template slot-scope="record">
                    <user-vip-cell
                      :nickname="record.lawyer.nickname"
                      :avatar="record.lawyer.avatar"
                      :mobile="record.lawyer.mobile"
                      :vip-icon="record.lawyer.vip_icon"
                      :user-id="String(record.lawyer.user_id)"
                      @open="openUser(String(record.lawyer.user_id), 'lawyer')"
                    />
                  </template>
                </a-table-column>
                <!-- 用户 -->
                <a-table-column key="user" title="用户" align="center">
                  <template slot-scope="record">
                    <user-vip-cell
                      :nickname="record.user.nickname"
                      :avatar="record.user.avatar"
                      :mobile="record.user.mobile"
                      :vip-icon="record.user.vip_icon"
                      :user-id="String(record.user.user_id)"
                      @open="openUser(String(record.user.user_id), 'user')"
                    />
                  </template>
                </a-table-column>

                <!-- 订单时间 -->
                <a-table-column key="created_at" data-index="created_at" title="订单时间" align="center" />
                <!-- 订单类型 -->
                <a-table-column key="order_type_chinese" title="订单类型" align="center">
                  <template slot-scope="record">
                    <div>{{ record.type_chinese }}</div>
                  </template>
                </a-table-column>
                <!-- 评价 -->
                <a-table-column key="service_time" title="评价" :width="100" align="center">
                  <template slot-scope="record">
                    <span v-show="record.evaluate_score === 0">未评价</span>
                    <img
                      v-show="record.evaluate_score === 1"
                      :src="require('@/assets/Order/my_icon_sel@2x.png')"
                      style="width: 22px; height: 22px"
                    />
                    <br v-show="record.evaluate_score === 1" />
                    <span style="color: #ffa577" v-show="record.evaluate_score === 1"> 满意 </span>

                    <img
                      v-show="record.evaluate_score === 2"
                      :src="require('@/assets/Order/yb_icon_sel@2x.png')"
                      style="width: 22px; height: 22px"
                    />
                    <br v-show="record.evaluate_score === 2" />
                    <span style="color: #ff7864" v-show="record.evaluate_score === 2"> 一般 </span>
                    <img
                      v-show="record.evaluate_score === 3"
                      :src="require('@/assets/Order/bmy_icon_sel@2x.png')"
                      style="width: 22px; height: 22px"
                    />
                    <br v-show="record.evaluate_score === 3" />
                    <span style="color: #9db4dd" v-show="record.evaluate_score === 3"> 不满意 </span>
                  </template>
                </a-table-column>
                <!-- 录音 -->
                <a-table-column key="records" title="录音" :width="180" align="center">
                  <template slot-scope="record">
                    <a-select style="width: 110px" placeholder="选择录音" @change="handleChange">
                      <a-select-option v-for="i in record.records" :key="i.record_path" :value="i.record_path">
                        {{ i.duration }}
                      </a-select-option>
                    </a-select>
                    <a @click="openRecord">播放</a>
                  </template>
                </a-table-column>

                <!-- 订单状态 -->
                <a-table-column key="status_chinese" title="订单状态" :width="100" align="center">
                  <template slot-scope="record">
                    <span v-if="record.status_chinese === '已完成'" style="color: #787e8d">{{
                      record.status_chinese
                    }}</span>
                    <span v-if="record.status_chinese === '未接单'" style="color: #ff524c">{{
                      record.status_chinese
                    }}</span>
                    <span v-if="record.status_chinese === '未完成'" style="color: #ff9700">{{
                      record.status_chinese
                    }}</span>
                    <span v-if="record.status_chinese === '待评价'" style="color: #2cbf78">{{
                      record.status_chinese
                    }}</span>
                  </template>
                </a-table-column>

                <!-- 费用(元) -->
                <a-table-column key="money" title="费用(元)" :width="120" align="center">
                  <template slot-scope="record">
                    <div>￥{{ record.money }}</div>
                  </template>
                </a-table-column>

                <!-- 律师申诉理由 -->
                <a-table-column key="reason" title="律师申诉理由(旧)" align="center">
                  <template slot-scope="record">
                    <div>{{ record.reason }}</div>
                  </template>
                </a-table-column>

                <!-- 律师对客服理由 -->
                <a-table-column key="reason" title="申诉理由(对客服)" align="center">
                  <template slot-scope="record">
                    <div>{{ record.to_customer_cotent }}</div>
                  </template>
                </a-table-column>

                <!-- 律师对用户理由 -->
                <a-table-column key="reason" title="申诉理由(对用户)" align="center">
                  <template slot-scope="record">
                    <div>{{ record.to_user_content }}</div>
                  </template>
                </a-table-column>

                <!-- 用户回复律师内容 -->
                <a-table-column key="reason" title="用户回复" align="center">
                  <template slot-scope="record">
                    <div>{{ record.user_reply_content }}</div>
                  </template>
                </a-table-column>

                <!-- 操作 -->
                <a-table-column key="action" title="操作" align="center" fixed="right" :width="160">
                  <template slot-scope="record">
                    <!-- <template v-if="record.is_show_button">
                      <a-button type="primary" style="margin: 5px 0; width: 100%" @click="openWindow(record, 0)">仅回复</a-button>
                      <a-button type="danger" style="margin: 5px 0; width: 100%" @click="openWindow(record, 1)">删除并回复</a-button>
                      <a-button type="danger" style="background-color: #f1c40f; border-color: #f1c40f; margin: 5px 0; width: 100%" @click="openWindow(record, 2)">驳回</a-button>
                    </template> -->
                    <a-button type="primary" style="margin: 5px 0; width: 100%" @click="openWindow(record, 0)">仅回复</a-button>
                    <a-button type="danger" style="margin: 5px 0; width: 100%" @click="openWindow(record, 1)">删除并回复</a-button>
                    <a-button type="danger" style="background-color: #f1c40f; border-color: #f1c40f; margin: 5px 0; width: 100%" @click="openWindow(record, 2)">驳回</a-button>
                  </template>
                </a-table-column>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>

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
      <user-detail-dialog :user-id="currentUserId" :mode="typeUser" @close="state.userDialog = false" />
    </q-dialog>

    <q-dialog v-model="state.listWindowLoading">
      <common-dialog :title="listWindow.title" @close="state.listWindowLoading = false">
        <a-textarea
          class="textarea"
          :placeholder="listWindow.type === 2 ? '请输入驳回理由' : '请输入对TA的回复(选填)'"
          v-model="listWindow.reply"
          style="width：100%; min-height:200px"
        >
        </a-textarea>
        <div class="center" style="margin: 5px 0" v-if="listWindow.type === 2">
          <q-btn style="width: 120px; margin: 0 10px" @click="rejectRequest(0)"> 客服发送 </q-btn>
          <q-btn color="primary" style="width: 120px; margin: 0 10px" @click="rejectRequest(1)"> 消息系统发送 </q-btn>
        </div>
        <div class="center" style="margin: 5px 0" v-else>
          <q-btn style="width: 120px; margin: 0 10px" @click="giveUser(0)"> 客服发送 </q-btn>
          <q-btn color="primary" style="width: 120px; margin: 0 10px" @click="giveUser(1)"> 消息系统发送 </q-btn>
        </div>
      </common-dialog>
    </q-dialog>
  </div>
</template>

<script>
import UserVipCell from '@/components/User/UserVipCell'
import { getOrderEvaluateComplaintPage, putOrderEvaluateComplaintReply, putOrderEvaluateComplaintRevokeReply, putOrderEvaluateComplaintRevokeDelete, putOrderEvaluateComplaintReject, } from '@/api/order'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import CommonDialog from '@/components/Dialog/CommonDialog'

export default {
  name: 'OrederLawyerIndex',
  components: { SingleAudioPlayer, UserVipCell, UserDetailDialog, CommonDialog },
  data() {
    return {
      state: {
        loading: false,
        recordVisible: false,
        userDialog: false,
        listWindowLoading: false,
      },
      listWindow: {
        title: '',
        reply: '',
        type: 0,
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        onChange: (page) => {
          this.pagination.current = page
          this.getOrderEvaluateComplaintPage(page)
        },
      },
      activeKey: '1',
      orderType: -1,
      search: '',
      currentPlayRecord: '',
      lawyerOrders: [],
      currentUserId: 0,
      typeUser: '',
    }
  },
  created() {
    const condition = JSON.parse(sessionStorage.getItem('lawyerOrderCondition'))
    if (condition) {
      this.pagination.current = condition.current
      this.search = condition.search
      this.orderType = condition['orderType']
      this.activeKey = condition['activeKey']
      sessionStorage.clear()
      this.getOrderEvaluateComplaintPage(condition.current)
    } else {
      this.getOrderEvaluateComplaintPage(1)
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['search'] = this.search
      condition['orderType'] = this.orderType
      condition['activeKey'] = this.activeKey
      return condition
    },
  },
  mounted() {
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    beforeunloadFn(e) {
      sessionStorage.setItem('lawyerOrderCondition', JSON.stringify(this.conditionData))
    },

    getOrderEvaluateComplaintPage(page) {
      this.state.loading = true
      getOrderEvaluateComplaintPage(page, Number(this.activeKey), this.orderType, this.search)
        .then(({ data }) => {
          this.lawyerOrders = data.data
          this.pagination.current = page
          this.pagination.total = data.total
          if (Number(this.activeKey) === 1) {
            const OrderEvaluateComplaint = data.total
            this.$store.commit('OrderEvaluateComplaint', { OrderEvaluateComplaint })
          }
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    openRecord() {
      this.state.recordVisible = true
    },
    handleChange(value) {
      this.currentPlayRecord = value
    },
    openUser(userId, type) {
      this.state.userDialog = true
      this.currentUserId = userId
      this.typeUser = type
    },
    openWindow(record, type) {
      this.state.listWindowLoading = true
      this.listWindow.type = type
      if (type === 0) {
        this.listWindow.title = '回复'
      } else if (type === 1) {
        this.listWindow.title = '删除并回复'
      } else {
        this.listWindow.title = '驳回'
      }
      this.listWindow.reply = ''
      this.orderEvaluateComplaintId = record.order_evaluate_complaint_id
    },
    giveUser(type) {
      putOrderEvaluateComplaintReply(this.orderEvaluateComplaintId, this.listWindow.type, type, this.listWindow.reply)
        .then(() => {
          this.state.listWindowLoading = false
          this.$message.success('回复成功')
          this.getOrderEvaluateComplaintPage(this.pagination.current)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    rejectRequest(type) {
      putOrderEvaluateComplaintReject(this.orderEvaluateComplaintId, type, this.listWindow.reply)
        .then(() => {
          this.state.listWindowLoading = false
          this.$message.success('驳回成功')
          this.getOrderEvaluateComplaintPage(this.pagination.current)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    putOrderEvaluateComplaintRevokeReply(record) {
      putOrderEvaluateComplaintRevokeReply(record.order_evaluate_complaint_id).then(() => {
        this.$message.success('撤销成功')
        this.getOrderEvaluateComplaintPage(this.pagination.current)
      })
    },
    putOrderEvaluateComplaintRevokeDelete(record) {
      putOrderEvaluateComplaintRevokeDelete(record.order_evaluate_complaint_id).then(() => {
        this.$message.success('撤销成功')
        this.getOrderEvaluateComplaintPage(this.pagination.current)
      })
    },
  },
}
</script>

<style scoped>
.focus-text {
  margin-right: 28px;
  font-size: 20px;
  font-weight: 800;
  line-height: 28px;
  color: #222222;
}
</style>
