
<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">法务总数：{{ pagination.total }}</span>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getLawServeLawManagerList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.admin_id)"
        bordered
      >
        <!-- 法务管家 -->
        <a-table-column dataIndex="nickname" title="法务管家" align="center" />

        <!-- 后台账号 -->
        <a-table-column dataIndex="account" title="后台账号" align="center" />

        <!-- 后台账号 -->
        <a-table-column dataIndex="login_at" title="最后登录" align="center" />
        
        <!-- 状态 -->
        <!-- <a-table-column title="状态" align="center">
          <template slot-scope="record">
            <div class="column-status">
              <a-popconfirm v-if="!record.status" title="请确认是否禁用?" @confirm="confirmDelLawManager(record)">
                <a-button type="link" style="color: #ff4d4f; padding: 0;">禁用</a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-table-column> -->

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="190px">
          <template slot-scope="record">
            <a-button type="link" style="padding: 0; margin-right: 5px;" @click="openRoleEditModal(record)">权限管理</a-button>
            <a-popconfirm title="请确认是否删除该法务?" ok-text="删除" @confirm="confirmDelLawManager(record)">
              <a-button type="link" style="color: #ff4d4f; padding: 0;">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 权限 modal -->
    <a-modal
      v-model="roleModal.isShowRoleModal"
      title="权限管理"
      :width="450"
      :afterClose="onLawManagerRoleModalAfterClose"
      destroyOnClose
      @ok="onRoleModalOkEvt"
    >
      <div class="role-modal">
        <div class="role-item" @click="roleModal.editPermission = roleModal.editPermission = 1">
          <img v-if="roleModal.editPermission === 1" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
          <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
          <span>编辑全部信息</span>
        </div>
        <div class="role-item" @click="roleModal.editPermission = roleModal.editPermission = 2">
          <img v-if="roleModal.editPermission === 2" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
          <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
          <span>仅编辑关联企业、使用人</span>
        </div>
        <div class="role-item" @click="roleModal.addPermission = roleModal.addPermission === 1 ? 0 : 1">
          <img v-if="roleModal.addPermission === 1" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
          <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
          <span>录入企业信息</span>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import * as lawServeApi from '@/api/lawServeApi'
import * as permissionApi from '@/api/permissions'

import moment from 'moment'

// 法务管家权限人员信息
const ROLE_MODAL = {
  isShowRoleModal: false, // 是否显示角色权限 modal

  putRolelId: 0, // 待更新角色 id
  editPermission: 0, // 编辑权限
  addPermission: 0, // 录入权限
}

export default {
  name: 'EnterpriseServeRole',
  data() {
    return {
      tableDataList: [], // table 列表
      tableDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getLawServeLawManagerList(page)
          this.pagination.current = page
        },
      },

      roleModal: Object.assign({}, ROLE_MODAL), // 权限 modal 信息
    }
  },
  created() {
    this._getLawServeLawManagerList()
  },
  methods: {
    /**
     * 获取企业套餐法务管家列表
     */
     async _getLawServeLawManagerList(page = 1) {
       const param = { page, size: this.pagination.pageSize }
       this.tableDataLoading = true

       try {
         const { data: labelListData } = await lawServeApi.getLawServeLawManagerListApi(param)
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
     * 确认删除法务管家
     */
    async confirmDelLawManager(record) {
      try {
         const { data: labelListData } = await permissionApi.deleteAdminPage(record.admin_id)
         this._getLawServeLawManagerList(this.pagination.current)
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 打开权限编辑 modal
     */
    openRoleEditModal(record) {
      // 待更新角色 id
      this.roleModal.putRolelId = record.admin_id
      this.roleModal.editPermission = record.enterprise_auth.edit
      this.roleModal.addPermission = record.enterprise_auth.add
      
      this.roleModal.isShowRoleModal = true
    },

    /**
     * 监听法务管家角色 Modal 完全关闭后的回调
     */
    onLawManagerRoleModalAfterClose() {
      this.roleModal = Object.assign({}, ROLE_MODAL)
    },

    /**
     * 监听权限 modal 确定事件
     */
    async onRoleModalOkEvt() {
      const { roleModal } = this
      const param = {
        admin_id: roleModal.putRolelId,
        edit: roleModal.editPermission,
        add: roleModal.addPermission,
      }
      this.roleModal.isShowRoleModal = false

      try {
        const { data } = await lawServeApi.updateLawServeLawManagerPermissionApi(param)
        this._getLawServeLawManagerList(this.pagination.current)
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  .role-item {
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    .checkbox-img {
      width: 18px;
      height: 18px;
      margin-right: 6px;
    }
  }
}
</style>
