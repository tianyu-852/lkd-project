<template>
  <div class="login-container">
    <el-form ref="form" :model="userForm" label-width="80px" class="login-form">
      <div class="title-container">
        <h3 class="title">律快答-服务商系统</h3>
      </div>

      <!-- 用户名 -->
      <el-form-item prop="mobile">
        <el-input v-model="userForm.account" placeholder="请输入用户名" prefix-icon="el-icon-s-custom" />
      </el-form-item>

      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input v-model="userForm.password" placeholder="请输入密码" prefix-icon="el-icon-s-goods" />
      </el-form-item>

      <!-- 登录 -->
      <el-form-item>
        <el-button type="primary" class="btnLogin" :loading="isUserLoging" @click="handleUserLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      userForm: { account: '', password: '' },
      isUserLoging: false, // 用户是否正在登录中
    };
  },
  methods: {
    ...mapActions('userModule', ['userLoginAction']),
    /**
     * 用户登录
     */
    handleUserLogin() {
      const { userForm } = this;
      this.isUserLoging = true;
      
      this.userLoginAction({ account: userForm.account.trim(), password: userForm.password.trim() })
        .then(res => this._loginSuccess(res))
        .catch(error => console.log(error))
        .finally(() => {
          this.isUserLoging = false;
        });
    },
    /**
     * 登录成功后续
     */
    _loginSuccess(res) {
      this.$router.push({ path: '/' }); // 进入后台首页
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notify.success({ title: '欢迎', message: '登录律快答服务商系统', duration: 3000 });
      }, 1000);
    },
  }
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
