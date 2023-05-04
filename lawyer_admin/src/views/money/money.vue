<template>
  <div>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <a-card>
          <span style="font-size: 22px; font-weight: bold; margin-right: 10px;">提现审核{{ pagination.total }}</span>
          <a-range-picker style="margin-right: 10px;" @change="onData" :Format="dateFormat" :default-value="[startDate, endDate]" @onOk="{ onOk }" />

          <a-input-search placeholder="昵称搜索" style="width: 200px; margin-right: 10px;" @search="onNicknameSearch" allow-clear />

          <a-input-search placeholder="手机号搜索" style="width: 200px; margin-right: 10px;" @search="onPhoneSearch" allow-clear />
        </a-card>
      </a-col>

      <a-col :span="24">
        <a-card>
          审核类型:
          <a-select default-value="全部" style="width: 120px; margin-right: 10px;" @change="onChange1">
            <a-select-option value="-1">全部</a-select-option>
            <a-select-option value="1">已处理</a-select-option>
            <a-select-option value="0">未处理</a-select-option>
          </a-select>

          提现类型:
          <a-select style="width: 120px; margin-right: 10px;" v-model="activeWithdrawTypeValue" allowClear @change="getassetspage">
            <a-select-option v-for="sItem in withdrawTypeSelectList" :value="sItem.value" :key="sItem.value">
              {{ sItem.label }}
            </a-select-option>
          </a-select>

          到期筛选:
          <a-select style="width: 180px; margin-right: 10px;" v-model="expireTypeValue" allowClear @change="getassetspage">
            <a-select-option v-for="sItem in expireTypeSelectList" :value="sItem.value" :key="sItem.value">
              {{ sItem.label }}
            </a-select-option>
          </a-select>
        </a-card>
      </a-col>

      <a-col :span="24">
        <a-card>
          <div class="tool-wrap">
            <a-button icon="sync" size="small" style="margin-left: auto;" @click="getassetspage(pagination.current)">刷新</a-button>
          </div>
      
          <a-table
            :columns="columns"
            :data-source="assetsData"
            :pagination="pagination"
            :rowKey="(record) => record.withdraw_no"
            :loading="loading"
            bordered
          >
            <!-- 用户 -->
            <div slot="nickname" slot-scope="text, record" class="userDiv">
              <user-vip-cell :nickname="record.nickname" :avatar="record.avatar" :mobile="record.mobile" :user-id="String(record.user_id)" @open="openUser(String(record.user_id))" />
              <template v-if="record.is_have_experience">
                <a-tag v-if="moment(record.is_experience_time).isBefore(moment())" color="#F56C6C" style="margin-top: 4px; border-radius: 4px;">体验已到期</a-tag>
                <a-tag v-else color="#41b583" style="margin-top: 4px; border-radius: 4px;">体验期</a-tag>
              </template>
              <div v-if="record.is_experience_time" style="margin-top: 4px; font-size: 14px;" :style="{ color: moment(record.is_experience_time).isBefore(moment()) ? '#F56C6C' : '#41b583' }">
                <span>到期时间：{{ record.is_experience_time }}</span>
              </div>

              <template v-if="record.optimization.name">
                <a-tag v-if="moment(record.optimization.end_time).isBefore(moment())" color="#F56C6C" style="margin-top: 4px; border-radius: 4px;">{{ record.optimization.name }}-已过期</a-tag>
                <a-tag v-else color="#1790ff" style="margin-top: 4px; border-radius: 4px;">{{ record.optimization.name }}</a-tag>
                <div style="margin-top: 4px; font-size: 14px; color: #1790ff;">
                  <template v-if="!moment(record.optimization.end_time).isBefore(moment())">
                    <span>已开通天数：{{ moment().diff(moment(record.optimization.open_time), "days") + 1 }}</span><br />
                  </template>
                  <span :style="{ color: moment(record.optimization.end_time).isBefore(moment()) ? '#F56C6C' : '#1790ff' }">到期时间：{{ record.optimization.end_time }}</span>
                </div>
              </template>
            </div>

            <!-- 提现信息 -->
            <template slot="ali_pay_name" slot-scope="text, record">
              <p>姓名：{{ record.ali_pay_name }}</p>
              <p>账号：{{ record.ali_pay_account }}</p>
              <p>类型：{{ record.withdraw_type }}</p>
              <p>单号：{{ record.withdraw_no }}</p>
            </template>
            <!-- 资金流水 -->
            <template slot="withdraw_money" slot-scope="text, record">
              <p>{{ text }}</p>
              <router-link :to="{ name: 'moneyDetail', path: '/money/detail', query: { id: String(record.user_id) } }">
                资金流水
              </router-link>
            </template>

            <!-- 提现类型 -->
            <!-- <a-table-column dataIndex="form_type" title="提现类型" align="center" /> -->
            <!-- 状态 -->
            <template slot="withdraw_status" slot-scope="text, record">
              <p v-if="record.withdraw_status === 0" style="color: #ff524c">处理中</p>
              <p v-if="record.withdraw_status === 1" style="color: #787e8d">已处理</p>
              <p v-if="record.withdraw_status === 2" style="color: #787e8d">已处理</p>
              <p v-if="record.withdraw_status === 3" style="color: #787e8d">已处理</p>
            </template>
            
            <!-- 操作 -->
            <template slot="action" slot-scope="text, record">
              <template v-if="userInfo && dataRoleList.includes(userInfo.name)">
                <a-button style="margin: 0 5px" v-if="record.withdraw_status === 0 || record.withdraw_status === 3" type="primary" @click="onTransfer(record, 0)">转账</a-button>
                <a-popconfirm v-if="record.withdraw_status === 0 || record.withdraw_status === 3" title="请确定驳回申请?" @confirm="confirmRejectApply(record)">
                  <a-button style="margin: 0 5px" type="danger">驳回</a-button>
                </a-popconfirm>
                <button v-if="record.withdraw_status === 1" class="colorbtn1">转账中</button>
                <button v-if="record.withdraw_status === 2" class="colorbtn2">已转账</button>
                <a-button v-if="record.withdraw_status === 4" type="danger" ghost>已驳回</a-button>
                <a-button style="margin: 0 5px" type="primary" @click="openUpdateAliPayModal(record)">更新支付宝</a-button>
              </template>
              
              <!-- 转账 modal -->
              <a-modal
                v-model="record.visible"
                :title="visibleKey === 0 ? '转账确认' : '拒绝转账'"
                :ok-text="visibleKey === 0 ? '确认' : '拒绝'"
                cancel-text="取消"
                @ok="onvisible(record, visibleKey)"
              >
                <h6>{{ visibleKey === 0 ? '请确认是否转账' : '请确认是否拒绝该次转账请求' }}</h6>
              </a-modal>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>

    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" mode="lawyer" @close="state.userDialog = false" />
    </q-dialog>

    <!-- 支付宝账户 modal -->
    <a-modal
      v-model="aliPayModal.isShowAliPayModal"
      title="更新支付宝信息"
      :afterClose="onAliPayModalAfterClose"
      @ok="onAliPayModalOkEvt"
    >
      <div class="aliPay-modal">
        <div class="input-item">
          <div class="input-title">支付宝账户姓名：</div>
          <a-input class="input" v-model="aliPayModal.ali_pay_name" :maxLength="10" placeholder="请输入支付宝账户姓名" allowClear />
        </div>
        <div class="input-item">
          <div class="input-title">支付宝账户号码：</div>
          <a-input class="input" v-model="aliPayModal.ali_pay_account" placeholder="请输入支付宝账户号码" allowClear />
        </div>
      </div>
    </a-modal>

    <!-- 驳回理由 modal -->
    <a-modal
      v-model="rejectApplyModal.isShowRejectApplyModal"
      title="驳回理由"
      :width="400"
      :afterClose="() => { rejectApplyModal.reject_reason = ''; rejectApplyModal.userId = 0; }"
      destroyOnClose
      @ok="onRejectApplyModalOkEvt"
    >
      <div class="remark-modal">
        <div class="modal-body">
          <a-textarea v-model="rejectApplyModal.reject_reason" placeholder="请输入驳回理由..." :auto-size="{ minRows: 4 }" />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import AStyleButton from '@/components/Common/AStyleButton.vue'
