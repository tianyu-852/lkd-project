<template>
  <a-config-provider :locale="zhCN">
    <div id="app">
      <!-- 这里是会被缓存的视图组件 -->
      <keep-alive>
        <router-view v-if="isRouterAlive && $route.meta.keepAlive" />
      </keep-alive>
      <!-- 这里是不被缓存的视图组件 -->
      <router-view v-if="isRouterAlive && !$route.meta.keepAlive" />
    </div>
  </a-config-provider>
</template>
<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
moment.locale('en')
export default {
  name: 'App',
  provide(){
    return {
      reloadPage: this._reloadPage
    }
  },
  data() {
    return {
      zhCN,
      isRouterAlive: true
    }
  },
  computed: {
    // 只是为了切换语言时，更新标题
    locale() {
      const { title } = this.$route.meta
      title && setDocumentTitle(`${i18nRender(title)} - ${domTitle}`)
      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    },
  },
  methods: {
    /**
     * 重新加载当前页面
     */
    _reloadPage() {
      this.isRouterAlive = false
      this.$nextTick(function(){
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
@import 'utils/common.less';
</style>
