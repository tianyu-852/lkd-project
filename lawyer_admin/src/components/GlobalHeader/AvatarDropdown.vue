<template>
  <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar size="small" :src="currentUser.avatar" class="antd-pro-global-header-index-avatar" />
      <span>{{ currentUser.name }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <!--        <a-menu-item v-if="menu" key="center" @click="handleToCenter">-->
        <!--          <a-icon type="user" />-->
        <!--          {{ $t('menu.account.center') }}-->
        <!--        </a-menu-item>-->
        <!--        <a-menu-item v-if="menu" key="settings" @click="handleToSettings">-->
        <!--          <a-icon type="setting" />-->
        <!--          {{ $t('menu.account.settings') }}-->
        <!--        </a-menu-item>-->
        <a-menu-divider v-if="menu" />
        <a-menu-item key="changePassword" @click="changePassword">
          <a-icon type="edit" />
          修改密码
        </a-menu-item>
        <a-modal
          v-model="visible"
          title="修改密码"
          ok-text="确认修改"
          cancel-text="取消修改"
          :confirm-loading="state.loading"
          @ok="handleOk"
        >
          <div class="flex-column-center margin-bottom-16">
            <span class="margin-right-16">旧密码</span>
            <a-input-password style="width: 400px" placeholder="旧密码" v-model="oldPassword" />
          </div>
          <div class="flex-column-center">
            <span class="margin-right-16">新密码</span>
            <a-input-password style="width: 400px" placeholder="新密码" v-model="newPassword" />
          </div>
        </a-modal>
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          退出
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { getUserPassword } from '@/api/user'

export default {
  data() {
    return {
      visible: false,
      oldPassword: '',
      newPassword: '',
      state: {
        loading: false,
      },
    }
  },
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null,
    },
    menu: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      this.state.loading = true
      getUserPassword(this.oldPassword, this.newPassword)
        .then((data) => {
          this.oldPassword = ''
          this.newPassword = ''
          this.visible = false
          this.$message.success('修改密码成功')
          this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        })
        .catch(() => {
          this.$message.success('修改密码失败')
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    changePassword() {
      this.oldPassword = ''
      this.newPassword = ''
      this.visible = true
    },
    handleToCenter() {
      this.$router.push({ path: '/account/center' })
    },
    handleToSettings() {
      this.$router.push({ path: '/account/settings' })
    },
    /**
     * 退出登录
     */
    handleLogout(e) {
     const _window = window
      
      Modal.confirm({
        title: '提示',
        content: '是否确认要退出',
        cancelText: '取消',
        okText: '确认',
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            // this.$router.push({ name: 'login' })
            // 重新导航到登录页面
            _window.location.assign(_window.location.origin + '/user/login')
            // window.location.reload(true)
          })
        },
        onCancel() {},
      })
    },
  },
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }

  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
