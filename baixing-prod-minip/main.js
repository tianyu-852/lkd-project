import Vue from 'vue'
import App from './App'
import store from './store'
import uView from "uview-ui";
import dayjs from 'dayjs';
import * as commonUtil from '@/common/utils';
import api from '@/common/api';

/**
 * 挂载原型属性
 */
Vue.prototype.$photoPath = 'http://lkdimages.oss-cn-hangzhou.aliyuncs.com/mini-program';
Vue.prototype.$dayjs = dayjs;
Vue.prototype.$store = store;
Vue.prototype.$commonUtil = commonUtil;
Vue.prototype.$api = api;

Vue.use(uView)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	 store
})

app.$mount()
