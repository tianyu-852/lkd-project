<template>
  <a-layout class="main">
    <a-layout-header class="header-module">
      <span class="focus-text">电话订单收益20元律师列表：{{ pagination.total }}</span>
      <a-button type="primary" style="margin-left: auto;" @click="openOpenBestModal">添加律师</a-button>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getSpecialLawyerList(pagination.current)">刷新</a-button>
      </div>

      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.config_list_id)"
        bordered
      >

        <!-- ID -->
        <a-table-column dataIndex="config_list_id" title="ID" align="center" />
      
        <!-- 律师 -->
        <a-table-column key="nickname" title="律师" align="center">
          <template slot-scope="record">
            <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
              <user-vip-cell
                :nickname="record.user.nickname"
                :avatar="record.user.avatar"
                :mobile="record.mobile"
                :user-id="String(record.user.user_id)"
                size="sm"
              />
            </div>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="link" size="small" style="margin-right: 6px;" @click="$router.push({ name: 'LawyerDetail', params: { userId: String(record.user.user_id) } })">律师详情</a-button>
            <a-popconfirm title="是否确认要移除？" @confirm="delSpecialLawyer(record)">
              <a-button type="link" size="small" style="color: #f56c6c;">移除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 开通优选 选择律师 modal -->
    <a-modal
      v-model="openBestModal.isShowOpenLawyerModal"
      :width="600"
      destroyOnClose
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

    <!-- 开通套餐 表单 modal -->
    <a-modal
      v-model="openBestFormModal.isShowOpenFormModal"
      :width="450"
      title="设置律师电话订单收益 20元"
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
}

export default {
  name: 'LawyerSpecialIncomeSetPage',
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
          this._getSpecialLawyerList(page)
          this.pagination.current = page
        },
      },

      openBestModal: { ...OPENBEST_MODAL }, // 开通优选律师 modal
      openBestFormModal: { ...OPENBEST_FORM_MODAL }, // 开通优选律师 modal
    }
  },
  created() {
     this._getSpecialLawyerList()
  },
  methods: {
    moment,

    /**
     * 获取 特殊律师 列表
     */
     async _getSpecialLawyerList(page = 1) {
       const param = {
        page,
        size: this.pagination.pageSize,
        type: 1
       }
       
       this.tableDataLoading = true

       try {
         const { data: labelListData } = await lawyerApi.getLawyerSpecialIncomeSetListApi(param)
         this.tableDataList = labelListData.data
         this.pagination.total = labelListData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 打开开通优选 modal
     */
    async openOpenBestModal() {
      if (this.openBestModal.searchLawyerKeyword.trim()) this.openBestModal.page = 1
      const param = { page: this.openBestModal.page, size: 20, is_login_lawyer_app: -1, active_sort: -1, register_sort: 0, search: this.openBestModal.searchLawyerKeyword.trim() }
      try {
        const { data: waitOpenBestData } = await lawyerApi.getLawyerPage(param)
        if (this.openBestModal.page === 1) this.openBestModal.waitOpenBestLawyerList = []

        this.openBestModal.waitOpenBestLawyerList.push(...waitOpenBestData.data)
        this.openBestModal.total = waitOpenBestData.total
        this.openBestModal.isShowOpenLawyerModal = true
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
            const { data: waitOpenBestData } = await lawyerApi.getWaitOpenBestLawyerListApi(param)
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
      if (!openBestFormModal.lawyer.user_id) return this.$message.warning('请选择律师')
      
      const param = {
        user_id: openBestFormModal.lawyer.user_id,
        type: 1,
      }
      this.openBestFormModal.isShowOpenFormModal = false

      try {
        await lawyerApi.postLawyerSpecialIncomeSetApi(param)
        this._getSpecialLawyerList()
        this.$notification.success({ message: '添加成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 移除律师
     */
    async delSpecialLawyer(record) {
      const param = { config_list_id: record.config_list_id }

      try {
        await lawyerApi.delLawyerSpecialIncomeSetApi(param)
        this._getSpecialLawyerList(this.pagination.current)
        this.$notification.success({ message: '移除成功', duration: 3 })
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
