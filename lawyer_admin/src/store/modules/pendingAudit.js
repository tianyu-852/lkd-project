const pendingAudit = {
  state: {
    userLogout: 0, // 用户注销审核 num
    fundraisingData: 0, // 众筹案件审核 num
    OrderEvaluateComplaint: 0, // 待处理评价 num
    AssetsStatistics: 0, // 待审核提现申请 num
  },
  mutations: {
    userLogoutUpload(state, payload) {
      state.userLogout = payload.UserDeleteData
    },
    fundraisingDataUpload(state, payload) {
      state.fundraisingData = payload.fundraisingData
    },
    OrderEvaluateComplaint(state, payload) {
      state.OrderEvaluateComplaint = payload.OrderEvaluateComplaint
    },
    AssetsStatistics(state, payload) {
      state.AssetsStatistics = payload.AssetsStatistics
    }
  },
  actions: {

  },
  getters: {
      
  }
}

export default pendingAudit
