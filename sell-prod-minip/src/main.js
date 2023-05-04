import Vue from 'vue';
import App from './App';
import uView from 'uview-ui';
import dayjs from 'dayjs';
import * as commonUtil from '@/common/utils';
import store from '@/store';
import api from '@/common/api';
import { router, RouterMount } from '@/router';

Vue.use(uView);
Vue.use(router);

Vue.config.productionTip = false;

/**
 * 挂载原型属性
 */
Vue.prototype.$commonUtil = commonUtil;
Vue.prototype.$api = api;
Vue.prototype.$dayjs = dayjs;

App.mpType = 'app';

// 全局过滤器
Vue.filter('globalTimeFormat', function (value) {
  if (!value) return '';
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
});

const app = new Vue({
  store,
  ...App
});

// v1.3.5起 H5端 你应该去除原有的 app.$mount(); 使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, router, '#app');
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
