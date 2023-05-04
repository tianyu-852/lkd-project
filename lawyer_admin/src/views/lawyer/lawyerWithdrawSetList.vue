<template>
  <a-layout class="main">
    <a-layout-header class="header-module">
      <span class="focus-text">提现设置列表：{{ pagination.total }}</span>
      <a-button type="primary" style="margin-left: auto;" @click="withdrawSetModal.isShowWithdrawSetModal = true">添加手续费比例</a-button>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getWithdrawSetList(pagination.current)">刷新</a-button>
      </div>

      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.config_list_type_id)"
        bordered
      >

        <!-- ID -->
        <a-table-column dataIndex="config_list_type_id" title="ID" align="center" />
      
        <!-- 手续费 -->
        <a-table-column title="提现手续费" align="center">
          <template slot-scope="record">
            <span>{{ Number(record.value) * 100 }}%</span>
          </template>
        </a-table-column>

        <!-- 律师 -->
        <a-table-column title="律师" align="center">
          <template slot-scope="record">
            <div>
              <a-tag v-for="(lItem, lIndex) in record.lawyerList" :key="lIndex" closable @close="removeLawyer(lItem)">{{ lItem.user.nickname }}</a-tag>
            </div>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="link" size="small" style="margin-right: 6px;" @click="openOpenBestModal(record)">添加律师</a-button>
            <!-- <a-popconfirm title="是否确认要移除？" @confirm="delSpecialLawyer(record)">
              <a-button type="link" size="small" style="color: #f56c6c;">移除</a-button>
            </a-popconfirm> -->
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 开通优选 选择律师 modal -->
    <a-modal
      v-model="openBestModal.isShowOpenLawyerModal"
      :width="600"
      destroyOnClose
      :afterClose="() => { openBestModal.page = 1; }"
      @ok="onOpenModalOkEvt"
    >
      <div slot="title">
        <span style="font-size: 18px; font-wight: 500; margin-right: 8px;">选择律师</span>
        <a-input allow-clear placeholder="搜索姓名/手机号" v-model="openBestModal.searchLawyerKeyword" @keyup.enter="openOpenBestModal" style="margin: 0 5px; width: 180px" />
        <a-button type="primary" @click="openOpenBestModal">搜索</a-button>
      </div>
      <div class="open-modal">
        <a-spin :spinning="openBestModal.isSpinning">
          <div class="open-body" @scroll="onOpenModalScrollEvt">
            <div v-for="(cItem, cIndex) in openBestModal.waitOpenBestLawyerList" :key="cIndex" class="checked-item" @click="openBestModal.activeLawyer = cItem">
              <img :src="cItem.avatar" style="width: 30px; height: 30px; margin-right: 6px;" />
              <div>
                <div>{{ cItem.nickname }}</div>
                <div style="font-size: 14px; color: #999;">{{ cItem.mobile }}</div>
              </div>
              <img v-if="cItem.user_id === openBestModal.activeLawyer.user_id" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
              <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
            </div>
          </div>
        </a-spin>
      </div>
    </a-modal>

    <!-- 提现 表单 modal -->
    <a-modal
      v-model="withdrawSetModal.isShowWithdrawSetModal"
      :width="450"
      title="添加提现手续费比例"
      destroyOnClose
      :afterClose="onWithdrawSetModalAfterClose"
      @ok="onWithdrawSetModalOkEvt"
    >
      <div class="open-form-modal">
        <!--  -->
        <div class="open-form-item">
          <span class="form-key">提现比列:</span>
          <a-input allow-clear placeholder="提现比例" v-model="withdrawSetModal.withdraw_ratio" style="width: 192px" />
        </div>
      </div>
    </a-modal>

    <!-- 开通套餐 表单 modal -->
    <a-modal
      v-model="openBestFormModal.isShowOpenFormModal"
      :width="450"
      title="添加律师"
      destroyOnClose
      :afterClose="onOpenBestFormModalAfterClose"
      @ok="onOpenFormModalOkEvt"
    >
      <div class="open-form-modal">
        <!-- 已选律师 -->
        <div class="open-form-item">
          <span class="form-key">已选律师:</span>
          <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 6px;" :src="openBestFormModal.lawyer.avatar" />
          <div class="">
            <div>{{ openBestFormModal.lawyer.nickname }}</div>
            <div style="font-size: 15px; color: #999;">{{ openBestFormModal.lawyer.mobile }}</div>
          </div>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import UserVipCell from '@/components/User/UserVipCell'
