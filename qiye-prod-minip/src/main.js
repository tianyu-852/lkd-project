import Vue from 'vue';
import App from './App';
import uView from 'uview-ui';
import store from '@/store';
import * as commonUtil from '@/common/utils';
import api from '@/common/api';

Vue.config.productionTip = false;
Vue.use(uView);

/**
 * 挂载原型属性
 */
Vue.prototype.$commonUtil = commonUtil;
Vue.prototype.$api = api;

App.mpType = 'app';

const app = new Vue({
  store,
  ...App
});

app.$mount();
