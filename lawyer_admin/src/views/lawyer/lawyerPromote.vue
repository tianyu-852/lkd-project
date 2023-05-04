<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">推广大使</span>

      <!-- 搜索输入框 -->
      <div class="mobile-input-wrap">
        <a-input allow-clear placeholder="搜索姓名" v-model="searchKey" @keyup.enter="refreshTableData" style="margin: 0 5px; width: 180px" />
        <a-button type="primary" @click="refreshTableData">搜索</a-button>
      </div>

      <template v-if="userInfo && dataRoleList.includes(userInfo.name)">
        <a-button type="primary" style="margin-left: auto;" @click="openIncomeModal">收益规则设置</a-button>
      </template>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>

      <a-tabs v-model="activeTabKey">
        <!-- 待审核 -->
        <a-tab-pane v-if="userInfo && dataRoleList.includes(userInfo.name)" key="1" :tab="'待审核 ' + '(' + tableCheckPagination.total + ')'">
          <a-table
            :data-source="tableCheckList"
            :loading="tableCheckLoading"
            :pagination="tableCheckPagination"
            :rowKey="(record) => String(record.enterprise_services_log_id)"
            bordered
          >
            <!-- ID -->
            <a-table-column dataIndex="enterprise_services_log_id" title="ID" align="center" />

            <!-- 律师 -->
            <a-table-column key="nickname" title="申请律师" align="center" :width="170">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                  <user-vip-cell
                    :nickname="record.lawyer.nickname"
                    :avatar="record.lawyer.avatar"
                    :mobile="record.lawyer.mobile"
                    :user-id="String(record.user_id)"
                    size="sm"
                  />
                </div>
              </template>
            </a-table-column>

            <!-- 申请手机 -->
            <a-table-column dataIndex="mobile" title="申请手机" align="center" />

            <!-- 是否是优选律师 -->
            <a-table-column title="是否是优选律师" align="center">
              <template slot-scope="record">
                <span v-if="record.is_optimization" style="color: #41b583;">是</span>
                <span v-else>否</span>
              </template>
            </a-table-column>

            <!-- 申请时间 -->
            <a-table-column dataIndex="created_at" title="申请时间" align="center" />

            <!-- 申请状态 -->
            <a-table-column title="申请状态" align="center">
              <template slot-scope="record">
                <span v-if="record.status === 2" style="color: #41b583;">已通过</span>
                <span v-else-if="record.status === 3" style="color: #f56c6c;">已拒绝</span>
                <span v-else>待处理</span>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center">
              <template slot-scope="text, record">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
                  <a-button type="link" style="margin-lef: 5px" size="small" @click="navToLawyerDetailPage(record)">律师主页</a-button>
                  <template v-if="record.status === 1">
                    <a-popconfirm title="是否通过这次申请？" @confirm="confirmLawyerApply(record)" >
                      <a-button type="link" style="margin-lef: 5px; color: #41b583;" size="small">通过</a-button>
                    </a-popconfirm>
                    <a-button type="link" style="color: #f56c6c;" size="small" @click="openRefuseModal(record)">拒绝</a-button>
                  </template>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 已通过 -->
        <a-tab-pane key="2" :tab="'已通过 ' + '(' + tableTotalPagination.total + ')'">
          <a-table
            :data-source="tableTotalList"
            :loading="tableTotalLoading"
            :pagination="tableTotalPagination"
            :rowKey="(record) => String(record.user_id)"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="推广律师" align="center" :width="170">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                  <user-vip-cell
                    :nickname="record.user.nickname"
                    :avatar="record.user.avatar"
                    :mobile="(userInfo && dataRoleList.includes(userInfo.name) ? record.user.mobile : hidePhoneFunc(record.user.mobile))"
                    :user-id="String(record.user_id)"
                    size="sm"
                  />
                </div>
              </template>
            </a-table-column>

            <!-- 是否是优选律师 -->
            <a-table-column title="是否是优选律师" align="center">
              <template slot-scope="record">
                <span v-if="record.is_optimization" style="color: #41b583;">是</span>
                <span v-else>否</span>
              </template>
            </a-table-column>

            <!-- 收益 -->
            <a-table-column dataIndex="earnings" title="收益" align="center" />

            <!-- 已支付客户 -->
            <a-table-column dataIndex="have_paid_num" title="已支付客户" align="center" />

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center">
              <template slot-scope="text, record">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
                  <a-button type="link" style="margin: 5px" size="small" @click="navToLawyerDetailPage(record)">律师主页</a-button>
                  <a-button type="link" style="margin: 5px" size="small" @click="navToLawyerPromoteIncomePage(record)">收益详情</a-button>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 申请记录 -->
        <a-tab-pane v-if="userInfo && dataRoleList.includes(userInfo.name)" key="3" :tab="'申请记录 ' + '(' + tableRecordPagination.total + ')'">
          <a-table
            :data-source="tableRecordList"
            :loading="tableRecordLoading"
            :pagination="tableRecordPagination"
            :rowKey="(record) => String(record.enterprise_services_log_id)"
            bordered
          >
            <!-- ID -->
            <a-table-column dataIndex="enterprise_services_log_id" title="ID" align="center" />

            <!-- 律师 -->
            <a-table-column key="nickname" title="申请律师" align="center" :width="170">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                  <user-vip-cell
                    :nickname="record.lawyer.nickname"
                    :avatar="record.lawyer.avatar"
                    :mobile="record.lawyer.mobile"
                    :user-id="String(record.user_id)"
                    size="sm"
                  />
                </div>
              </template>
            </a-table-column>

            <!-- 申请手机 -->
            <a-table-column dataIndex="mobile" title="申请手机" align="center" />

            <!-- 是否是优选律师 -->
            <a-table-column title="是否是优选律师" align="center">
              <template slot-scope="record">
                <span v-if="record.is_optimization" style="color: #41b583;">是</span>
                <span v-else>否</span>
              </template>
            </a-table-column>

            <!-- 申请时间 -->
            <a-table-column dataIndex="created_at" title="申请时间" align="center" />

            <!-- 申请状态 -->
            <a-table-column title="申请状态" align="center">
              <template slot-scope="record">
                <span v-if="record.status === 2" style="color: #41b583;">已通过</span>
                <span v-else-if="record.status === 3" style="color: #f56c6c;">已拒绝</span>
                <span v-else>待处理</span>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center">
              <template slot-scope="text, record">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
                  <a-button type="link" style="margin-lef: 5px" size="small" @click="navToLawyerDetailPage(record)">律师主页</a-button>
                  <template v-if="record.status === 1">
                    <a-popconfirm title="是否通过这次申请？" @confirm="confirmLawyerApply(record)" >
                      <a-button type="link" style="margin-lef: 5px; color: #41b583;" size="small">通过</a-button>
                    </a-popconfirm>
                    <a-button type="link" style="color: #f56c6c;" size="small" @click="openRefuseModal(record)">拒绝</a-button>
                  </template>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 推广成交记录 -->
        <a-tab-pane key="4" :tab="'推广成交记录 ' + '(' + tableDealRecordPagination.total + ')'">
          <a-table
            :data-source="tableDealRecrodList"
            :loading="tableDealRecordLoading"
            :pagination="tableDealRecordPagination"
            :rowKey="(record) => String(record.user_id)"
            :scroll="{ x: 1400 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="推广律师" align="center" :width="170">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                  <user-vip-cell
                    :nickname="record.lawyer.nickname"
                    :avatar="record.lawyer.avatar"
                    :mobile="(userInfo && dataRoleList.includes(userInfo.name) ? record.lawyer.mobile : hidePhoneFunc(record.user.mobile))"
                    :user-id="String(record.user_id)"
                    size="sm"
                  />
                  <a-tag v-if="record.lawyer.is_optimal_enjoy" color="#41b583" style="margin-top: 4px; border-radius: 4px;">优选律师</a-tag>
                </div>
              </template>
            </a-table-column>

            <!-- 用户 -->
            <a-table-column key="nickname" title="成交用户" align="center" :width="170">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
                  <user-vip-cell
                    :nickname="record.user.nickname"
                    :avatar="record.user.avatar"
                    :mobile="record.user.mobile"
                    :user-id="String(record.user.user_id)"
                    size="sm"
                  />
                </div>
              </template>
            </a-table-column>

            <!-- 套餐 -->
            <a-table-column title="购买套餐" align="center" :width="170">
              <template slot-scope="record">
                <div>{{ record.husbandmanEnterpriseVip.price }}/{{ record.husbandmanEnterpriseVip.title }}</div>
              </template>
            </a-table-column>

            <!-- 成交时间 -->
            <a-table-column dataIndex="pay_time" title="购买时间" align="center" :width="170" />

            <!-- 律师收益 -->
            <a-table-column title="律师收益" align="center" :width="170">
              <template slot-scope="record">
                <div>{{ record.status === 3 ? `${ record.earnings }` : '/' }}</div>
              </template>
            </a-table-column>

            <!-- 法务管家 -->
            <a-table-column dataIndex="customer.name" title="法务管家" align="center" />

            <!-- 状态 -->
            <a-table-column title="状态" align="center">
              <template slot-scope="record">
                <span v-if="record.status === 3" style="color: #41b583;">{{ record.status_txt }}</span>
                <span v-else style="color: #f56c6c;">{{ record.status_txt }}</span>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" width="220px">
              <template slot-scope="record">
                <a-button type="link" style="padding: 0; margin-right: 5px" size="small" @click="navToLawyerDetailPage(record.lawyer)">律师主页</a-button>
                <a-button type="link" style="padding: 0; margin-right: 5px" size="small" @click="navToLawyerPromoteIncomePage({ user: record.lawyer })">收益详情</a-button>
                <a-button type="link" style="padding: 0;" @click="navToOrderdetail(record)">发单详情</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 拒绝 modal -->
    <a-modal
      v-model="refuseModal.isShowRefuseModal"
      title="拒绝理由"
      :width="400"
      :afterClose="() => { refuseModal.reason = ''; refuseModal.recordId = 0; }"
      destroyOnClose
      @ok="onRefuseModalOkEvt"
    >
      <div class="refuse-modal-box">
        <a-textarea v-model="refuseModal.reason" placeholder="请输入拒绝理由..." :auto-size="{ minRows: 5 }" />
      </div>
    </a-modal>

    <!-- 收益 modal -->
    <a-modal
      v-model="incomeModal.isShowIncomeModal"
      title="收益规则设置"
      :width="500"
      destroyOnClose
      @ok="onIncomeModalOkEvt"
    >
      <div class="income-modal-box">
        <div class="income-item">
          <div class="income-item-left">第一阶段:</div>
          <div class="income-item-right">
            <span style="margin-right: 20px;">1</span>
            <span style="margin-right: 20px;">至</span>
            <a-input style="width: 80px;" placeholder="几单" v-model="incomeRule.num" />
            <span style="margin-right: 20px; margin-left: 6px;">单,</span>
            <a-input style="width: 80px;" placeholder="百分比" v-model="incomeRule.first_proportion" />
            <span style="margin-left: 6px;">% 收益,</span>
          </div>
        </div>
        <div class="income-item">
          <div class="income-item-left">第二阶段:</div>
          <div class="income-item-right">
            <span style="margin-right: 20px;">{{ incomeRule.num }}</span>
            <span style="margin-right: 20px;">单以上,</span>
            <a-input style="width: 80px;" placeholder="百分比" v-model="incomeRule.second_proportion" />
            <span style="margin-left: 6px;">% 收益.</span>
          </div>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import UserVipCell from '@/components/User/UserVipCell'
