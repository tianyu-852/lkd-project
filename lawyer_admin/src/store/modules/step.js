const step = {
  state: {
   currentStep: 0,
   selectStep: 0,
  },
  mutations: {
  edit(state, payload) {
      state.currentStep = payload.currentStep
      state.selectStep = payload.selectStep 
  },
  chooseSteps(state, payload) {
    state.selectStep = payload
  },
  nextSteps(state, payload) {
    state.currentStep = payload
  }
  },
  actions: {

  },
  getters: {
      
  }
}
// 众筹步骤条 正在查看步骤和进行到的步骤
export default step
