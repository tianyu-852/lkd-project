<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState('userModule', ['userInfo']),
    ...mapGetters('userModule', ['userId']),
  },
  onLaunch() {
    this.getSystemInfoAction(); // 获取系统信息
    this._checkUpdateApp();

    this.$AppReady.then(() => {
      // !this.userId && this.$Router.replace({ name: 'login' }); // 进入用户登录页面
    });

    // 监听全局的轻提示事件
    uni.$on('toastEvt', data => { this.$u.toast(data.msg); });
  },
  methods: {
    ...mapActions(['getSystemInfoAction']),
    /**
     * 检查更新小程序
     */
    _checkUpdateApp() {
      const updateManager = uni.getUpdateManager(); // 版本更新管理器
      if (uni.canIUse('getUpdateManager')) {
        // 监听向微信后台请求检查更新结果事件
        updateManager.onCheckForUpdate(res => {
          if (res.hasUpdate) {
            // 新的版本下载成功后回调
            updateManager.onUpdateReady(() => {
              uni.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                confirmText: '立即体验',
                confirmColor: '#2F84EB',
                cancelColor: '#666',
                success: res => {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  res.confirm && updateManager.applyUpdate();
                }
              });
            });
            // 新的版本下载失败回调
            updateManager.onUpdateFailed(() => {
              uni.showModal({ title: '新版本上线啦', content: '请您删除当前小程序, 重新搜索打开哟', confirmColor: '#2F84EB', showCancel: false });
            });
          }
        });
      } else {
        uni.showModal({ title: '提示', content: '当前微信版本过低, 无法使用该功能, 请升级到最新微信版本后重试', confirmColor: '#2F84EB', showCancel: false });
      }
    }
  }
};
</script>

<style lang="scss">
	/*每个页面公共css */
  @import "uview-ui/index.scss";
  @import "@/common/style/common.scss";
</style>
