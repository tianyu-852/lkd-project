import Vue from 'vue';
import App from './App';
import { router,RouterMount } from './router.js';  //路径换成自己的
Vue.config.productionTip = false;
Vue.use(router);
// Vue.config.ignoredElements = ['wx-open-launch-weapp']

import uView from 'uview-ui';
Vue.use(uView);

App.mpType = 'app';

const app = new Vue({
    ...App
});
// #ifdef H5
RouterMount(app,router,'#app');
// #endif
// app.$mount()
