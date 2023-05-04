<template>
  <a-layout class="main">
    <a-layout-header class="header-module">
      <div class="back-wrap" @click="$router.back()">
        <a-icon type="arrow-left" />
        <span style="margin-left: 6px;">定时开通优选会员：{{ pagination.total }}</span>
      </div>

      <a-button type="primary" style="margin-left: auto;" @click="openOpenBestModal">定时开通优选会员</a-button>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getClockOpenBestList(pagination.current)">刷新</a-button>
      </div>

      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.optimization_warehouse_id)"
        bordered
      >
        <!-- 律师 -->
        <a-table-column key="nickname" title="律师" align="center" :width="220">
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

        <!-- 开通套餐 -->
        <a-table-column title="开通套餐" align="center" :width="220">
          <template slot-scope="record">
            <div class="column-menu-wrap" :style="{ color:'#666' }">
              <div>套餐类型: {{ record.optimization_plan.name || '' }}</div>
              <div>订单次数: {{ 0 }}/{{ record.total_num + record.add_num }}</div>
            </div>
          </template>
        </a-table-column>

        <!-- 定时开始时间 -->
        <a-table-column dataIndex="open_time" title="定时开始时间" align="center" />

        <!-- 套餐结束时间 -->
        <a-table-column dataIndex="end_time" title="结束时间" align="center" />

        <!-- 收益 -->
        <a-table-column dataIndex="price" title="收益" align="center" />

        <!-- 操作人员 -->
        <a-table-column dataIndex="admin.nickname" title="操作人员" align="center" />

        <!-- 操作时间 -->
        <a-table-column dataIndex="created_at" title="操作时间" align="center" />

        <!-- 状态 -->
        <a-table-column title="状态" align="center">
          <template slot-scope="record">
            <span v-if="record.status === 1" style="color: #e6a23c;">{{ record.status_txt }}</span>
            <span v-else-if="record.status === 2" style="color: #41b583;">{{ record.status_txt }}</span>
            <span v-else>{{ record.status_txt }}</span>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <template v-if="record.status == 1">
              <a-button type="link" size="small" style="margin-right: 6px;" @click="openEditModal(record)">编辑</a-button>
              <a-popconfirm title="是否确认要取消？" @confirm="cancelClockOpenBestVip(record)" >
                <a-button type="link" size="small" style="color: #f56c6c;">取消</a-button>
              </a-popconfirm>
            </template>
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
      title="定时开通优选会员"
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

        <!-- 套餐类型 -->
        <div class="open-form-item">
          <span class="form-key">套餐类型:</span>
          <a-select style="width: 192px;" v-model="openBestFormModal.optimization_plan_id" @change="onOpenFormBestVipChangeEvt">
            <a-select-option v-for="sItem in mealSelectList.slice(1)" :value="sItem.value" :key="sItem.value">
              {{ sItem.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 预计收益 -->
        <div class="open-form-item">
          <span class="form-key">预计收益:</span>
          <a-input allow-clear placeholder="预计收益" v-model="openBestFormModal.price" style="width: 192px" />
        </div>
        <!-- 订单次数 -->
        <div class="open-form-item">
          <span class="form-key">订单次数:</span>
          <a-input allow-clear placeholder="订单次数" v-model="openBestFormModal.total_num" style="width: 192px" />
        </div>
        <!-- 赠送订单次数 -->
        <div class="open-form-item">
          <span class="form-key">赠送订单次数:</span>
          <a-input allow-clear placeholder="赠送订单次数(选填)" v-model="openBestFormModal.add_num" style="width: 192px" />
        </div>
        <!-- 开始时间 -->
        <div class="open-form-item">
          <span class="form-key">套餐开始时间:</span>
          <a-date-picker v-model="openBestFormModal.start_time" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" />
        </div>
        <!-- 结束时间 -->
        <div class="open-form-item">
          <span class="form-key">套餐结束时间:</span>
          <a-date-picker v-model="openBestFormModal.end_time" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" />
        </div>
      </div>
    </a-modal>

    <!-- 编辑 modal -->
    <a-modal
      v-model="editModal.isShowEditModal"
      title="更新开通时间"
      :width="400"
      :afterClose="() => { editModal.open_time = ''; editModal.lawyer = {}; }"
      destroyOnClose
      @ok="onEditModalOkEvt"
    >
      <div class="open-form-modal">
        <!-- 已选律师 -->
        <div class="open-form-item">
          <span class="form-key">已选律师:</span>
          <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 6px;" :src="editModal.lawyer.avatar" />
          <div class="">
            <div>{{ editModal.lawyer.nickname }}</div>
          </div>
        </div>
        <!-- 套餐开始时间 -->
        <div class="open-form-item">
          <span class="form-key">套餐开始时间:</span>
          <a-date-picker v-model="editModal.open_time" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" />
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import UserVipCell from '@/components/User/UserVipCell'
import moment from 'moment'
import * as lawyerApi from '@/api/lawyer'

// 开通优选 选择律师 modal
const OPENBEST_MODAL = {
  isShowOpenLawyerModal: false,
  waitOpenBestLawyerList: [], // 待开通优选律师列表
  page: 1,
  total: 0,
  isSpinning: false, // 是否真正加载中
  searchLawyerKeyword: '', // 搜索律师关键字
  activeLawyer: {}, // 选中的律师 id
}

// 开通优选套餐 表单 modal
const OPENBEST_FORM_MODAL = {
  isShowOpenFormModal: false,
  lawyer: {}, // 律师 信息
  optimization_plan_id: '', // 优选会员套餐 id
  price: '', // 预计收益
  total_num: '', // 订单次数
  add_num: '0', // 赠送数量
  start_time: '', // 开始时间
  end_time: '', // 结束时间
}

// 编辑 modal
const EDIT_MODAL = {
  isShowEditModal: false,
  open_optimization_task_id: 0,
  lawyer: {}, // 律师 信息
  open_time: '',
}

export default {
  name: 'LawyerBestClockPage',
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
          this._getClockOpenBestList(page)
          this.pagination.current = page
        },
      },

      mealSelectList: [{ label: '全部', value: '' }], // 开通套餐 select 列表

      openBestModal: { ...OPENBEST_MODAL }, // 开通优选律师 modal
      openBestFormModal: { ...OPENBEST_FORM_MODAL }, // 开通优选律师 modal
      editModal: { ...EDIT_MODAL }, // 编辑 modal
    }
  },
  created() {
     this._getBestLawyerMealList()
     this._getClockOpenBestList()
  },
  methods: {
    moment,

    /**
     * 获取优选律师开通套餐 列表
     */
     async _getBestLawyerMealList() {
       try {
         const { data: mealData } = await lawyerApi.getBestLawyerMealListApi()
         const serverMenuObj = { 1: '/月卡', 2: '/年卡', 3: '' }
         for (const mItem of mealData.data) {
           const selectOpt = { label: `${ mItem.name }${ serverMenuObj[mItem.version] }`, value: mItem.optimization_plan_id }
           this.mealSelectList.push(selectOpt)
         }
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取 定时开通优选会员 列表
     */
     async _getClockOpenBestList(page = 1) {
       const param = {
        page,
        size: this.pagination.pageSize,
       }
       
       this.tableDataLoading = true

       try {
         const { data: labelListData } = await lawyerApi.getClockOpenBestListApi(param)
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
      const param = { page: this.openBestModal.page, size: 20, type: 1, nickname: this.openBestModal.searchLawyerKeyword.trim() }
      try {
        const { data: waitOpenBestData } = await lawyerApi.getWaitOpenBestLawyerListApi(param)
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
          const param = { page: this.openBestModal.page, size: 20, type: 1 }
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
     * 获取优先会员详情
     */
    async onOpenFormBestVipChangeEvt(bestVipId) {
      const param = { optimization_plan_id: bestVipId }

      try {
        const { data: bestVipData } = await lawyerApi.getBestVipDetailApi(param)
        this.openBestFormModal.total_num = `${ bestVipData.num * bestVipData.day }`
        this.openBestFormModal.price = `${ bestVipData.price }`
        this.openBestFormModal.end_time = moment().add(bestVipData.day, 'days').endOf('day')
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
      if (!openBestFormModal.lawyer.user_id) return this.$message.warning('请选择律师')
      if (!openBestFormModal.optimization_plan_id) return this.$message.warning('请选择开通优选套餐')
      if (!openBestFormModal.start_time) return this.$message.warning('请选择开通时间')
      
      const param = {
        optimization_plan_id: openBestFormModal.optimization_plan_id,
        user_id: openBestFormModal.lawyer.user_id,
        price: openBestFormModal.price.trim(),
        total_num: openBestFormModal.total_num.trim(),
        add_num: openBestFormModal.add_num.trim(),
        open_time: moment(openBestFormModal.start_time).format('YYYY-MM-DD HH:mm:ss'),
        end_time: moment(openBestFormModal.end_time).format('YYYY-MM-DD HH:mm:ss'),
      }
      this.openBestFormModal.isShowOpenFormModal = false

      try {
        await lawyerApi.postClockOpenBestVipApi(param)
        this._getClockOpenBestList()
        this.$notification.success({ message: '定时开通成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 取消 定时开通优选会员
     */
    async cancelClockOpenBestVip(record) {
      const param = { open_optimization_task_id: record.open_optimization_task_id, }

      try {
        await lawyerApi.cancelClockOpenBestVipApi(param)
        this._getClockOpenBestList(this.pagination.current)
        this.$notification.success({ message: '取消成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开编辑 modal
     */
    openEditModal(record) {
      this.editModal.lawyer = record.user
      this.editModal.open_optimization_task_id = record.open_optimization_task_id
      this.editModal.open_time = record.open_time
      this.editModal.isShowEditModal = true
    },

    /**
     * 监听编辑 modal ok 事件
     */
    async onEditModalOkEvt() {
      const { editModal } = this
      const param = { open_optimization_task_id: editModal.open_optimization_task_id, open_time: moment(editModal.open_time).format('YYYY-MM-DD HH:mm:ss') }
      this.editModal.isShowEditModal = false

      try {
        await lawyerApi.editClockOpenBestVipApi(param)
        this._getClockOpenBestList(this.pagination.current)
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    }
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
    margin-bottom: 12px;
  }
}

.open-modal {
  .open-body {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    max-height: 300px;
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