import { getAssetsStatistics, getWithdrawStatistics } from '@/api/assets'
import * as assetsApi from '@/api/assets'
import { mapState } from 'vuex'

import moment from 'moment'
import 'moment/locale/zh-cn'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import UserMutedButton from '@/components/User/UserMutedButton'

const columns = [
  {
    title: '用户',
    key: 'nickname',
    dataIndex: 'nickname',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'nickname' },
  },
  {
    title: '提现信息',
    key: 'ali_pay_name',
    dataIndex: 'ali_pay_name',
    scopedSlots: { customRender: 'ali_pay_name' },
  },
  {
    title: '提现金额',
    key: 'withdraw_money',
    dataIndex: 'withdraw_money',
    scopedSlots: { customRender: 'withdraw_money' },
  },
  {
    title: '提现类型',
    key: 'form_type',
    dataIndex: 'form_type',
  },
  {
    title: '状态',
    key: 'withdraw_status',
    dataIndex: 'withdraw_status',
    scopedSlots: { customRender: 'withdraw_status' },
  },
  {
    title: '提现时间',
    key: 'created_at',
    dataIndex: 'created_at',
  },
  {
    title: '最近操作时间',
    key: 'updated_at',
    dataIndex: 'updated_at',
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

// 驳回理由modal
const REJECT_APPLY_MODAL = {
  isShowRejectApplyModal: false,
  userId: 0,
  reject_reason: '',
}

export default {
  components: { UserDetailDialog, UserVipCell, UserMutedButton },
  name: 'MoneyPage',
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      AStyleButton,
      columns,
      mask: false,
      loading: true,
      assetsData: [],
      currentUserId: 0,
      state: {
        userDialog: false,
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 6, // 默认每页显示数量
        showTotal: (total) => `共${total}条`,
        showQuickJumper: true,
        onChange: (page) => {
          this.getassetspage(page)
          this.pagination.current = page
        },
      },
      type: -1,
      startDate: '',
      endDate: '',
      search: '', // 手机号搜素
      nickname: '', // 手机号搜素
      visibleKey: 0,

      // 支付宝 modal 信息
      aliPayModal: {
        isShowAliPayModal: false,
        putUserId: '', // 待更新用户 id
        putWithdrawId: '', // 待更新记录 id
        ali_pay_name: '',
        ali_pay_account: '',
      },

      withdrawTypeSelectList: [
        { label: '全部', value: -1 },
        { label: '余额', value: 0 },
        { label: '保障金', value: 1 },
      ], // 提现类型 select 列表
      activeWithdrawTypeValue: -1, // 激活的提现类型 value

      expireTypeSelectList: [
        { label: '今日到期(15个工作日)', value: 1 },
        { label: '明日到期(14个工作日)', value: 2 },
      ], // 到期类型 select 列表
      expireTypeValue: '', // 到期类型 value

      rejectApplyModal: { ...REJECT_APPLY_MODAL }, // 驳回理由 modal
    }
  },
  computed: {
    ...mapState(['dataRoleList']),
    ...mapState({ 'userInfo': state => state.user.info }),

    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['type'] = this.type
      condition['search'] = this.search
      condition['startDate'] = this.startDate
      condition['endDate'] = this.endDate
      return condition
    },
  },
  created() {
    const condition = JSON.parse(sessionStorage.getItem('moneyCondition'))
    if (condition) {
      this.pagination.current = condition.current
      this.type = condition.type
      this.search = condition.search
      this.startDate = condition.startDate
      this.endDate = condition.endDate
      window.sessionStorage.removeItem('moneyCondition')
      this.getassetspage(condition.current)
    } else {
      this.getassetspage(1, '')
    }
  },
  mounted() {
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    moment,

    beforeunloadFn(e) {
      sessionStorage.setItem('moneyCondition', JSON.stringify(this.conditionData))
    },
    onTransfer(record, key) {
      record.visible = true
      this.visibleKey = key
    },
    openUser(id) {
      this.state.userDialog = true
      this.currentUserId = id
    },
    onvisible(record, key) {
      // key=0 同意； key=1拒绝
      if (key === 0) {
        getWithdrawStatistics(record.withdraw_id)
          .then((data) => {
            console.log('转账成功!', data.message)
            record.withdraw_status = 1
            const AssetsStatistics = this.$store.state.pendingAudit.AssetsStatistics - 1
            this.$store.commit('AssetsStatistics', { AssetsStatistics })
            this.getassetspage(this.pagination.current)
          })
          .catch((err) => {
            console.log('转账失败:', err)
            this.$message.error('转账失败!账号可能已注销')
          })
          .finally(() => {
            record.visible = false
          })
      } else {
        record.visible = false
      }
    },
    onChange(pageNumber) {
      this.loading = true
      this.getassetspage(pageNumber)
    },
    onData(value, dateString) {
      this.loading = true
      this.startDate = dateString[0]
      this.endDate = dateString[1]
      this.getassetspage(1)
    },
    onOk(value) {
      console.log('onOk: ', value)
    },
    onChange1(e) {
      this.loading = true
      this.type = Number(e)
      this.getassetspage(1)
    },
    // 手机号搜索
    onPhoneSearch(value) {
      this.loading = true
      this.search = value
      this.getassetspage(1)
    },
    // 昵称搜索
    onNicknameSearch(value) {
      this.loading = true
      this.nickname = value
      this.getassetspage(1)
    },
    /**
     * 获取提现审核记录
     */
    getassetspage(page = 1) {
      this.loading = true
      const param = {
        page,
        type: this.type,
        search: this.search.trim(),
        nickname: this.nickname.trim(),
        start_date: this.startDate,
        end_date: this.endDate,
        form_type: this.activeWithdrawTypeValue
      }
      // 到期类型筛选 | 15个工作日
      if (this.expireTypeValue === 1) {
        const _15WorkdayList = []
        let dayCount = 1

        while (_15WorkdayList.length < 15) {
          const tempDay = moment().add(-dayCount, 'days')
          // 排除星期六、星期七 记录工作日日期
          if (![0, 6].includes(tempDay.day())) {
            _15WorkdayList.push(tempDay.startOf('day').format('YYYY-MM-DD HH:mm:ss'))
          }
          ++dayCount
        }
        // console.log(_15WorkdayList)
        // console.log(dayCount)
        
        param.start_date = moment(_15WorkdayList.at(-2)).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        param.end_date = moment(_15WorkdayList.at(-2)).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      // 14个工作日
      } else if (this.expireTypeValue === 2) {
        const _14WorkdayList = []
        let dayCount = 1

        while (_14WorkdayList.length < 14) {
          const tempDay = moment().add(-dayCount, 'days')
          // 排除星期六、星期七 记录工作日日期
          if (![0, 6].includes(tempDay.day())) {
            _14WorkdayList.push(tempDay.startOf('day').format('YYYY-MM-DD HH:mm:ss'))
          }
          ++dayCount
        }
        
        param.start_date = moment(_14WorkdayList.at(-2)).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        param.end_date = moment(_14WorkdayList.at(-2)).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      }

      getAssetsStatistics(param)
        .then(({ data }) => {
          this.pagination.total = data.total
          if (this.type === 0) {
            const AssetsStatistics = data.total
            this.$store.commit('AssetsStatistics', { AssetsStatistics })
          }
          this.pagination.current = page
          for (let i = 0; i < data.data.length; i++) {
            data.data[i]['visible'] = false
          }
          this.assetsData = data.data
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * 监听到期类型 select change 事件
     */
    onExpireSelectChangeEvt(value) {
      console.log(value)
    },

    /**
     * 打开更新 支付宝 modal
     */
    openUpdateAliPayModal(record) {
      this.aliPayModal.putUserId = record.user_id
      this.aliPayModal.putWithdrawId = record.withdraw_id
      this.aliPayModal.ali_pay_name = record.ali_pay_name || ''
      this.aliPayModal.ali_pay_account = record.ali_pay_account || ''
      this.aliPayModal.isShowAliPayModal = true
    },

    /**
     * 支付宝 Modal 完全关闭后的回调
     */
    onAliPayModalAfterClose() {
      this.aliPayModal.putUserId = ''
      this.aliPayModal.putWithdrawId = ''
      this.aliPayModal.ali_pay_name = ''
      this.aliPayModal.ali_pay_account = ''
      this.aliPayModal.isShowAliPayModal = false
    },
    
    /**
     * 更新支付宝账号信息
     */
    async onAliPayModalOkEvt() {
      const { aliPayModal } = this

      if (!aliPayModal.ali_pay_name.trim()) return this.$message.warning('请输入账户姓名')
      if (!aliPayModal.ali_pay_account.trim()) return this.$message.warning('请输入账户号码')

      const param = {
        user_id: aliPayModal.putUserId,
        withdraw_id: aliPayModal.putWithdrawId,
        ali_pay_name: aliPayModal.ali_pay_name.trim(),
        ali_pay_account: aliPayModal.ali_pay_account.trim(),
      }
      this.aliPayModal.isShowAliPayModal = false

      try {
         const { data: aliPayData } = await assetsApi.updateAliPayAccountApi(param)
         this.getassetspage(this.pagination.current)
       } catch (error) {
          console.log(error)
       }
    },

    /**
     * 打开驳回申请 modal
     */
    openRejectReasonModal(record) {
      this.rejectApplyModal.userId = record.user_id
      this.rejectApplyModal.isShowRejectApplyModal = true
    },

    /**
     * 确定驳回提现申请
     */
    async confirmRejectApply(record) {
      const param = { withdraw_no: record.withdraw_no }

      try {
         await assetsApi.rejectApplyWithdrawApi(param)
         this.$notification.success({ message: '已驳回', duration: 3 })
         this.getassetspage(this.pagination.current)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 驳回申请
     */
    // async onRejectApplyModalOkEvt() {
    //   const { rejectApplyModal } = this
    //   const param = {
    //     user_id: rejectApplyModal.userId,
    //     reject_reason: rejectApplyModal.reject_reason.trim(),
    //   }

    //   this.rejectApplyModal.isShowRejectApplyModal = false

    //   console.log(param)

    //   try {
    //     //  await assetsApi.updateUserPhoneBrandApi(param)
    //      this.$notification.success({ message: '已驳回', duration: 3 })
    //      this.getassetspage(this.pagination.current)
    //    } catch (error) {
    //      console.log(error)
    //    }
    // },
  },
}
</script>

<style lang="less" scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.imgUser {
  height: 50px;
  width: 50px;
  margin-right: 10px;
}

// .userDiv {
//   display: flex;
//   justify-self: start;
// }

p {
  font-size: 14px;
  margin: 0;
}
.colorbtn1 {
  color: #337ab7;
  background-color: white;
  width: 70px;
  height: 32px;
  border: 1px solid #337ab7;
  opacity: 1;
  border-radius: 4px;
}
.colorbtn2 {
  color: #2cbf78;
  background-color: white;
  width: 70px;
  height: 32px;
  border: 1px solid #2cbf78;
  opacity: 1;
  border-radius: 4px;
}

.aliPay-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    .input-title {
      font-size: 14px;
      font-weight: 500;
    }
    .input {
      flex: 1;
    }
  }
}

.tool-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
}
</style>
