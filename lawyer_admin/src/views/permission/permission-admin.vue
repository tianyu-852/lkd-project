<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">后台账号：{{ pagination.total }}</span>

      <a-input-search placeholder="请输入用户名称/账号" style="width: 200px" @search="onSearch" />

      <a-button type="primary" style="margin-left: auto" @click="addHouTaiAccountModal.isShowAddHouTaiModal = true">添加账号</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getAdminAccountList(pagination.current)">刷新</a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="assetsData"
        bordered
        :pagination="pagination"
        :rowKey="(record) => `${ record.admin_id }`"
        :loading="loading"
      >
        <div slot="nickname" slot-scope="text, record" class="userDiv">
          <div class="imgUser">
            <img :src="record.avatar" class="imgUser" />
          </div>
          <div>{{ text }} <br /></div>
        </div>

        <template slot="status" slot-scope="text, record">
          <div v-show="record.isLoading">
            <a-popconfirm
              v-if="record.status === 1"
              title="是否启用"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirm(record, 0)"
              @cancel="cancel"
            >
              <a href="#">启用</a>
            </a-popconfirm>
            <a-popconfirm
              v-else
              title="是否禁用"
              ok-text="确定"
              cancel-text="取消"
              @confirm="confirm(record, 1)"
              @cancel="cancel"
            >
              <a href="#">禁用</a>
            </a-popconfirm>
          </div>
          <a-icon type="loading" v-show="!record.isLoading" />
        </template>

        <template slot="user" slot-scope="text, record">
          <span>{{ record.user.nickname }}</span>
        </template>

        <template slot="action" slot-scope="text, record">
          <a-button type="link" @click="openActionModal(record, 0)" style="padding: 0; margin-right: 10px;" :loading="record.iconloading">菜单权限</a-button>

          <a-button type="link" style="padding: 0; color: #f56c6c;" @click="openActionModal(record, 1)" :loading="record.iconLoading">删除</a-button>

          <a-button type="link" style="padding: 0; margin-left: 5px; color: #1790ff;" @click="openBindLawManagerModal(record)" :loading="record.iconLoading">绑定法律管家账号</a-button>

          <!-- <a-button type="link" style="padding: 0; margin-left: 10px; color: #409eff;" @click="updateCauseSourceClueEditRights(record)">线索编辑</a-button> -->
          <!-- 账号权限设置 modal -->
          <a-modal
            v-model="record.visible"
            title="权限管理设置"
            ok-text="确定"
            cancel-text="取消"
            @ok="onPermissionSetModalOkEvt(record)"
            @cancel="() => setModal1Visible(record)"
          >
            <div class="permission-set-body">
              <a-tree
                v-model="record.permissions"
                :tree-data="menuTreeData"
                :expanded-keys="expandedKeys"
                :selected-keys="selectedKeys"
                auto-expand-parent
                checkable
                checkStrictly
                @select="onSelect"
                @expand="onSelect"
              >
              </a-tree>
            </div>
          </a-modal>

          <!-- 删除账号 modal -->
          <a-modal
            v-model="record.visible1"
            title="移除此人"
            ok-text="确认"
            cancel-text="取消"
            @ok="onDelAccountModalOkEvt(record)"
            @cancel="() => setModal1Visible(record)"
          >
            <p>删除操作后,该管理员将被系统删除</p>
          </a-modal>
        </template>
      </a-table>
    </a-card>

    <!-- 开通优选 表单 modal -->
    <a-modal
      v-model="addHouTaiAccountModal.isShowAddHouTaiModal"
      :width="600"
      title="开通后台账号"
      destroyOnClose
      :afterClose="onAddHoutaiAccountModalAfterCloseEvt"
      @ok="onAddHoutaiAccountModalOkEvt"
    >
      <div class="addHoutai-modal-body">
        <!-- 姓名 -->
        <div class="addHoutai-item">
          <span class="addHoutai-key">姓名:</span>
          <a-input allow-clear placeholder="姓名" v-model="addHouTaiAccountModal.name" />
        </div>
        <!-- 手机号 -->
        <div class="addHoutai-item">
          <span class="addHoutai-key">手机号:</span>
          <a-input allow-clear placeholder="手机号" v-model="addHouTaiAccountModal.mobile" />
        </div>
        <!-- 密码 -->
        <div class="addHoutai-item">
          <span class="addHoutai-key">密码:</span>
          <a-input allow-clear placeholder="密码" v-model="addHouTaiAccountModal.password" />
        </div>
        <!-- 权限 -->
        <div class="addHoutai-item" style="ali">
          <span class="addHoutai-key">权限:</span>
          <div class="addHoutai-permission-tree">
            <a-tree
              v-model="addHouTaiAccountModal.permissions"
              :tree-data="menuTreeData"
              :expanded-keys="expandedKeys"
              auto-expand-parent
              checkable
              checkStrictly
              @select="onSelect"
              @expand="onSelect"
            >
            </a-tree>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 选择法律管家账号 modal -->
    <a-modal
      v-model="bindLawManagerUserModal.isShowBindModal"
      :width="400"
      title="选择法律管家账号"
      destroyOnClose
      :afterClose="onBindLawManagerModalAfterCloseEvt"
      @ok="onBindLawManagerModalOkEvt"
    >
      <div class="open-form-modal">
        <div class="open-form-item">
          <span class="form-key">选择法律管家:</span>
          <a-select v-model="bindLawManagerUserModal.lawManagerUserId" allowClear style="width: 192px">
            <a-select-option v-for="bType in lawManagerSelectList" :value="bType.value" :key="bType.label">
              {{ bType.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import AStyleButton from '@/components/Common/AStyleButton.vue'
import { message } from 'ant-design-vue'
import { getAdminPage, getAdminMenus, putChangeAdminStatus, deleteAdminPage, putChangeAdminPermissions, } from '@/api/permissions'
import * as permissionApi from '@/api/permissions'
import * as lawManagerApi from '@/api/lawManagerApi'

const columns = [
  {
    title: 'ID',
    key: 'admin_id',
    dataIndex: 'admin_id',
    scopedSlots: { customRender: 'admin_id' },
  },
  {
    title: '用户',
    key: 'nickname',
    dataIndex: 'nickname',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'nickname' },
  },
  {
    title: '账号',
    key: 'account',
    dataIndex: 'account',
    scopedSlots: { customRender: 'account' },
  },
  {
    title: '最近登录信息',
    key: 'login_at',
    dataIndex: 'login_at',
    scopedSlots: { customRender: 'login_at' },
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    title: '绑定法律管家',
    key: 'user',
    dataIndex: 'user',
    scopedSlots: { customRender: 'user' },
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

// 开通后台账号 modal
const ADD_HOUTAI_ACCOUNT_MODAL = {
  isShowAddHouTaiModal: false,
  name: '', // 结束时间
  account: '', // 账号
  password: '123456', // 密码
  mobile: '', // 手机号
  permissions: []
}

// 绑定法律管家 modal
const BIND_LAWMANAGER_MODAL = {
  isShowBindModal: false,

  lawManagerUserId: '', // 法律管家 userId
  houtaiAccountId: '', // 后台账号 id
}

export default {
  name: 'PermissionAdmin',
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      AStyleButton,
      columns,
      mask: false,
      loading: true,
      btnloading: false,
      assetsData: [],
      
      pagination: {
        current: 1,
        pageSize: 10,
        showTotal: (total) => `共${total}条`,
        onChange: this.onChange.bind(this),
        total: 1,
        showQuickJumper: true,
      },
      type: -1,
      search: '',

      menuTreeData: [], // 权限菜单tree 列表
      expandedKeys: [], // 权限菜单tree 设置选中的树节点
      selectedKeys: [],

      addHouTaiAccountModal: { ...ADD_HOUTAI_ACCOUNT_MODAL }, // 添加后台账户 modal

      lawManagerSelectList: [], // 律师管家 select
      bindLawManagerUserModal: { ...BIND_LAWMANAGER_MODAL }, // 绑定法律管家用户 id modal
    }
  },
  created() {
    this._getAdminMenus()
    this._getLawManagerList()
    this._getAdminAccountList(1)
  },
  methods: {
    /**
     * 获取律师管家列表
     */
     async _getLawManagerList(page = 1) {
       const param = { page, size: 100, source_type: 0 }

       try {
         const { data: lawManagerData } = await lawManagerApi.getLawManagerListApi(param)
         const _tempSelectList = []
         for (const lItem of lawManagerData.data) {
           const selectOpt = { label: lItem.name, value: lItem.user.user_id }
           _tempSelectList.push(selectOpt)
         }
         this.lawManagerSelectList = _tempSelectList
       } catch (error) {
         console.log(error)
       }
    },
    /**
     * 获取后台权限菜单
     */
    _getAdminMenus() {
      getAdminMenus().then((data) => {
        let datalist = data.data
        datalist = JSON.parse(JSON.stringify(datalist).replace(/admin_menu_name/g, 'title'))
        datalist = JSON.parse(JSON.stringify(datalist).replace(/admin_menu_id/g, 'key'))
        this.menuTreeData = datalist
      })
    },

    /**
     * 获取后台账号列表
     */
    _getAdminAccountList(page) {
      this.loading = true
      getAdminPage(page, this.search)
        .then(({ data }) => {
          this.pagination.total = data.total
          for (let i = 0; i < data.data.length; i++) {
            data.data[i]['visible'] = false
            data.data[i]['visible1'] = false
            data.data[i]['iconLoading'] = false
            data.data[i]['isLoading'] = true
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

    confirm(record, type) {
      record.isLoading = true
      putChangeAdminStatus(record.admin_id, type)
        .then((data) => {})
        .finally(() => {
          record.isLoading = false
        })
      this._getAdminAccountList(1)
      this.$message.success('修改成功')
    },
    cancel(e) {
      this.$message.error('取消操作')
    },
    /**
     * 打开 权限设置modal / 删除用户modal
     */
    openActionModal(record, num) {
      if (num === 0) {
        record.iconloading = true
        record.visible = true
      } else {
        record.iconLoading = true
        record.visible1 = true
      }
    },
    /**
     * 监听权限设置 modal select 事件
     */
    onSelect(selectedKeys, info) {
      if (this.expandedKeys[0] === selectedKeys[0]) {
        this.expandedKeys = []
      } else {
        this.expandedKeys = selectedKeys
      }
    },
    /**
     * 监听权限设置 modal ok 事件
     */
    onPermissionSetModalOkEvt(record) {
      // 权限 ids
      let permissionNums = '[]'

      if (record.permissions.checked) {
        permissionNums = JSON.stringify(record.permissions.checked)
      } else {
        permissionNums = JSON.stringify(record.permissions)
      }

      putChangeAdminPermissions(record.admin_id, permissionNums)
        .then((data) => {
          message.success('修改权限成功')
        })
        .catch(() => {
          message.error('修改权限失败')
        })
        .finally(() => {
          record.iconloading = false
          record.visible = false
        })
    },
    /**
     * 监听账号删除 modal ok 事件
     */
    onDelAccountModalOkEvt(record) {
      deleteAdminPage(record.admin_id)
        .then(() => {})
        .finally(() => {
          this.search = ''
          this._getAdminAccountList(this.pagination.current)
        })

      record.iconLoading = false
      record.visible1 = false
    },
    setModal1Visible(record) {
      record.iconloading = false
      record.iconLoading = false
      this.expandedKeys = []
    },
    onChange(pageNumber) {
      this.loading = true
      this._getAdminAccountList(pageNumber)
      this.pagination.current = pageNumber
    },
    onSearch(value) {
      this.loading = true
      this.search = value
      this._getAdminAccountList(1)
    },

    onAddHoutaiAccountModalAfterCloseEvt() {
      console.log('关闭')
    },

    /**
     * 监听添加后台账号 modal ok 事件
     */
    async onAddHoutaiAccountModalOkEvt() {
      const { addHouTaiAccountModal } = this

      if (!addHouTaiAccountModal.mobile.trim()) return this.$message.warning('请输入手机号')
      if (!addHouTaiAccountModal.password.trim()) return this.$message.warning('请输入密码')
      if (!addHouTaiAccountModal.name.trim()) return this.$message.warning('请输入姓名')

      const param = {
        mobile: addHouTaiAccountModal.mobile.trim(),
        name: addHouTaiAccountModal.name.trim(),
        password: addHouTaiAccountModal.password.trim(),
        account: addHouTaiAccountModal.mobile.trim(),
      }
      // 权限
      if (Array.isArray(addHouTaiAccountModal.permissions)) {
        param.permissions = '[]'
      } else {
        param.permissions = JSON.stringify(addHouTaiAccountModal.permissions.checked)
      }
      this.addHouTaiAccountModal.isShowAddHouTaiModal = false
      
      try {
        await permissionApi.addHouTaiAccountApi(param)
        // 重置数据
        this.addHouTaiAccountModal = { ...ADD_HOUTAI_ACCOUNT_MODAL }
        this.expandedKeys = []
        this._getAdminAccountList(1)
        this.$notification.success({ message: '添加账号成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开绑定法律管家 userId modal
     */
    openBindLawManagerModal(record) {
      console.log(record)

      this.bindLawManagerUserModal.houtaiAccountId = record.admin_id
      this.bindLawManagerUserModal.isShowBindModal = true
      console.log(this.bindLawManagerUserModal)
    },

    /**
     * 监听绑定法律管家 after close 事件
     */
    onBindLawManagerModalAfterCloseEvt() {
      this.bindLawManagerUserModal = Object.assign({}, BIND_LAWMANAGER_MODAL)
    },

    /**
     * 监听添加后台账号 modal ok 事件
     */
    async onBindLawManagerModalOkEvt() {
      const { bindLawManagerUserModal } = this

      if (!bindLawManagerUserModal.houtaiAccountId) return this.$message.warning('请选择账号')
      if (!bindLawManagerUserModal.lawManagerUserId) return this.$message.warning('请输入法律管家')
      this.bindLawManagerUserModal.isShowBindModal = false

      const param = {
        admin_id: bindLawManagerUserModal.houtaiAccountId,
        user_id: bindLawManagerUserModal.lawManagerUserId
      }

      console.log(param)
      
      try {
        await permissionApi.updateHoutaiAccountLawManagerUserId(param)
        this._getAdminAccountList(1)
        this.$notification.success({ message: '绑定账号成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 更新 账号线索页面 编辑权限
     */
    // async updateCauseSourceClueEditRights(record) {
    //   const param = {}
    //   console.log(record)
    //   return
      
    //   try {
    //     await permissionApi.updateCauseSourceClueEditRights(param)
    //     this._getAdminAccountList(this.pagination.current)
    //     this.$notification.success({ message: '更新线索编辑权限成功', duration: 3 })
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
  },
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

.permission-set-body {
  height: 400px;
  overflow-y: auto;
}

.addHoutai-modal-body {
  .addHoutai-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    &:last-child { margin-bottom: 0; }
    .addHoutai-key {
      min-width: 60px;
      font-size: 14px;
      font-weight: 600;
    }
    .addHoutai-permission-tree {
      height: 300px;
      overflow-y: auto;
      flex: 1;
    }
  }
} 



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
.userDiv {
  display: flex;
  justify-self: start;
}
p {
  font-size: 14px;
  margin: 0;
}
.colorbtn1 {
  width: 60px;
  height: 32px;
  background: #337ab7;
  color: #fff;
  opacity: 1;
  border-radius: 4px;
  border-style: none;
}
.colorbtn2 {
  width: 60px;
  height: 32px;
  background: #3980ea;
  color: #fff;
  opacity: 1;
  border-radius: 4px;
  border-style: none;
}
.colorbtn3 {
  width: 60px;
  height: 32px;
  background: #ff9700;
  color: #fff;
  opacity: 1;
  border-radius: 4px;
  border-style: none;
}
.colorbtn4 {
  width: 60px;
  height: 32px;
  background: #ff524c;
  color: #fff;
  opacity: 1;
  border-radius: 4px;
  border-style: none;
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
