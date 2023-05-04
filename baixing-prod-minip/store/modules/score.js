const home = {
	state: {
		status:false,
		msg:null,
		info:null
	},
	actions: {
		
	},
	mutations: {
		setOrderStatus(state,data){
			state.status = data
		},
		setOrderMsg(state,data){
			state.msg = data
		},
		setOrderInfo(state,data){
			state.info = data
		}
	}

};

export default home;
