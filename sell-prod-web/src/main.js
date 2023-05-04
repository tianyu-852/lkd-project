import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css';
import '@/common/style/index.scss';

import '@/router/permission'; // permission control
import api from '@/common/api';
import tablePagination from '@/components/table-pagination/table-pagination';

// 注册为全局组件
Vue.component('table-pagination', tablePagination);
Vue.use(ElementUI);

/**
 * 挂载原型属性
 */
Vue.prototype.$api = api;

Vue.config.productionTip = false;

console.log(process.env);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
