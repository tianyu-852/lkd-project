<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">企业客户：{{ pagination.total }}</span>

      <!-- 搜索输入框 -->
      <div class="mobile-input-wrap">
        <a-input allow-clear placeholder="搜索手机号" v-model="searchMobile" @keyup.enter="getSearchData" style="margin: 0 5px; width: 180px" />
        <a-button type="primary" @click="getSearchData">搜索</a-button>
      </div>

      <!-- 时间筛选 -->
      <a-range-picker
        @change="onRangePickerChange"
        @ok="getSearchData"
        style="width: 340px; margin-left: 30px;"
        format="YYYY-MM-DD HH:mm:ss"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
      />
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getClientCompanyList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.user_enterprise_id)"
        :scroll="{ x: 1800 }"
        bordered
      >
        <!-- <a-table-column dataIndex="source_type" title="来源" align="center" /> -->
        <!-- 来源 -->
        <a-table-column align="center" width="190px">
          <div slot="title" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
            <span>来源</span>
            <a-select style="width: 140px; margin-top: 5px;" v-model="sourceActiveFactor" allowClear @change="_getClientCompanyList()">
              <a-select-option v-for="sItem in sourceSelectList" :value="sItem.value" :key="sItem.value">
                {{ sItem.label }}
              </a-select-option>
            </a-select>
          </div>

          <div slot-scope="record">{{ record.source_type }}</div>
          <!-- <template slot-scope="record">
          </template> -->
        </a-table-column>

        <!-- 销售 -->
        <a-table-column title="销售" align="center">
          <template slot-scope="record">
            <div class="column-user-wrap">主体：{{ record.sales_affairs_alliance.alliance_name }}</div>
            <div class="column-user-wrap">销售员：{{ record.customer.customer_name }}</div>
          </template>
        </a-table-column>

        <!-- 企业客户 -->
        <a-table-column dataIndex="enterprise_name" title="客户" align="center" />

        <!-- 主要联系人 -->
        <!-- <a-table-column dataIndex="contacts_name" title="主要联系人" align="center" width="120px" /> -->

        <!-- 手机号 -->
        <!-- <a-table-column dataIndex="contacts_phone" title="手机号" align="center" width="160px" /> -->

        <!-- 主要联系人 -->
        <a-table-column title="主要联系人" align="center">
          <template slot-scope="record">
            <div class="column-user-wrap">{{ record.contacts_name }}</div>
            <div class="column-user-wrap">{{ record.contacts_phone }}</div>
          </template>
        </a-table-column>

        <!-- 套餐 -->
        <!-- <a-table-column dataIndex="user.enterprise_vip" title="套餐" align="center" width="160px" /> -->

        <!-- 企业套餐 -->
        <a-table-column align="center" width="190px">
          <div slot="title" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
            <span>企业套餐</span>
            <a-select style="width: 160px; margin-top: 5px;" v-model="enterpriseLawServeVipId" allowClear @change="_getClientCompanyList()">
              <a-select-option v-for="sItem in enterpriseLawServeVipSelectList" :value="sItem.value" :key="sItem.value">
                {{ sItem.label }}
              </a-select-option>
            </a-select>
          </div>

          <template v-if="record.user.enterprise_vip" slot-scope="record">
            <div>{{ record.user.enterprise_vip }}</div>
            <div>{{ record.user.enterprise_vip_opened_at }}</div>
            <div>至</div>
            <div>{{ record.user.enterprise_vip_expired_at }}</div>
          </template>
        </a-table-column>

        <!-- 实际售卖价 -->
        <a-table-column title="实际售卖价" align="center">
          <template slot-scope="record">
            <div v-if="record.user.enterprise_vip" class="column-user-wrap">{{ record.remarks.enterprise ? ('￥' + record.remarks.enterprise) : '套餐原价' }}</div>
          </template>
        </a-table-column>

        <!-- 个人套餐 -->
        <!-- <a-table-column align="center">
          <div slot="title" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
            <span>个人套餐</span>
            <a-select style="width: 160px; margin-top: 5px;" v-model="personLawServeVipId" allowClear @change="_getClientCompanyList()">
              <a-select-option v-for="sItem in personLawServeVipSelectList" :value="sItem.value" :key="sItem.value">
                {{ sItem.label }}
              </a-select-option>
            </a-select>
          </div>

          <template v-if="record.user.vip" slot-scope="record">
            <div>{{ record.user.vip }}</div>
            <div>
              {{ record.user.vip_new_time }}<br />
              至<br />
              {{ record.user.vip_expired_time }}
            </div>
          </template>
        </a-table-column> -->

        <!-- 创建时间 -->
        <!-- <a-table-column dataIndex="created_at" title="创建时间" align="center" /> -->

        <!-- 法务管家 -->
        <a-table-column dataIndex="legal.legal_name" title="法务管家" align="center" />

        <!-- 订单金额 -->
        <a-table-column dataIndex="sum.pay" title="订单金额" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="220px">
          <template slot-scope="record">
            <a-button type="link" style="padding: 0; margin-right: 5px;" @click="$router.push({ name: 'clientCompanyEdit', query: { userEnterpriseId: record.user_enterprise_id } })">编辑</a-button>
            <a-button type="link" style="margin-right: 10px; padding: 0;" @click="navToOrderdetail(record)">发单详情</a-button>
            <a-button type="link" style="padding: 0;" @click="openCompanyConcartModal(record)">联系人列表</a-button>
            <a-button type="link" style="padding: 0; margin-right: 5px;" @click="openAddOtherContactModal(record)">添加联系人</a-button>
            <a-button type="link" style="padding: 0;" @click="navToClientExpenseRecordPage(record)">消费记录</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 联系人列表 modal -->
    <a-modal
      v-model="otherContactModal.isShowOtherContactModal"
      :title="'联系人信息'"
      :width="500"
      destroyOnClose
      :footer="null"
    >
      <div v-if="otherContactModal.enterpriseDetail.contact" class="other-contact-modal">
        <!-- <div class="contact-item" style="margin-bottom: 20px;">
          <div class="contact-left">使用人：</div>
          <div class="contact-middle">
            <div class="otherContact-item">{{ '张总' }}</div>
            <div class="otherContact-item">{{ '15327895738' }}</div>
          </div>
        </div> -->
        <!-- 附属联系人 -->
        <div v-for="(rItem, rIndex) of otherContactModal.enterpriseDetail.contact.filter(item => !item.is_main)" :key="rIndex" class="contact-item">
          <div class="contact-left">附属人{{ rIndex + 1 }}：</div>
          <div class="contact-middle">
            <div class="otherContact-item">{{ rItem.name }}</div>
            <div class="otherContact-item">{{ rItem.mobile }}</div>
            <div class="otherContact-item">{{ rItem.position }}</div>

            <a-popconfirm title="请确认是否删除该附属人?" @confirm="submitDelOtherContact(rItem, rIndex)">
              <a-button type="danger" size="small">删除</a-button>
            </a-popconfirm>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 添加联系人 modal -->
    <a-modal
      v-model="addOtherContactModal.isShowAddOtherContactModal"
      :title="'添加联系人'"
      :width="400"
      :afterClose="onAddOtherContactModalAfterClose"
      destroyOnClose
      @ok="onAddOtherContactModalOkEvt"
    >
      <div class="addOther-contact-modal">
        <div class="input-item">
          <div class="input-title">姓名：</div>
          <a-input class="input" v-model="addOtherContactModal.otherContactName" placeholder="请输入姓名" allowClear />
        </div>
        <div class="input-item">
          <div class="input-title">手机号：</div>
          <a-input class="input" v-model="addOtherContactModal.otherContactMobile" placeholder="请输入手机号" allowClear />
        </div>
        <div class="input-item">
          <div class="input-title">职位：</div>
          <a-input class="input" v-model="addOtherContactModal.otherContactJob" placeholder="请输入职位" allowClear />
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import moment from 'moment'
// import * as lawServeApi from '@/api/lawServeApi'
import * as clientApi from '@/api/clientApi'

