import Vue from 'vue';
import VueRouter from 'vue-router';
import { constantRouterMap, asyncRouterMap } from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: constantRouterMap
});

// router.addRoutes(asyncRouterMap);

export default router;
