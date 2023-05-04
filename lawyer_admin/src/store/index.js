import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import district from './modules/district'
import step from './modules/step'
import pendingAudit from './modules/pendingAudit'
// default router permission control
import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

// 测试环境后台账号
const testRoleList = [ '何丹', 'hy', '沈纯业', '糖糖' ]

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    district,
    step,
    pendingAudit
  },
  state: {
    current: 0,
    // 数据 角色
    dataRoleList: ['老板', '王晓', '产品', '前端', '韩天娇', '高忆涵', '蕾蕾', '运营1', ...testRoleList], 
    // 开通会员 角色
    openVipRoleList: ['老板', '高忆涵', '产品', '前端', ...testRoleList],
    // 法务 角色
    // fawuRoleList: ['竺思岐', '熊冉', '赵娜娜', '冯梦茹'], 
  },
  mutations: {
    increment (state) {
      state.current++
    }
  },
  actions: {

  },
  getters
})
