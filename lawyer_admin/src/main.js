// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import { Tree } from 'ant-design-vue'
import './mock'
import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import bootstrap from './core/bootstrap'

// 不导入模块中的任何内容，这将运行模块中的全局代码，但实际上不导入任何值 (执行所加载的模块)
import './core/lazy_use' // use lazy load components
import './permission' // permission control 权限路由
import './utils/filter' // global filter
import './global.less' // global style
import './quasar'
// import '@/utils/map/china'

import { VueJsonp } from 'vue-jsonp'
Vue.use(VueJsonp)

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)

/**
 * 挂载到原型实例
 */
Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios) // 使用插件
Vue.use(Tree)
Vue.use(VideoPlayer)

// use pro-layout components | 全局注册组件
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)

// console.log = function() {} // 注释所有console.log()
window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')

// console.log(process)
// console.log(process.env)
