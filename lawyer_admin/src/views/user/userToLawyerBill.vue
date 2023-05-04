
<template>
  <a-layout class="main">
    <a-layout-header class="header-module">
      <div class="back-wrap" @click="$router.back()">
        <a-icon type="arrow-left" />
        <span class="focus-text" style="margin-left: 6px;">用户与律师消费记录：{{ tableOrderPagination.total }}</span>
      </div>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>

      <a-tabs v-model="activeTabKey">
        <a-tab-pane key="1" :tab="'订单列表 ' + '(' + tableOrderPagination.total + ')'">
          <a-table :data-source="tableOrderList" bordered :pagination="tableOrderPagination" :loading="tableOrderLoading" :rowKey="(record) => record.order_no" >
            <!-- 用户 -->
            <a-table-column title="用户">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.nickname"
                  :avatar="record.avatar"
                  :mobile="record.mobile"
                />
              </template>
            </a-table-column>

            <!-- 律师 -->
            <a-table-column title="律师">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.lawyer.nickname"
                  :avatar="record.lawyer.avatar"
                  :mobile="record.lawyer.mobile"
                />
              </template>
            </a-table-column>

            <!-- 订单时间 -->
            <a-table-column key="created_at" data-index="created_at" title="订单时间" align="center" />

            <!-- 订单类型 -->
            <a-table-column key="order_type_chinese" align="center">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>订单类型</span>
              </div>
              <template slot-scope="record">
                <div>{{ record.order_type_chinese }}</div>
              </template>
            </a-table-column>

            <!-- 评价 -->
            <a-table-column key="service_time" align="center">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>评价</span>
              </div>
              <template slot-scope="record">
                <span
                  v-show="record.evaluate_score !== 1 && record.evaluate_score !== 2 && record.evaluate_score !== 3"
                >
                  未评价
                </span>
                <img
                  v-show="[1, 2, 3].includes(record.evaluate_score)"
                  :src="
                    record.evaluate_score === 1
                      ? require('@/assets/Order/my_icon_sel@2x.png')
                      : record.evaluate_score === 2
                        ? require('@/assets/Order/yb_icon_sel@2x.png')
                        : require('@/assets/Order/bmy_icon_sel@2x.png')
                  "
                  style="width: 22px; height: 22px"
                />
                <span
                  v-show="[1, 2, 3].includes(record.evaluate_score)"
                  :style="
                    record.evaluate_score === 1
                      ? 'color: #ffa577'
                      : record.evaluate_score === 2
                        ? 'color: #ff7864'
                        : 'color: #9db4dd'
                  "
                >
                  {{ record.evaluate_score === 1 ? '满意' : record.evaluate_score === 2 ? '一般' : '不满意' }}
                </span>
              </template>
            </a-table-column>

            <!-- 录音 -->
            <a-table-column key="records" title="录音" align="center">
              <template slot-scope="record">
                <a-select style="width: 120px" placeholder="请选择录音" @change="onVoiceSelectChangeEvt">
                  <a-select-option v-for="i in record.records" :key="i.record_path" :value="i.record_path">
                    {{ i.duration }}
                  </a-select-option>
                </a-select>
                <a @click="isShowVoiceDrawer = true">播放</a>
              </template>
            </a-table-column>

            <!-- 订单状态 -->
            <a-table-column key="status" title="订单状态" align="center">
              <template slot-scope="record">
                <span v-if="record.status === '已完成' || record.status === '已完成(未满有效时间)'" style="color: #787e8d" >
                  {{ record.status }}
                  <!-- 已完成(24小时内单次通话时长未达到55秒) -->
                </span>
                <span v-else-if="record.status === '未接单'" style="color: #ff524c">{{ record.status }}</span>
                <span v-else-if="record.status === '未完成'" style="color: #ff9700">{{ record.status }}</span>
                <span v-else-if="record.status === '待评价'" style="color: #2cbf78">{{ record.status }}</span>
                <span v-else>{{ record.status }}</span>
              </template>
            </a-table-column>

            <!-- 费用(元) -->
            <a-table-column key="money_real" title="金额" align="center">
              <template slot-scope="record">
                <div>{{ record.money_real }}</div>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>
        
        <a-tab-pane key="2" :tab="'转账记录 ' + '(' + tableRecordPagination.total + ')'">
          <a-table
            :data-source="tableRecordList"
            :loading="tableRecordLoading"
            :pagination="tableRecordPagination"
            :rowKey="(record) => String(record.transfer_no)"
            bordered
          >
            <!-- 发起人 -->
            <a-table-column title="用户" align="center">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.initiator.nickname"
                  :avatar="record.initiator.avatar"
                  :mobile="record.initiator.mobile"
                  :user-id="String(record.initiator.user_id)"
                />
              </template>
            </a-table-column>

            <!-- 接收人 -->
            <a-table-column title="律师" align="center">
              <template slot-scope="record">
                <user-vip-cell
                  :nickname="record.recipient.nickname"
                  :avatar="record.recipient.avatar"
                  :mobile="record.recipient.mobile"
                  :user-id="String(record.recipient.user_id)"
                />
              </template>
            </a-table-column>

            <!-- 转账金额 -->
            <a-table-column dataIndex="money" title="转账金额" align="center" />

            <!-- 转账状态 -->
            <a-table-column dataIndex="status_text" title="转账状态" align="center" />

            <!-- 创建时间 -->
            <a-table-column dataIndex="created_at" title="创建时间" align="center" />

            <!-- 收款时间 -->
            <a-table-column title="收款时间" align="center">
              <template slot-scope="record">
                <span v-if="record.status === 1">{{ record.updated_at }}</span>
                <span v-else>无</span>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <a-drawer
      title="录音播放"
      placement="right"
      :closable="false"
      :visible="isShowVoiceDrawer"
      @close="isShowVoiceDrawer = false"
      width="400" >
      <single-audio-player :src="currentPlayRecord" />
    </a-drawer>
  </a-layout>
