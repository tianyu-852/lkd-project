<template>
  <div class="body">
    <div class="main">
      <div class="user-layout-login">
        <!-- logo图片 -->
        <div v-if="curHostname !== leagueHouTaiHostname" class="top">
          <img :src="topImage" />
        </div>

        <div class="login">
          <span v-if="curHostname === leagueHouTaiHostname" class="login-tips" style="padding-top: 200px;">加盟商管理后台登录窗口</span>
          <span v-else class="login-tips">百姓律师后台登录窗口</span>

          <!-- 账号 -->
          <div class="login-row">
            <img :src="require('@/assets/icons/zh_icon.png')" />
            <a-input placeholder="请输入您的账号" v-model="userInfo.account" />
          </div>
          <!-- 密码 -->
          <div class="login-row">
            <img :src="require('@/assets/icons/mm_icon.png')" />
            <a-input-password placeholder="请输入您的密码" v-model="userInfo.password" @keyup.enter="handleLogin" />
          </div>
          <!-- 登录按钮 -->
          <a-button type="primary" @click="handleLogin" :loading="state.loginBtn" :disabled="state.loginBtn">
            登 录
          </a-button>
        </div>
      </div>
    </div>
    <div
      style="
        background: rgba(255, 255, 255, 0.72);
        bottom: 0;
        text-align: center;
        font-size: 22px;
        width: 100%;
        position: absolute;
      "
    >
      浙江律快答网络科技有限公司 © 2022 版权所有 浙ICP备20020243号-3
    </div>
  </div>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Login',
  data: () => {
    return {
      userInfo: { account: '', password: '', },
      topImage: require('@/assets/login_top.png'),
      state: { loginBtn: false, },

      curHostname: window.location.hostname, 
      leagueHouTaiHostname: 'abc.com', // 加盟商后台域名
    }
  },
  methods: {
    ...mapActions(['Login']),
    /**
     * 点击登录
     */
    handleLogin() {
      const { state, Login, userInfo } = this

      state.loginBtn = true
      // 执行 user module 登录 action
      Login(userInfo)
        .then((res) => this.loginSuccess(res))
        .catch((err) => console.log(err))
        .finally(() => {
          state.loginBtn = false
        })
    },
    /**
     * 登录成功提醒
     */
    loginSuccess(res) {
      // 销售账号 则进入销售客户列表
      if (this.userInfo.account.indexOf('xiaoshou') > -1) {
        this.$router.push({ name: 'sellClientList' })
      } else {
        this.$router.push({ path: '/' }) // 进入后台首页
      }

      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`,
        })
      }, 1000)
    },
  },
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/lib/style/themes/default.less';

@width: 334px;
.body {
  height: 100%;
  width: 100%;
}
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  .user-layout-login {
    width: 600px;
    height: 600px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.36) 0%,
      rgba(255, 255, 255, 0.72) 0%,
      rgba(255, 255, 255, 0.56) 100%
    );
    border-radius: 9px;

    .top {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .login {
      display: flex;
      flex-direction: column;
      align-items: center;

      button {
        margin-top: 40px;
        width: @width;
        height: 40px;
        font-size: 16px;
      }

      .login-tips {
        font-size: 20px;
        font-weight: bold;
        line-height: 28px;
        color: #787e8d;
      }

      .login-row {
        width: @width;
        height: 30px;
        display: flex;
        margin-top: 24px;

        img {
          width: 26px;
          height: 26px;
          margin-right: 3px;
        }
      }
    }
  }
}
</style>
