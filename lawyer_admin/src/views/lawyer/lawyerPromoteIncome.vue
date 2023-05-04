<template>
  <a-layout class="main">
    <a-layout-header class="header-module">
      <div class="back-wrap" @click="$router.back()">
        <a-icon type="arrow-left" />
      </div>
      <img :src="lawyerInfo.avatar" style="width: 40px; height: 40px; margin-right: 6px;" />
      <span>{{ lawyerInfo.nickname }}</span>
      <span style="margin-left: 6px;">推广总收益：￥{{ totalIncome }}</span>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getLawyerPromoteIncomeDetailList(pagination.current)">刷新</a-button>
      </div>

      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.earnings_id)"
        bordered
      >
        <!-- 用户 -->
        <a-table-column key="nickname" title="用户" align="center" :width="220">
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
        <a-table-column title="套餐" align="center" :width="220">
          <template slot-scope="record">
            <div class="column-menu-wrap" :style="{ color:'#666' }">
              <div>{{ record.husbandmanEnterpriseVip.price }}/{{ record.husbandmanEnterpriseVip.title }}</div>
            </div>
          </template>
        </a-table-column>

        <!-- 收益 -->
        <a-table-column title="收益" align="center" :width="220">
          <template slot-scope="record">
            <div class="column-menu-wrap">
              <div>{{ record.status === 3 ? `${ record.earnings }` : '/' }}</div>
            </div>
          </template>
        </a-table-column>

        <!-- 成交时间 -->
        <a-table-column dataIndex="pay_time" title="成交时间" align="center" />

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
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="link" style="margin-right: 10px; padding: 0;" @click="openEditModal(record)">更新法务</a-button>
            <a-button type="link" style="margin-right: 10px; padding: 0;" @click="navToOrderdetail(record)">发单详情</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 编辑 modal -->
    <a-modal
      v-model="editModal.isShowEditModal"
      title="更新法务管家"
      :width="400"
      :afterClose="() => { editModal.earnings_id = ''; editModal.legal_user_id = ''; }"
      destroyOnClose
      @ok="onEditModalOkEvt"
    >
      <div class="open-form-modal">
        <!-- 已选律师 -->
        <div class="open-form-item">
          <span class="form-key">已选用户:</span>
          <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 6px;" :src="editModal.user.avatar" />
          <div class="">
            <div>{{ editModal.user.nickname }}</div>
          </div>
        </div>
        <!-- 套餐开始时间 -->
        <div class="open-form-item">
          <span class="form-key">法务管家:</span>
          <a-select style="width: 380px;" v-model="editModal.legal_user_id" placeholder="请选择法律管家" allowClear>
            <a-select-option v-for="(lItem, lIndex) in lawManagerSelectList" :value="lItem.value" :key="lIndex">
              {{ lItem.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import UserVipCell from '@/components/User/UserVipCell'
import moment from 'moment'
import * as lawyerApi from '@/api/lawyer'
import * as lawManagerApi from '@/api/lawManagerApi'

// 编辑 modal
const EDIT_MODAL = {
  isShowEditModal: false,
  user: {}, 
  earnings_id: 0,
  legal_user_id: '', // 法务 id
}

export default {
  name: 'LawyerPromoteIncomePage',
  components: { UserVipCell },
  data() {
    return {
      lawyerInfo: {},

      totalIncome: '0', // 总收益 
      tableDataLoading: false,
      tableDataList: [],
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawyerPromoteIncomeDetailList(page)
          this.pagination.current = page
        },
      },

      lawManagerSelectList: [], // 法务管家 select 列表
      editModal: { ...EDIT_MODAL }, // 编辑 modal
    }
  },
  created() {
    this.lawyerInfo = JSON.parse(sessionStorage.getItem('lawyerInfoSession'))

    this._getLawManagerList()
    this._getLawyerPromoteIncomeDetailList()
  },
  methods: {
    moment,

    /**
     * 获取法务管家列表
     */
     async _getLawManagerList() {
      const param = { page: 1, size: 300, source_type: 4 }
       try {
         const { data: lawManagerListData } = await lawManagerApi.getLawManagerListApi(param)

         const _tempSelectList = []
         for (const lItem of lawManagerListData.data) {
           const selectOpt = { label: lItem.name, value: lItem.user.user_id }
           _tempSelectList.push(selectOpt)
         }
         this.lawManagerSelectList = _tempSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取推广大使 收益详情列表
     */
     async _getLawyerPromoteIncomeDetailList(page = 1) {
       const param = {
        page,
        size: this.pagination.pageSize,
        lawyer_user_id: this.lawyerInfo.user_id,
       }
       this.tableDataLoading = true

       try {
         const { data: labelListData } = await lawyerApi.getLawyerPromoteIncomeDetailApi(param)
         this.tableDataList = labelListData.data.data
         this.pagination.total = labelListData.data.total
         this.pagination.current = page
         // 总收益
         this.totalIncome = labelListData.total_earnings
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 进入订单详情
     */
    navToOrderdetail(record) {
      const enterpriseId = String(record.user.user_id)
      this.$router.push({ name: 'clientOrderDetail', query: { enterpriseId } })
    },

    /**
     * 打开编辑 modal
     */
    openEditModal(record) {
      this.editModal.user = record.user
      this.editModal.earnings_id = record.earnings_id
      this.editModal.isShowEditModal = true
    },

    /**
     * 监听编辑 modal ok 事件
     */
    async onEditModalOkEvt() {
      const { editModal } = this
      const param = { earnings_id: editModal.earnings_id, legal_user_id: editModal.legal_user_id }
      this.editModal.isShowEditModal = false

      try {
        await lawyerApi.updatePromoteIncomeLawManagerApi(param)
        this._getLawyerPromoteIncomeDetailList(this.pagination.current)
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
    padding-right: 20px;
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