import moment from 'moment'
import * as lawyerApi from '@/api/lawyer'

// 选择律师 modal
const OPENBEST_MODAL = {
  isShowOpenLawyerModal: false,
  waitOpenBestLawyerList: [], // 待开通优选律师列表
  page: 1,
  total: 0,
  isSpinning: false, // 是否真正加载中
  searchLawyerKeyword: '', // 搜索律师关键字
  activeLawyer: {}, // 选中的律师 id
}

// 设置律师 表单 modal
const OPENBEST_FORM_MODAL = {
  isShowOpenFormModal: false,
  lawyer: {}, // 律师 信息
  withdrawTypeId: '', // 提现类型 id
}


// 设置律师 表单 modal
const WITHDRAW_SET_MODAL = {
  isShowWithdrawSetModal: false,

  withdraw_ratio: '', // 提现比列
}

export default {
  name: 'LawyerWithdrawSetPage',
  components: { UserVipCell },
  data() {
    return {
      tableDataLoading: false,
      tableDataList: [],
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getWithdrawSetList(page)
          this.pagination.current = page
        },
      },

      openBestModal: { ...OPENBEST_MODAL }, // 开通优选律师 modal
      openBestFormModal: { ...OPENBEST_FORM_MODAL }, // 开通优选律师 modal
      withdrawSetModal: { ...WITHDRAW_SET_MODAL }, // 提箱设置 modal
    }
  },
  created() {
     this._getWithdrawSetList()
  },
  methods: {
    moment,

    /**
     * 获取 特殊律师 列表
     */
     async _getWithdrawSetList(page = 1) {
       const param = { cate: 'cost' }
       
       this.tableDataLoading = true

       try {
         const { data: labelListData } = await lawyerApi.getLawyerWithdrawSetListApi(param)
         this.tableDataLoading = false

         this.tableDataList = labelListData.map(item => {
            item.lawyerList = []
            return item
         })

         this.tableDataList.forEach((item, index) => {
           console.log(item)
           this._getLawyerList(item.config_list_type_id, index)
         })
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 获取律师列表
     */
     async _getLawyerList(configTypeId, tableIndex) {
       const param = {
        page: 1,
        size: 300,
        type: configTypeId
       }
       
       try {
         const { data: labelListData } = await lawyerApi.getLawyerSpecialIncomeSetListApi(param)
         this.tableDataList[tableIndex].lawyerList = labelListData.data
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 移除律师
     */
     async removeLawyer(lawyerItem) {
      const param = { config_list_id: lawyerItem.config_list_id }

      try {
        await lawyerApi.delLawyerSpecialIncomeSetApi(param)
        this._getWithdrawSetList()
        this.$notification.success({ message: '移除成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开开通优选 modal
     */
    async openOpenBestModal(record) {
      if (this.openBestModal.searchLawyerKeyword.trim()) this.openBestModal.page = 1
      const param = { page: this.openBestModal.page, size: 20, is_login_lawyer_app: -1, active_sort: -1, register_sort: 0, search: this.openBestModal.searchLawyerKeyword.trim() }
      try {
        const { data: waitOpenBestData } = await lawyerApi.getLawyerPage(param)
        if (this.openBestModal.page === 1) this.openBestModal.waitOpenBestLawyerList = []
        
        this.openBestModal.waitOpenBestLawyerList.push(...waitOpenBestData.data)
        this.openBestModal.total = waitOpenBestData.total
        this.openBestModal.isShowOpenLawyerModal = true

        // 提现类型 id
        if (record.config_list_type_id) {
          this.openBestFormModal.withdrawTypeId = record.config_list_type_id
        }
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听 开通律师列表 modal scroll 事件
     */
    async onOpenModalScrollEvt(event) {
      const openModalScrollTop = event.target.scrollTop
      const openModalClientHeight = event.target.clientHeight
      const openModalScrollHeight = event.target.scrollHeight

      if (openModalScrollTop + openModalClientHeight >= openModalScrollHeight - 50) {
          if (this.openBestModal.waitOpenBestLawyerList.length >= this.openBestModal.total) return
          if (this.openBestModal.isSpinning) return

          ++this.openBestModal.page
          const param = { page: this.openBestModal.page, size: 20, is_login_lawyer_app: -1, active_sort: -1, register_sort: 0, search: this.openBestModal.searchLawyerKeyword.trim() }
          this.openBestModal.isSpinning = true
          try {
            const { data: waitOpenBestData } = await lawyerApi.getLawyerPage(param)
            this.openBestModal.waitOpenBestLawyerList.push(...waitOpenBestData.data)
            this.openBestModal.total = waitOpenBestData.total
            this.openBestModal.isSpinning = false
          } catch (error) {
            this.openBestModal.isSpinning = false
            console.log(error)
          }
       }
    },

    /**
     * 监听开通优选律师列表 modal ok 事件
     */
    onOpenModalOkEvt() {
      const { openBestModal } = this
      if (!openBestModal.activeLawyer.user_id) return this.$message.warning('请选择开通律师')

      this.openBestFormModal.lawyer = openBestModal.activeLawyer
      this.openBestModal.isShowOpenLawyerModal = false
      this.openBestFormModal.isShowOpenFormModal = true
    },

    /**
     * 监听提现比例设置 modal 关闭事件
     */
    onWithdrawSetModalAfterClose() {
      this.withdrawSetModal = Object.assign({}, WITHDRAW_SET_MODAL)
    },

    /**
     * 监听开通优选表单 modal ok 事件
     */
    async onWithdrawSetModalOkEvt() {
      if (!this.withdrawSetModal.withdraw_ratio.trim()) return this.$message.warning('请填写提现比例')
      
      const param = {
        name: '手续费',
        cate: 'cost',
        value: Number(this.withdrawSetModal.withdraw_ratio.trim()) / 100
      }
      this.withdrawSetModal.isShowWithdrawSetModal = false

      try {
        await lawyerApi.postLawyerWithdrawSetApi(param)
        // this._getWithdrawSetList()
        this.$notification.success({ message: '添加成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听开通优选表单 Modal 完全关闭后的回调
     */
    onOpenBestFormModalAfterClose() {
      this.openBestFormModal = Object.assign({}, OPENBEST_FORM_MODAL)
    },

    /**
     * 监听开通优选表单 modal ok 事件
     */
    async onOpenFormModalOkEvt() {
      const { openBestFormModal } = this
      if (!this.openBestFormModal.withdrawTypeId) return this.$message.warning('请重新操作')
      if (!openBestFormModal.lawyer.user_id) return this.$message.warning('请选择律师')
      
      const param = {
        type: this.openBestFormModal.withdrawTypeId,
        user_id: openBestFormModal.lawyer.user_id,
      }
      this.openBestFormModal.isShowOpenFormModal = false

      try {
        await lawyerApi.postLawyerSpecialIncomeSetApi(param)
        this._getWithdrawSetList()
        this.$notification.success({ message: '添加成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
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
  .focus-text {
    margin-right: 10px;
    font-size: 20px;
    font-weight: 800;
    line-height: 28px;
    color: #222222;
  }
}

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 12px;
  }
}

.open-modal {
  .open-body {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    max-height: 250px;
    overflow: auto;
    .checked-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      height: 50px;
      border-radius: 6px;
      padding: 0 4px;
      border: 1px solid #ccc;
      cursor: pointer;
      .checkbox-img {
        width: 18px;
        height: 18px;
        margin-right: 6px;
        margin-left: auto;
      }
    }
  }
}

.open-form-modal {
  .open-form-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    &:last-child { margin-bottom: 0; }
    .form-key {
      min-width: 100px;
      font-size: 14px;
      font-weight: 600;
    }
  }
}
</style>
