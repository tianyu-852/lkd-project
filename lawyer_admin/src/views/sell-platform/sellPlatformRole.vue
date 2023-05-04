、<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">内部账号总数：{{ pagination.total }}</span>

      <a-button type="primary" style="margin: 0 10px" @click="openAddRoleModal">新增账号</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getSellPlatformUserList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.financial_legal_sales_relation_id)"
        bordered
      >
        <!-- id -->
        <a-table-column dataIndex="financial_legal_sales_relation_id" title="ID" align="center" />

        <!-- 创建时间 -->
        <a-table-column key="created_at" dataIndex="created_at" title="创建时间" align="center" />

        <!-- 用户姓名 -->
        <a-table-column dataIndex="name" title="用户姓名" align="center" />

        <!-- 用户手机号 -->
        <a-table-column dataIndex="mobile" title="手机号" align="center" />

        <!-- 性别 -->
        <a-table-column dataIndex="sex_text" title="性别" align="center" />

        <!-- 角色-->
        <a-table-column dataIndex="type_text" title="角色" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="link" style="padding: 0; margin-right: 10px;" @click="openPutLabelModal(record)">更新</a-button>
            <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToSellOpenOrderPage(record)">开单详情</a-button>
            <a-popconfirm title="请确认是否删除该用户?" ok-text="删除" cancel-text="取消" @confirm="delSellPlatformUser(record)">
              <a-button type="link" style="padding: 0; margin-right: 10px;">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 角色 modal -->
    <a-modal
      v-model="roleModalInfo.isShowRoleModal"
      :title="roleModalInfo.roleModalType ? '更新账号' : '新增账号'"
      :width="400"
      :afterClose="onRoleModalAfterClose"
      destroyOnClose
      @ok="onRoleModalOkEvt"
    >
      <div class="role-modal">
        <div class="input-item">
          <div class="input-title">用户姓名：</div>
          <a-input class="input" v-model="roleModalInfo.name" :maxLength="4" placeholder="请输入姓名" allowClear />
        </div>
        <div class="input-item">
          <div class="input-title">手机号码：</div>
          <a-input
            class="input"
            v-model="roleModalInfo.mobile"
            :maxLength="11"
            :disabled="roleModalInfo.disabledMobileInput"
            placeholder="请输入手机号码（销售端账号）"
            allowClear />
        </div>
        <div class="input-item">
          <div class="input-title">性别：</div>
          <a-radio-group name="radioGroup" v-model="roleModalInfo.sex" :default-value="roleModalInfo.sex">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="2">女</a-radio>
          </a-radio-group>
        </div>
        <div v-if="roleModalInfo.roleModalType === 0" class="input-item">
          <div class="input-title">角色：</div>
          <a-select style="width: 120px;" v-model="roleModalInfo.role">
            <a-select-option v-for="rItem in roleSelectList" :value="rItem.value" :key="rItem.value">
              {{ rItem.label }}
            </a-select-option>
          </a-select>
        </div>
        <div v-if="roleModalInfo.roleModalType === 0 && roleModalInfo.role === 1" class="input-item">
          <div class="input-title">指定主管：</div>
          <a-select style="width: 120px;" v-model="roleModalInfo.sellAdminerId" placeholder="请选择">
            <a-select-option v-for="aItem in sellAdminerSelectList" :value="aItem.value" :key="aItem.value">
              {{ aItem.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import * as sellPlatformApi from '@/api/sellPlatformApi'

// 角色信息
const ROLE_INFO = {
  name: '',
  sex: 1,
  mobile: '',
  role: 1,
  sellAdminerId: '', // 销售主管 id
  isShowRoleModal: false, // 是否显示角色 modal
  roleModalType: 0, // 角色 Modal 类型 0: 添加 1: 更新
  disabledMobileInput: false, // 是否禁用 手机号 input
  putSellPlatformUserId: '', // 更新用户 id
}

export default {
  name: 'SellPlatformRole',
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
          this._getSellPlatformUserList(page)
          this.pagination.current = page
        },
      },
      
      roleModalInfo: Object.assign({}, ROLE_INFO), // 角色 modal 信息
      roleSelectList: [{ label: '销售专员', value: 1 }, { label: '销售主管', value: 2 }, { label: '法务', value: 3 }, { label: '财务', value: 4 } ], // 角色 select 列表,
      sellAdminerSelectList: [], // 销售主管 select 列表
    }
  },
  created() {
    this._getSellPlatformUserList()
    this._getSellPlatformSellAdminerListApi()
  },
  methods: {
    /**
     * 获取销售端用户列表
     */
     async _getSellPlatformUserList(page = 1) {
       const param = { page, size: this.pagination.pageSize }

       try {
         const { data: sellPlatformUserData } = await sellPlatformApi.getSellPlatformUserListApi(param)
         this.tabelDataList = sellPlatformUserData.data
         this.pagination.total = sellPlatformUserData.total
         this.pagination.current = page
         this.tabelDataLoading = false
       } catch (error) {
         this.tabelDataLoading = false
         console.log(error)
       }
    },

    /**
     * 获取销售主管列表
     */
     async _getSellPlatformSellAdminerListApi(page = 1) {
       const param = { page, is_leader: 1 }

       try {
         const { data: sellAdminerData } = await sellPlatformApi.getSellPlatformSellAdminerListApi(param)
         
         const tempSelectList = []
         // 销售主管账号列表
         for (const dItem of sellAdminerData.data) {
           const selectOpt = {
            label: dItem.name,
            value: dItem.customer_id,
           }
           tempSelectList.push(selectOpt)
         }

         this.sellAdminerSelectList = tempSelectList
       } catch (error) {
         this.tabelDataLoading = false
         console.log(error)
       }
    },

    /**
     * 打开「添加模式」标签 modal
     */
    openAddRoleModal() {
      this.roleModalInfo.roleModalType = 0 // 添加模式
      this.roleModalInfo = Object.assign({}, ROLE_INFO)
      this.roleModalInfo.isShowRoleModal = true
    },

    /**
     * 打开「更新模式」标签 modal
     */
    async openPutLabelModal(record) {
      this.roleModalInfo.roleModalType = 1 // 更新模式
      this.roleModalInfo.name = record.name
      this.roleModalInfo.mobile = record.mobile
      this.roleModalInfo.sex = record.sex
      this.roleModalInfo.disabledMobileInput = true
      this.roleModalInfo.putSellPlatformUserId = record.financial_legal_sales_relation_id // 待更新用户 id
      this.roleModalInfo.isShowRoleModal = true
    },

    /**
     * 角色 Modal 完全关闭后的回调
     */
    onRoleModalAfterClose() {
      this.roleModalInfo = Object.assign({}, ROLE_INFO)
    },

    /**
     * 监听标签 modal ok 事件
     */
    onRoleModalOkEvt(event) {
      const { roleModalInfo } = this
      const roleModalType = roleModalInfo.roleModalType
      if (!roleModalInfo.name.trim()) return this.$message.warning('请输入姓名')
      if (!roleModalInfo.mobile.trim()) return this.$message.warning('请输入手机号码')
      // 角色 = 销售专员
      if (roleModalInfo.roleModalType === 0 && roleModalInfo.role === 1 && !roleModalInfo.sellAdminerId) return this.$message.warning('请指定销售主管')
      
      this.roleModalInfo.isShowRoleModal = false
      
      // roleModalType === 1 ? 更新 : 添加
      roleModalType === 1 ? this._putSellPlatformUser(roleModalInfo) : this._addSellPlatformUser(roleModalInfo)
    },

    /**
     * 添加销售端用户
     */
     async _addSellPlatformUser(roleModalInfo) {
       const param = {
         name: roleModalInfo.name.trim(),
         mobile: roleModalInfo.mobile.trim(),
         sex: roleModalInfo.sex,
       }

       // 销售专员
       if (roleModalInfo.role === 1) {
         param.type = 1
         param.customer_id = roleModalInfo.sellAdminerId // 销售主管 id
       }
       // 销售主管
       if (roleModalInfo.role === 2) {
         param.type = 1
         param.is_set_leader = 1
       }
       // 法务
       if (roleModalInfo.role === 3) param.type = 2
       // 财务
       if (roleModalInfo.role === 4) param.type = 3

       console.log(param)

       try {
         const { data } = await sellPlatformApi.postAddSellPlatformUserApi(param)
         this._getSellPlatformUserList()
         this.$notification.success({ message: '添加成功', duration: 3 })
       } catch (error) {
         console.log(error)
       }
     },


    /**
     * 更新标签
     */
    async _putSellPlatformUser(roleModalInfo) {
      const param = {
        financial_legal_sales_relation_id: roleModalInfo.putSellPlatformUserId,
        name: roleModalInfo.name.trim(),
        sex: roleModalInfo.sex,
      }

      try {
        const { data } = await sellPlatformApi.putSellPlatformUserApi(param)
        this._getSellPlatformUserList(this.pagination.current)
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 删除销售
     */
    async delSellPlatformUser(sellUserRecord) {
      const { financial_legal_sales_relation_id } = sellUserRecord
      if (!financial_legal_sales_relation_id) return

      try {
        const { data } = await sellPlatformApi.delSellPlatformUserApi({ financial_legal_sales_relation_id })
        // 更新当页数据
        this._getSellPlatformUserList(this.pagination.current)
        this.$notification.success({ message: '删除成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 进入加盟商销售列表
     */
    navToSellOpenOrderPage(record) {
      const sellUserId = String(record.user_id)
      this.$router.push({ name: 'sellPlatformOpenOrder', params: { sellUserId } })
    },
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90px;
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
    margin-bottom: 13px;
  }
}

.role-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .input-title {
      font-size: 14px;
      font-weight: 500;
      min-width: 74px;
    }
    .input {
      flex: 1;
    }
  }
}
</style>