import { mapState } from 'vuex'
import * as lawyerApi from '@/api/lawyer'

// 拒绝 modal
const REFUSE_MODAL = {
  reason: '',
  isShowRefuseModal: false,
  enterprise_services_log_id: 0, // 申请记录 id
}

// 收益 modal
const INCOME_MODAL = {
  isShowIncomeModal: false,
}

export default {
  name: 'LawyerPromotePage',
  components: { UserVipCell },
  data() {
    return {
      searchKey: '', // 搜索关键字
      activeTabKey: '1', // 激活的 tab
      incomeRule: {}, // 收益规则信息

      tableCheckList: [], // 待审核列表
      tableCheckLoading: false,
      tableCheckPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerPromoteCheckList(page)
          this.tableCheckPagination.current = page
        },
      },

      tableTotalList: [], // 推广大使全部列表
      tableTotalLoading: false,
      tableTotalPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerPromoteTotalList(page)
          this.tableTotalPagination.current = page
        },
      },

      tableRecordList: [], // 申请记录
      tableRecordLoading: false,
      tableRecordPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerPromoteRecordList(page)
          this.tableRecordPagination.current = page
        },
      },

      tableDealRecrodList: [], // 成交
      tableDealRecordLoading: false,
      tableDealRecordPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerDealRecordList(page)
          this.tableDealRecordPagination.current = page
        },
      },

      refuseModal: { ...REFUSE_MODAL }, // 拒绝 modal
      incomeModal: { ...INCOME_MODAL }, // 收益 modal 
    }
  },
  computed: {
    ...mapState(['dataRoleList', 'openVipRoleList']),
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    this._getLawyerPromoteIncomeRule()
    
    this._getLawyerPromoteCheckList()
    this._getLawyerPromoteTotalList()
    this._getLawyerPromoteRecordList()
    this._getLawyerDealRecordList()

    // 限制白名单外的人只看「已通过 tab」
    if (this.userInfo && !this.dataRoleList.includes(this.userInfo.name)) this.activeTabKey = '2'
  },
  methods: {
    // 隐藏手机号码中间4位数
    hidePhoneFunc(phone) {
      const reg = /^(\d{3})\d{4}(\d{4})$/
      return phone.replace(reg, '$1****$2')
    },

    /**
     * 获取推广大使 收益规则
     */
     async _getLawyerPromoteIncomeRule() {
       try {
         const { data: incomeRuleData } = await lawyerApi.getLawyerPromoteIncomeRuleApi()
         incomeRuleData.num = `${ incomeRuleData.num }`
         incomeRuleData.first_proportion = `${ Number(incomeRuleData.first_proportion * 100) }`
         incomeRuleData.second_proportion = `${ Number(incomeRuleData.second_proportion * 100) }`
         
         this.incomeRule = incomeRuleData
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取推广大使 全部列表
     */
     async _getLawyerPromoteTotalList(page = 1) {
       this.tableTotalLoading = true

       const param = {
        page,
        size: this.tableTotalPagination.pageSize,
       }
       // 添加搜索关键字  
       if (this.searchKey.trim()) param.nickname = this.searchKey.trim()

       try {
         const { data: tableTotalData } = await lawyerApi.getLawyerPromoteTotalListApi(param)
         this.tableTotalList = tableTotalData.data
         this.tableTotalPagination.total = tableTotalData.total
         this.tableTotalPagination.current = page
         this.tableTotalLoading = false
       } catch (error) {
         this.tableTotalLoading = false
         console.log(error)
       }
    },

    /**
     * 获取推广大使 待审核
     */
     async _getLawyerPromoteCheckList(page = 1) {
       this.tableCheckLoading = true

       const param = { page, size: this.tableCheckPagination.pageSize, status: 1, }
       // 添加搜索关键字  
       if (this.searchKey.trim()) param.nickname = this.searchKey.trim()

       try {
         const { data: tableCheckData } = await lawyerApi.getLawyerPromoteCheckListApi(param)
         this.tableCheckList = tableCheckData.data
         this.tableCheckPagination.total = tableCheckData.total
         this.tableCheckPagination.current = page
         this.tableCheckLoading = false
       } catch (error) {
         this.tableCheckLoading = false
         console.log(error)
       }
    },

    /**
     * 获取推广大使 申请记录
     */
     async _getLawyerPromoteRecordList(page = 1) {
       this.tableRecordLoading = true
       const param = { page, size: this.tableRecordPagination.pageSize, }
       // 添加搜索关键字  
       if (this.searchKey.trim()) param.nickname = this.searchKey.trim()

       try {
         const { data: tableRecordData } = await lawyerApi.getLawyerPromoteCheckListApi(param)
         this.tableRecordList = tableRecordData.data
         this.tableRecordPagination.total = tableRecordData.total
         this.tableRecordPagination.current = page
         this.tableRecordLoading = false
       } catch (error) {
         this.tableRecordLoading = false
         console.log(error)
       }
    },

    /**
     * 获取推广大使 成交记录
     */
     async _getLawyerDealRecordList(page = 1) {
       this.tableDealRecordLoading = true
       const param = { page, size: this.tableDealRecordPagination.pageSize, }
       // 添加搜索关键字  
       if (this.searchKey.trim()) param.nickname = this.searchKey.trim()

       try {
         const { data: tableRecordData } = await lawyerApi.getLawyerPromoteIncomeDetailApi(param)
         this.tableDealRecrodList = tableRecordData.data.data
         this.tableDealRecordPagination.total = tableRecordData.data.total
         this.tableDealRecordPagination.current = page
         this.tableDealRecordLoading = false
       } catch (error) {
         this.tableDealRecordLoading = false
         console.log(error)
       }
    },

    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      const { activeTabKey } = this

      if (activeTabKey === '1') this._getLawyerPromoteCheckList(this.tableCheckPagination.current)
      if (activeTabKey === '2') this._getLawyerPromoteTotalList(this.tableTotalPagination.current)
      if (activeTabKey === '3') this._getLawyerPromoteRecordList(this.tableRecordPagination.current)
      if (activeTabKey === '4') this._getLawyerDealRecordList(this.tableDealRecordPagination.current)
    },

    /**
     * 查看律师主页
     */
    navToLawyerDetailPage(record) {
      const userId = String(record.user_id)
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
    },
    
    /**
     * 查看推广大使收益详情
     */
    navToLawyerPromoteIncomePage(record) {
      // const userId = String(record.user.user_id)
      sessionStorage.setItem('lawyerInfoSession', JSON.stringify(record.user))
      this.$router.push({ name: 'LawyerPromoteIncomeRoute' })
    },

    /**
     * 进入订单详情
     */
    navToOrderdetail(record) {
      const enterpriseId = String(record.user.user_id)
      this.$router.push({ name: 'clientOrderDetail', query: { enterpriseId } })
    },

    /**
     * 打开拒绝 modal
     */
    openRefuseModal(record) {
      this.refuseModal.enterprise_services_log_id = record.enterprise_services_log_id
      this.refuseModal.isShowRefuseModal = true
    },
    
    /**
     * 监听拒绝 modal ok事件
     */
    async onRefuseModalOkEvt() {
      const { refuseModal } = this

      if (!refuseModal.enterprise_services_log_id) return this.$message.warning('无申请记录 id')
      if (!refuseModal.reason.trim()) return this.$message.warning('请输入拒绝理由')

      const param = {
        type: 2,
        enterprise_services_log_id: refuseModal.enterprise_services_log_id,
        message: refuseModal.reason.trim()
      }
      this.refuseModal.isShowRefuseModal = false

       try {
         await lawyerApi.postLawyerApplyPromoteCheckApi(param)
         this.$notification.success({ message: '已拒绝申请', duration: 3 })
         this._getLawyerPromoteCheckList(this.tableCheckPagination.current)
         this._getLawyerPromoteTotalList(this.tableTotalPagination.current)
         this._getLawyerPromoteRecordList(this.tableRecordPagination.current)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 确认律师 申请
     */
    async confirmLawyerApply(record) {
      const param = {
        type: 1,
        enterprise_services_log_id: record.enterprise_services_log_id,
      }

       try {
         await lawyerApi.postLawyerApplyPromoteCheckApi(param)
         this.$notification.success({ message: '通过申请', duration: 3 })
         this._getLawyerPromoteCheckList(this.tableCheckPagination.current)
         this._getLawyerPromoteTotalList(this.tableTotalPagination.current)
         this._getLawyerPromoteRecordList(this.tableRecordPagination.current)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 打开收益规则 modal
     */
    openIncomeModal() {
      this.incomeModal.isShowIncomeModal = true
    },

    /**
     * 监听收益规则 modal ok事件
     */
    async onIncomeModalOkEvt() {
      const { incomeRule } = this

      if (!incomeRule.num.trim()) return this.$message.warning('请输入第一阶段单数')
      if (!incomeRule.first_proportion.trim()) return this.$message.warning('请输入第一阶段收益百分比')
      if (!incomeRule.second_proportion.trim()) return this.$message.warning('请输入第二阶段收益百分比')

      const param = {
        num: incomeRule.num,
        first_proportion: `${ incomeRule.first_proportion.trim() / 100 }`,
        second_proportion: `${ incomeRule.second_proportion.trim() / 100 }`,
        rules_content: '',
      }
      this.incomeModal.isShowIncomeModal = false

       try {
         await lawyerApi.updateLawyerPromoteIncomeRuleApi(param)
         this._getLawyerPromoteIncomeRule()
         this.$notification.success({ message: '更新收益规则成功', duration: 3 })
       } catch (error) {
         console.log(error)
       }
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 90px;
    font-size: 16px;
    font-weight: 600;
    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }
}

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .column-menu-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-weight: 600;
  }
}

.income-modal-box {
  .income-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
    &:last-child { margin-bottom: 0; }
    .income-item-left {
      font-size: 14px;
      font-weight: 600;
      margin-right: 30px;
    }
  }
}
</style>