// 联系人 modal 信息
const ADD_OTHER_CONTACT_MODAL = {
  isShowAddOtherContactModal: false, // 是否显示附属人  modal
  userEnterpriseId: '', // 用户企业 id
  otherContactName: '', // 附属人姓名
  otherContactMobile: '', // 附属人手机号
  otherContactJob: '', // 附属人职位
}

// 联系人列表 modal 信息
const OTHER_CONTACT_MODAL = {
  isShowOtherContactModal: false, // 是否显示附属人  modal
  enterpriseDetail: {}
}

export default {
  name: 'ClientCompanyList',
  data() {
    return {
      tabelDataList: [], // 标签列表
      tabelDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getClientCompanyList(page)
          this.pagination.current = page
        },
      },

      // 时间过滤条件
      filterInfo: {
        startDate: '', // 开始时间
        endDate: '', // 结束时间
      },

      sourceActiveFactor: '', // 选中的来源条件
      sourceSelectList: [
        { label: '百姓律师', value: 1 },
        { label: '企业律云', value: 2 },
        { label: '加盟商', value: 3 },
        { label: '后台', value: 4 },
        { label: '其他', value: 5 },
      ],

      searchMobile: '', // 搜索手机号
      enterpriseLawServeVipSelectList: [], // 企业套餐类型 select 列表
      enterpriseLawServeVipId: '', // 企业法律套餐类型 id

      personLawServeVipSelectList: [], // 个人套餐类型 select 列表
      personLawServeVipId: '', // 个人法律套餐类型 id

      enterpriseId: 0, // 企业 id
      isShowContactModal: false, // 是否打开联系人 Modal
      companyContactList: [], // 企业联系人列表

      addOtherContactModal: Object.assign({}, ADD_OTHER_CONTACT_MODAL), // 添加联系人 modal
      otherContactModal: Object.assign({}, OTHER_CONTACT_MODAL), // 联系人列表 modal
    }
  },
  created() {
    this._getClientCompanyList()
    this._getEnterpriseLawServeVipList()
    this._getPersonLawServeVipList()
  },
  methods: {
    moment,
    /**
     * RangePicker 发生变化的回调
     */
    onRangePickerChange(date, dateStrAry) {
      this.filterInfo.startDate = dateStrAry[0]
      this.filterInfo.endDate = dateStrAry[1]
      // 清空日期选择重新请求一次
      if (!dateStrAry[0] || !dateStrAry[1]) this._getClientCompanyList()
    },

    /**
     * 获取企业服务套餐列表
     */
     async _getEnterpriseLawServeVipList() {
       try {
         const { data: lawServeListData } = await clientApi.getEnterpriseLawServeVipListApi()

         const _tempSelectList = []
         for (const lItem of lawServeListData) {
           const selectOpt = { label: `${ lItem.title } ${ lItem.price }/年`, value: lItem.enterprise_vip_id, }
           _tempSelectList.push(selectOpt)
         }
         this.enterpriseLawServeVipSelectList = _tempSelectList
       } catch (error) {
         console.log(error)
       }
    },
    
    /**
     * 获取个人服务套餐列表
     */
     async _getPersonLawServeVipList() {
       try {
         const { data: lawServeListData } = await clientApi.getPersonLawServeVipListApi()

         const _tempSelectList = []
         for (const lItem of lawServeListData) {
           const selectOpt = { label: `${ lItem.origin_price }/${ lItem.vip_name }`, value: lItem.vip_id, }
           _tempSelectList.push(selectOpt)
         }
         this.personLawServeVipSelectList = _tempSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取企业客户列表
     */
     async _getClientCompanyList(page = 1) {
       this.tabelDataLoading = true
       // 请求参数
       const param = {
         page,
         size: this.pagination.pageSize,
         is_certification: 1, // 是否认证
         mobile: this.searchMobile.trim(),
         created_at: 1, // 开户时间倒序
        }

        // 时间段 条件
       this.filterInfo.startDate && (param.start_time = this.filterInfo.startDate)
       this.filterInfo.endDate && (param.end_time = this.filterInfo.endDate)

        // 企业套餐
        this.enterpriseLawServeVipId && (param.enterprise_vip_id = this.enterpriseLawServeVipId)
        // 个人套餐
        this.personLawServeVipId && (param.vip_id = this.personLawServeVipId)
        // 时间段 条件
        this.filterInfo.startDate && (param.start_time = this.filterInfo.startDate)
        this.filterInfo.endDate && (param.end_time = this.filterInfo.endDate)

        // 来源条件
        this.sourceActiveFactor && (param.enterprise_source = this.sourceActiveFactor)

       try {
         const { data: clientCompanyData } = await clientApi.getClientCompanyListApi(param)
         this.tabelDataList = clientCompanyData.data
         this.pagination.total = clientCompanyData.total
         this.pagination.current = page
         this.tabelDataLoading = false
       } catch (error) {
         this.tabelDataLoading = false
         console.log(error)
       }
    },

    /**
     * 重新搜索
     */
    getSearchData() {
      this._getClientCompanyList()
    },

    /**
     * 进入订单详情
     */
    navToOrderdetail(record) {
      const enterpriseId = String(record.user_enterprise_id)
      this.$router.push({ name: 'clientOrderDetail', query: { enterpriseId } })
    },

    /**
     * 打开企业联系人 modal
     */
    async openCompanyConcartModal(record) {
      const enterpriseId = record.user_enterprise_id // 企业 id
      this.otherContactModal.isShowOtherContactModal = true
      this._getEnterpriseLawServeDetail(enterpriseId)
    },

    /**
     * 获取企业联系人列表
     */
    // async _getCompanyContactList() {
    //   const param = { user_enterprise_id: this.enterpriseId, page: 1 }

    //   try {
    //      const { data: companyContactData } = await clientApi.getCompanyContactListApi(param)
    //      this.companyContactList = companyContactData.data
    //    } catch (error) {
    //      this.tabelDataLoading = false
    //      console.log(error)
    //    }
    // },

    /**
     * 获取企业套餐详情
     */
     async _getEnterpriseLawServeDetail(userEnterpriseId) {
       if (!userEnterpriseId) return
       const param = { user_enterprise_id: userEnterpriseId }
       console.log(param)

       try {
         const { data: enterpriseLawServeData } = await clientApi.getEnterpriseLawServeDetailApi(param)
         this.otherContactModal.enterpriseDetail = enterpriseLawServeData
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 打开添加联系人 modal
     */
    openAddOtherContactModal(record) {
      this.addOtherContactModal.userEnterpriseId = record.user_enterprise_id
      this.addOtherContactModal.isShowAddOtherContactModal = true
    },

    /**
     * 监听附属人 modal ok 事件
     */
    async onAddOtherContactModalOkEvt() {
      const { addOtherContactModal } = this
      if (!addOtherContactModal.otherContactName.trim()) return this.$message.warning('请输入姓名')
      if (!addOtherContactModal.otherContactMobile.trim()) return this.$message.warning('请输入手机号')
      if (addOtherContactModal.otherContactMobile.trim().length !== 11) return this.$message.warning('请输入正确的手机号')
      if (!addOtherContactModal.otherContactJob.trim()) return this.$message.warning('请输入职位')

      this.addOtherContactModal.isShowAddOtherContactModal = false
      const param = {
        user_enterprise_id: this.addOtherContactModal.userEnterpriseId,
        name: this.addOtherContactModal.otherContactName.trim(),
        mobile: this.addOtherContactModal.otherContactMobile.trim(),
        position: this.addOtherContactModal.otherContactJob.trim(),
      }

      try {
        const { data } = await clientApi.addEnterpriseOtherContactApi(param)
        this._getClientCompanyList(this.pagination.current)
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听附属人 Modal 完全关闭后的回调
     */
    onAddOtherContactModalAfterClose() {
      this.addOtherContactModal = Object.assign({}, ADD_OTHER_CONTACT_MODAL)
    },

    /**
     * 确认删除附属人
     */
    async submitDelOtherContact(otherContactItem, otherContactIndex) {
      const param = {
        user_enterprise_contact_id: otherContactItem.user_enterprise_contact_id
      }
      // 移除数组元素
      this.otherContactModal.enterpriseDetail.contact.splice(otherContactIndex, 1)

      try {
        const { data } = await clientApi.delEnterpriseOtherContactApi(param)
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 导航企业消费记录页面
     */
    navToClientExpenseRecordPage(record) {
      sessionStorage.setItem('clientInfoSession', JSON.stringify({ nickname: record.enterprise_name, user_id: record.user.user_id }))
      this.$router.push({ name: 'ClientExpenseRecordRoute' })
    },
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 90px;
    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
    .date-range-picker {
      margin-left: auto;
    }
  }
}

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 13px;
    .selected-title {
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.other-contact-modal {
  .contact-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
    .contact-left {
      margin-right: 10px;
    }
    .contact-middle {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .otherContact-item {
        margin-right: 20px;
      }
    }
  }
}

.addOther-contact-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    &:last-child { margin-bottom: 0; }
    .input-title {
      font-size: 14px;
      font-weight: 500;
      width: 60px;
    }
    .input {
      flex: 1;
    }
  }
}
</style>