</template>

<script>
import moment from 'moment'
import * as pointLogApi from '@/api/pointLogApi'
import * as assetsApi from '@/api/assets'
import { getLawyerOrderPage as getLawyerOrderPageApi, } from '@/api/lawyer'
import UserVipCell from '@/components/User/UserVipCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'

export default {
  name: 'UserToLawyerBillPage',
  components: { UserVipCell, SingleAudioPlayer },
  data() {
    return {
      activeTabKey: '1',
      userId: '',
      lawyerId: '',
      
      tableOrderList: [], // 订单列表
      tableOrderLoading: false,
      tableOrderPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getUserOrderList(page)
          this.tableOrderPagination.current = page
        },
      },

      tableRecordList: [], // 转账记录列表
      tableRecordLoading: false,
      tableRecordPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getTransferAccountRecordList(page)
          this.tableRecordPagination.current = page
        },
      },

      currentPlayRecord: '',
      isShowVoiceDrawer: false,
    }
  },
  created() {
    this.userId = this.$route.query.userId
    this.lawyerId = this.$route.query.lawyerId

    this._getUserOrderList()
    this._getTransferAccountRecordList()
  },
  methods: {
    moment,

    /**
     * 获取订单列表
     */
     async _getUserOrderList(page = 1) {
       this.tableOrderLoading = true
       const param = {
         page,
         size: this.tableOrderPagination.pageSize,
         user_id: this.userId,
         lawyer_user_id: this.lawyerId,
         evaluate_score: 0,
        //  source_type: 0,
        //  type: JSON.stringify([7,8,9,10,11,18,29,30]),
        }

       try {
         const { data: clientCompanyData } = await getLawyerOrderPageApi(param)
         this.tableOrderList = clientCompanyData.data
         this.tableOrderPagination.total = clientCompanyData.total
         this.tableOrderPagination.current = page
         this.tableOrderLoading = false
       } catch (error) {
         this.tableOrderLoading = false
         console.log(error)
       }
    },

    /**
     * 获取转账记录列表
     */
     async _getTransferAccountRecordList(page = 1) {
       const param = { user_id: this.userId, lawyer_user_id: this.lawyerId, page, size: this.tableOrderPagination.pageSize }
       this.tableRecordLoading = true

       try {
         const { data: labelListData } = await assetsApi.getTransferAccountRecordList(param)
         this.tableRecordList = labelListData.data
         this.tableRecordPagination.total = labelListData.total
         this.tableRecordPagination.current = page
         this.tableRecordLoading = false
       } catch (error) {
         this.tableRecordLoading = false
         console.log(error)
       }
    },

    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      if (this.activeTabKey === '1') this._getUserOrderList(this.tableOrderPagination.current)
      if (this.activeTabKey === '2') this._getTransferAccountRecordList(this.tableRecordPagination.current)
    },

    /**
     * 监听录音 select change 事件
     */
    onVoiceSelectChangeEvt(value) {
      this.currentPlayRecord = value
    },
  }
}
</script>

<style lang="less" scoped>
.header-module {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 20px;
  .back-wrap {
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  }
}

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .selected-title {
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
